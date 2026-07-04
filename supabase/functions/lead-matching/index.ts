// Matches a customer_requests row to relevant professionals by city,
// category, verification, and plan — then notifies them (in-app +
// email). Runs with the service role because it needs to read across
// professional_accounts beyond what the submitting customer's own RLS
// session should see.
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { createAdminClient } from "../_shared/supabase-admin.ts";

const PLAN_WEIGHT: Record<string, number> = { elite: 30, premium: 20, standard: 10, free: 0 };
const VERIFICATION_WEIGHT: Record<string, number> = {
  premium_verified: 25,
  address_verified: 18,
  business_verified: 12,
  identity_verified: 6,
  unverified: 0,
};

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { requestId } = await req.json();
    if (!requestId) return jsonResponse({ error: "invalid_request" }, 400);

    const admin = createAdminClient();

    const { data: request } = await admin.from("customer_requests").select("*").eq("id", requestId).single();
    if (!request) return jsonResponse({ error: "request_not_found" }, 404);

    // Candidate pool: same category, active listings. City match is
    // scored rather than filtered so a strong out-of-city professional
    // still surfaces if few local matches exist — no opportunities are
    // hidden outright based on plan tier, only ranked.
    const { data: candidates } = await admin
      .from("professional_accounts")
      .select("id, owner_id, business_name, city, verification_status, subscription_plan_id, plan:subscription_plans(slug)")
      .eq("category_id", request.category_id)
      .eq("status", "active")
      .eq("availability_status", "available")
      .limit(200);

    if (!candidates || candidates.length === 0) {
      return jsonResponse({ matched: 0 });
    }

    const scored = candidates
      .map((c: Record<string, unknown>) => {
        const planSlug = ((c.plan as { slug?: string } | null)?.slug) ?? "free";
        let score = PLAN_WEIGHT[planSlug] ?? 0;
        score += VERIFICATION_WEIGHT[c.verification_status as string] ?? 0;
        if (c.city === request.city) score += 40;
        return { ...c, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20); // cap notification fan-out per request

    const matchRows = scored.map((c) => ({
      request_id: requestId,
      professional_account_id: c.id as string,
      match_score: c.matchScore,
      notified_at: new Date().toISOString(),
    }));

    await admin.from("request_matches").upsert(matchRows, { onConflict: "request_id,professional_account_id" });

    const notifications = scored.map((c) => ({
      user_id: c.owner_id as string,
      title: "New matching fashion request",
      body: `A customer in ${request.city} is looking for: ${request.title}`,
      type: "lead" as const,
      action_url: "/dashboard/leads",
    }));

    if (notifications.length > 0) {
      await admin.from("notifications").insert(notifications);
    }

    // Email only the top few matches to avoid inbox fatigue for lower-
    // ranked, lower-plan professionals on every single request.
    const internalSecret = Deno.env.get("INTERNAL_FUNCTION_SECRET");
    const functionsUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/resend-transactional-email`;
    const topMatches = scored.slice(0, 5);

    for (const match of topMatches) {
      const { data: ownerProfile } = await admin.from("profiles").select("email").eq("id", match.owner_id as string).maybeSingle();
      if (!ownerProfile?.email) continue;

      await fetch(functionsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: "new_lead_received",
          to: ownerProfile.email,
          variables: { leadName: "A STYLEATLAS customer", businessName: match.business_name },
          internalSecret,
        }),
      }).catch((err) => console.error("email dispatch failed", err));
    }

    return jsonResponse({ matched: scored.length });
  } catch (error) {
    console.error("lead-matching error", error);
    return jsonResponse({ error: "internal_error" }, 500);
  }
});

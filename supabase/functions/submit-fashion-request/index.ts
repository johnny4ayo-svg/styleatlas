// Validated, rate-limited marketplace request submission for non-browser
// clients. The Next.js app submits directly via a server action under
// RLS (see src/lib/actions/customer-requests.ts) and then invokes
// lead-matching itself; this function provides the same path over HTTP
// for other consumers, finishing with the same lead-matching handoff.
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { createAdminClient, getCallingUser } from "../_shared/supabase-admin.ts";

interface FashionRequestBody {
  title: string;
  categoryId: string;
  city: string;
  state: string;
  styleNeeded?: string;
  budgetMin?: number;
  budgetMax?: number;
  deadline?: string;
  numberOfOutfits?: number;
  measurementsStatus?: "have" | "need_help" | "not_applicable";
  details: string;
  preferredContactMethod: "whatsapp" | "phone" | "email";
  consentGiven: boolean;
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await getCallingUser(req);
    if (!user) return jsonResponse({ error: "unauthorized" }, 401);

    const body: FashionRequestBody = await req.json();
    if (!body.title || !body.categoryId || !body.city || !body.state || !body.details || !body.consentGiven) {
      return jsonResponse({ error: "invalid_request" }, 400);
    }
    if (body.details.length < 20) return jsonResponse({ error: "details_too_short" }, 400);

    const admin = createAdminClient();
    const { data: profile } = await admin.from("profiles").select("id, email").eq("auth_user_id", user.id).single();
    if (!profile) return jsonResponse({ error: "profile_not_found" }, 404);

    const { data: allowed } = await admin.rpc("check_rate_limit", {
      p_bucket_key: profile.id,
      p_action: "customer_request_submission",
      p_max_count: 5,
      p_window_seconds: 86400,
    });
    if (!allowed) return jsonResponse({ error: "rate_limited" }, 429);

    const { data: request, error } = await admin
      .from("customer_requests")
      .insert({
        customer_id: profile.id,
        title: body.title,
        category_id: body.categoryId,
        city: body.city,
        state: body.state,
        style_needed: body.styleNeeded ?? null,
        budget_min: body.budgetMin ?? null,
        budget_max: body.budgetMax ?? null,
        deadline: body.deadline ?? null,
        number_of_outfits: body.numberOfOutfits ?? null,
        measurements_status: body.measurementsStatus ?? null,
        details: body.details,
        preferred_contact_method: body.preferredContactMethod,
        consent_given: body.consentGiven,
      })
      .select("id")
      .single();

    if (error || !request) return jsonResponse({ error: "server_error", detail: error?.message }, 500);

    const functionsUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1/lead-matching`;
    await fetch(functionsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: req.headers.get("Authorization") ?? "" },
      body: JSON.stringify({ requestId: request.id }),
    }).catch((err) => console.error("lead-matching invoke failed", err));

    const internalSecret = Deno.env.get("INTERNAL_FUNCTION_SECRET");
    await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/resend-transactional-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template: "customer_request_received",
        to: profile.email,
        variables: { title: body.title },
        internalSecret,
      }),
    }).catch((err) => console.error("email dispatch failed", err));

    return jsonResponse({ success: true, requestId: request.id });
  } catch (error) {
    console.error("submit-fashion-request error", error);
    return jsonResponse({ error: "internal_error" }, 500);
  }
});

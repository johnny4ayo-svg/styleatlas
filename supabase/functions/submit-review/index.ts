// Centralized, rate-limited review submission. The Next.js app can (and
// does, for logged-in users) insert reviews directly under RLS — this
// function exists for non-browser clients (mobile apps, partners) that
// need the same validation, rate limiting, and duplicate-service check
// without a browser session cookie.
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { createAdminClient, getCallingUser } from "../_shared/supabase-admin.ts";

interface SubmitReviewBody {
  professionalAccountId: string;
  rating: number;
  title?: string;
  body: string;
  serviceUsed?: string;
  communicationRating?: number;
  qualityRating?: number;
  deliveryRating?: number;
  valueRating?: number;
  orderCompletedAt?: string;
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await getCallingUser(req);
    if (!user) return jsonResponse({ error: "unauthorized" }, 401);

    const body: SubmitReviewBody = await req.json();
    if (!body.professionalAccountId || !body.rating || !body.body || body.body.length < 20) {
      return jsonResponse({ error: "invalid_request" }, 400);
    }
    if (body.rating < 1 || body.rating > 5) return jsonResponse({ error: "invalid_rating" }, 400);

    const admin = createAdminClient();
    const { data: profile } = await admin.from("profiles").select("id").eq("auth_user_id", user.id).single();
    if (!profile) return jsonResponse({ error: "profile_not_found" }, 404);

    const { data: allowed } = await admin.rpc("check_rate_limit", {
      p_bucket_key: profile.id,
      p_action: "review_submission",
      p_max_count: 5,
      p_window_seconds: 86400,
    });
    if (!allowed) return jsonResponse({ error: "rate_limited" }, 429);

    const { error } = await admin.from("reviews").insert({
      professional_account_id: body.professionalAccountId,
      customer_id: profile.id,
      rating: body.rating,
      title: body.title ?? null,
      body: body.body,
      service_used: body.serviceUsed ?? null,
      communication_rating: body.communicationRating ?? null,
      quality_rating: body.qualityRating ?? null,
      delivery_rating: body.deliveryRating ?? null,
      value_rating: body.valueRating ?? null,
      order_completed_at: body.orderCompletedAt ?? null,
      status: "pending",
    });

    if (error) {
      if (error.code === "23505") return jsonResponse({ error: "duplicate_review" }, 409);
      return jsonResponse({ error: "server_error", detail: error.message }, 500);
    }

    const { data: account } = await admin
      .from("professional_accounts")
      .select("owner_id, business_name")
      .eq("id", body.professionalAccountId)
      .maybeSingle();

    if (account) {
      await admin.from("notifications").insert({
        user_id: account.owner_id,
        title: "New review received",
        body: `You received a new ${body.rating}-star review on ${account.business_name}. It's pending moderation.`,
        type: "review",
        action_url: "/dashboard/reviews",
      });
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("submit-review error", error);
    return jsonResponse({ error: "internal_error" }, 500);
  }
});

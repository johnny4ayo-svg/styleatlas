// Reconciliation sweep intended to run on a schedule (e.g. Supabase cron
// / pg_cron, hourly). Expires subscriptions whose current_period_end has
// passed without a renewal webhook having arrived, and downgrades the
// linked professional_account back to the free plan so paid features are
// correctly locked again. Idempotent — safe to run repeatedly.
import { jsonResponse } from "../_shared/cors.ts";
import { createAdminClient } from "../_shared/supabase-admin.ts";

Deno.serve(async (req) => {
  // This function is triggered by a scheduled job / cron, authenticated
  // with the project's service role via the Authorization header that
  // Supabase's scheduler attaches automatically — no separate secret
  // needed, but reject obviously unauthenticated manual calls in
  // production by requiring the standard function auth header.
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  try {
    const admin = createAdminClient();
    const now = new Date().toISOString();

    const { data: expiring } = await admin
      .from("subscriptions")
      .select("id, professional_account_id, user_id")
      .lt("current_period_end", now)
      .eq("status", "active")
      .eq("cancel_at_period_end", false);

    const { data: freePlan } = await admin.from("subscription_plans").select("id").eq("slug", "free").single();

    let expiredCount = 0;
    for (const sub of expiring ?? []) {
      await admin.from("subscriptions").update({ status: "expired" }).eq("id", sub.id);

      if (sub.professional_account_id) {
        await admin
          .from("professional_accounts")
          .update({ subscription_status: "expired", subscription_plan_id: freePlan?.id ?? null })
          .eq("id", sub.professional_account_id);

        const { data: account } = await admin
          .from("professional_accounts")
          .select("owner_id, business_name")
          .eq("id", sub.professional_account_id)
          .single();

        if (account) {
          await admin.from("notifications").insert({
            user_id: account.owner_id,
            title: "Subscription expired",
            body: `Your subscription for ${account.business_name} has expired and reverted to the Free plan.`,
            type: "subscription",
            action_url: "/dashboard/billing",
          });
        }
      }
      expiredCount++;
    }

    // Cancel-at-period-end subscriptions that have now reached their end
    // date should finalize to 'canceled' rather than staying 'active'.
    const { data: canceling } = await admin
      .from("subscriptions")
      .select("id, professional_account_id")
      .lt("current_period_end", now)
      .eq("cancel_at_period_end", true)
      .neq("status", "canceled");

    for (const sub of canceling ?? []) {
      await admin.from("subscriptions").update({ status: "canceled" }).eq("id", sub.id);
      if (sub.professional_account_id) {
        await admin
          .from("professional_accounts")
          .update({ subscription_status: "canceled", subscription_plan_id: freePlan?.id ?? null })
          .eq("id", sub.professional_account_id);
      }
    }

    return jsonResponse({ expired: expiredCount, canceled: canceling?.length ?? 0 });
  } catch (error) {
    console.error("subscription-sync error", error);
    return jsonResponse({ error: "internal_error" }, 500);
  }
});

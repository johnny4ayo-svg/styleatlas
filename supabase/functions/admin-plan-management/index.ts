// Admin-only plan and subscription management. Every mutation is
// double-checked against the caller's role here (never trust the
// frontend to only show this UI to admins) and every manual billing
// override is written to subscription_overrides for audit purposes, per
// the security requirement that billing changes must be auditable.
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { createAdminClient, getCallingUser } from "../_shared/supabase-admin.ts";

type Action =
  | { type: "upsert_plan"; plan: Record<string, unknown> }
  | { type: "override_subscription"; subscriptionId: string; action: "extend" | "downgrade" | "upgrade" | "cancel" | "reactivate"; reason: string; newPeriodEnd?: string; newPlanId?: string };

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await getCallingUser(req);
    if (!user) return jsonResponse({ error: "unauthorized" }, 401);

    const admin = createAdminClient();
    const { data: profile } = await admin.from("profiles").select("id, role").eq("auth_user_id", user.id).single();
    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
      return jsonResponse({ error: "forbidden" }, 403);
    }

    const body: Action = await req.json();

    if (body.type === "upsert_plan") {
      if (profile.role !== "super_admin") return jsonResponse({ error: "super_admin_only" }, 403);

      const { data, error } = await admin.from("subscription_plans").upsert(body.plan).select().single();
      if (error) return jsonResponse({ error: "server_error", detail: error.message }, 500);

      await admin.from("audit_logs").insert({
        actor_id: profile.id,
        action: "upsert_subscription_plan",
        entity_type: "subscription_plans",
        entity_id: data.id,
        new_values: body.plan,
      });

      return jsonResponse({ success: true, plan: data });
    }

    if (body.type === "override_subscription") {
      const { data: subscription } = await admin.from("subscriptions").select("*").eq("id", body.subscriptionId).single();
      if (!subscription) return jsonResponse({ error: "subscription_not_found" }, 404);

      const updates: Record<string, unknown> = {};
      if (body.action === "extend" && body.newPeriodEnd) updates.current_period_end = body.newPeriodEnd;
      if (body.action === "cancel") {
        updates.status = "canceled";
        updates.cancel_at_period_end = true;
        updates.canceled_at = new Date().toISOString();
      }
      if (body.action === "reactivate") updates.status = "active";
      if ((body.action === "upgrade" || body.action === "downgrade") && body.newPlanId) updates.plan_id = body.newPlanId;

      const { data: updated, error } = await admin.from("subscriptions").update(updates).eq("id", body.subscriptionId).select().single();
      if (error) return jsonResponse({ error: "server_error", detail: error.message }, 500);

      await admin.from("subscription_overrides").insert({
        subscription_id: body.subscriptionId,
        performed_by: profile.id,
        action: body.action,
        reason: body.reason,
        previous_state: subscription,
        new_state: updated,
      });

      if (body.action === "upgrade" || body.action === "downgrade") {
        await admin.from("professional_accounts").update({ subscription_plan_id: updates.plan_id }).eq("id", subscription.professional_account_id);
      }

      return jsonResponse({ success: true, subscription: updated });
    }

    return jsonResponse({ error: "unknown_action" }, 400);
  } catch (error) {
    console.error("admin-plan-management error", error);
    return jsonResponse({ error: "internal_error" }, 500);
  }
});

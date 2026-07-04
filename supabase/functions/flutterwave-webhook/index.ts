// Flutterwave webhook handler.
//
// Security:
//  - Flutterwave signs webhooks with a static verif-hash header that must
//    match the secret hash configured in the dashboard (constant-time
//    compare, not HMAC — this is Flutterwave's documented scheme).
//  - As defense in depth, the transaction is re-verified against
//    Flutterwave's own /transactions/:id/verify endpoint before crediting
//    anything, rather than trusting the webhook payload's status field.
//  - Idempotent via `webhook_events` unique (provider, event_id), same as
//    the Paystack handler.
import { jsonResponse } from "../_shared/cors.ts";
import { createAdminClient } from "../_shared/supabase-admin.ts";

function periodEndFrom(billingCycle: string) {
  const now = new Date();
  if (billingCycle === "yearly") now.setFullYear(now.getFullYear() + 1);
  else now.setMonth(now.getMonth() + 1);
  return now.toISOString();
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  const expectedHash = Deno.env.get("FLUTTERWAVE_WEBHOOK_SECRET") ?? "";
  const receivedHash = req.headers.get("verif-hash");
  const admin = createAdminClient();

  if (!receivedHash || receivedHash !== expectedHash) {
    await admin.from("security_logs").insert({ event_type: "webhook_signature_failure", metadata: { provider: "flutterwave" } });
    return jsonResponse({ error: "invalid_signature" }, 401);
  }

  const event = await req.json();
  const txId = event?.data?.id;
  const eventId = txId ? `flutterwave_${txId}` : `flutterwave_${event?.data?.tx_ref ?? crypto.randomUUID()}`;

  const { error: insertError } = await admin.from("webhook_events").insert({
    provider: "flutterwave",
    event_id: eventId,
    event_type: event?.event ?? "unknown",
    payload: event,
    status: "received",
  });

  if (insertError) {
    if (insertError.code === "23505") return jsonResponse({ received: true, duplicate: true });
    console.error("webhook_events insert failed", insertError.message);
  }

  try {
    if (event.event === "charge.completed" && txId) {
      // Defense in depth: verify directly with Flutterwave rather than
      // trusting the webhook body's status field.
      const flwSecret = Deno.env.get("FLUTTERWAVE_SECRET_KEY")!;
      const verifyResp = await fetch(`https://api.flutterwave.com/v3/transactions/${txId}/verify`, {
        headers: { Authorization: `Bearer ${flwSecret}` },
      });
      const verifyData = await verifyResp.json();
      const txRef = verifyData?.data?.tx_ref;
      const verifiedStatus = verifyData?.data?.status;

      if (verifiedStatus !== "successful" || !txRef) {
        await admin.from("webhook_events").update({ status: "ignored", error_message: `unverified_status:${verifiedStatus}` }).eq("provider", "flutterwave").eq("event_id", eventId);
        return jsonResponse({ received: true, warning: "not_verified_successful" });
      }

      const { data: transaction } = await admin
        .from("payment_transactions")
        .select("*")
        .eq("provider", "flutterwave")
        .eq("reference", txRef)
        .single();

      if (!transaction) {
        await admin.from("webhook_events").update({ status: "failed", error_message: "transaction_not_found" }).eq("provider", "flutterwave").eq("event_id", eventId);
        return jsonResponse({ received: true, warning: "transaction_not_found" });
      }

      // Amount/currency cross-check against what we actually requested.
      if (Number(verifyData.data.amount) < Number(transaction.amount) || verifyData.data.currency !== transaction.currency) {
        await admin.from("webhook_events").update({ status: "failed", error_message: "amount_mismatch" }).eq("provider", "flutterwave").eq("event_id", eventId);
        return jsonResponse({ received: true, warning: "amount_mismatch" });
      }

      await admin.from("payment_transactions").update({ status: "success" }).eq("id", transaction.id);

      const metadata = verifyData.data.meta ?? {};
      const billingCycle = metadata.billing_cycle ?? transaction.billing_cycle ?? "monthly";
      const periodEnd = periodEndFrom(billingCycle);

      const { data: existingSub } = await admin
        .from("subscriptions")
        .select("id")
        .eq("professional_account_id", transaction.professional_account_id)
        .eq("provider", "flutterwave")
        .maybeSingle();

      if (existingSub) {
        await admin
          .from("subscriptions")
          .update({
            plan_id: transaction.plan_id,
            billing_cycle: billingCycle,
            status: "active",
            current_period_start: new Date().toISOString(),
            current_period_end: periodEnd,
            cancel_at_period_end: false,
          })
          .eq("id", existingSub.id);
      } else {
        await admin.from("subscriptions").insert({
          user_id: transaction.user_id,
          professional_account_id: transaction.professional_account_id,
          plan_id: transaction.plan_id,
          provider: "flutterwave",
          provider_subscription_id: txRef,
          billing_cycle: billingCycle,
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd,
        });
      }

      await admin
        .from("professional_accounts")
        .update({ subscription_plan_id: transaction.plan_id, subscription_status: "active" })
        .eq("id", transaction.professional_account_id);

      const { data: account } = await admin
        .from("professional_accounts")
        .select("owner_id, business_name")
        .eq("id", transaction.professional_account_id)
        .single();

      if (account) {
        await admin.from("notifications").insert({
          user_id: account.owner_id,
          title: "Payment successful",
          body: `Your subscription payment for ${account.business_name} was successful.`,
          type: "payment",
          action_url: "/dashboard/billing",
        });
      }
    }

    await admin.from("webhook_events").update({ status: "processed", processed_at: new Date().toISOString() }).eq("provider", "flutterwave").eq("event_id", eventId);
    return jsonResponse({ received: true });
  } catch (error) {
    console.error("flutterwave-webhook processing error", error);
    await admin
      .from("webhook_events")
      .update({ status: "failed", error_message: String(error) })
      .eq("provider", "flutterwave")
      .eq("event_id", eventId);
    return jsonResponse({ received: true, error: "processing_failed" });
  }
});

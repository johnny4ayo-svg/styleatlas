// Paystack webhook handler.
//
// Security:
//  - Verifies the `x-paystack-signature` header (HMAC-SHA512 of the raw
//    body using the Paystack secret key) before trusting anything in the
//    payload.
//  - Every event is recorded in `webhook_events` keyed on (provider,
//    event_id) BEFORE it's processed, so duplicate deliveries from
//    Paystack's at-least-once retry behavior are idempotent — a unique
//    violation means "already handled", and we return 200 immediately.
//  - Never activates a paid plan from a frontend redirect alone; only this
//    server-verified webhook flips subscription_status to 'active'.
import { jsonResponse } from "../_shared/cors.ts";
import { createAdminClient } from "../_shared/supabase-admin.ts";

async function verifySignature(rawBody: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const computed = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return computed === signature;
}

function periodEndFrom(billingCycle: string) {
  const now = new Date();
  if (billingCycle === "yearly") now.setFullYear(now.getFullYear() + 1);
  else now.setMonth(now.getMonth() + 1);
  return now.toISOString();
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  const rawBody = await req.text();
  const secret = Deno.env.get("PAYSTACK_SECRET_KEY") ?? "";
  const signature = req.headers.get("x-paystack-signature");

  const admin = createAdminClient();

  const isValid = await verifySignature(rawBody, signature, secret);
  if (!isValid) {
    await admin.from("security_logs").insert({
      event_type: "webhook_signature_failure",
      metadata: { provider: "paystack" },
    });
    return jsonResponse({ error: "invalid_signature" }, 401);
  }

  const event = JSON.parse(rawBody);
  const eventId = event?.data?.id ? `paystack_${event.data.id}` : `paystack_${event?.data?.reference ?? crypto.randomUUID()}`;

  // Idempotency gate: insert first, bail out on conflict.
  const { error: insertError } = await admin.from("webhook_events").insert({
    provider: "paystack",
    event_id: eventId,
    event_type: event?.event ?? "unknown",
    payload: event,
    status: "received",
  });

  if (insertError) {
    // Unique violation => already processed this event.
    if (insertError.code === "23505") return jsonResponse({ received: true, duplicate: true });
    console.error("webhook_events insert failed", insertError.message);
  }

  try {
    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const metadata = event.data.metadata ?? {};

      const { data: transaction } = await admin
        .from("payment_transactions")
        .select("*")
        .eq("provider", "paystack")
        .eq("reference", reference)
        .single();

      if (!transaction) {
        await admin.from("webhook_events").update({ status: "failed", error_message: "transaction_not_found" }).eq("provider", "paystack").eq("event_id", eventId);
        return jsonResponse({ received: true, warning: "transaction_not_found" });
      }

      await admin.from("payment_transactions").update({ status: "success" }).eq("id", transaction.id);

      const billingCycle = metadata.billing_cycle ?? transaction.billing_cycle ?? "monthly";
      const periodEnd = periodEndFrom(billingCycle);

      const { data: existingSub } = await admin
        .from("subscriptions")
        .select("id")
        .eq("professional_account_id", transaction.professional_account_id)
        .eq("provider", "paystack")
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
          provider: "paystack",
          provider_customer_id: event.data.customer?.customer_code ?? null,
          provider_subscription_id: reference,
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
    } else if (event.event === "subscription.disable" || event.event === "subscription.not_renew") {
      const email = event.data?.customer?.email;
      if (email) {
        const { data: profile } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
        if (profile) {
          await admin.from("subscriptions").update({ status: "canceled", cancel_at_period_end: true }).eq("user_id", profile.id).eq("provider", "paystack");
        }
      }
    }

    await admin.from("webhook_events").update({ status: "processed", processed_at: new Date().toISOString() }).eq("provider", "paystack").eq("event_id", eventId);
    return jsonResponse({ received: true });
  } catch (error) {
    console.error("paystack-webhook processing error", error);
    await admin
      .from("webhook_events")
      .update({ status: "failed", error_message: String(error) })
      .eq("provider", "paystack")
      .eq("event_id", eventId);
    // Still return 200 so Paystack doesn't hammer retries for a bug on our
    // side indefinitely; the failure is recorded for investigation.
    return jsonResponse({ received: true, error: "processing_failed" });
  }
});

// Creates a Paystack or Flutterwave checkout session for a subscription
// plan. The frontend only ever sends intent (plan_slug, billing_cycle,
// provider) — price, currency, and eligibility are all re-validated here
// against the subscription_plans table before any payment session is
// created. Never trust a price sent from the browser.
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { createAdminClient, getCallingUser } from "../_shared/supabase-admin.ts";

interface CheckoutRequestBody {
  plan_slug: "standard" | "premium" | "elite";
  billing_cycle: "monthly" | "yearly";
  provider: "paystack" | "flutterwave";
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const user = await getCallingUser(req);
    if (!user) return jsonResponse({ error: "unauthorized" }, 401);

    const body: CheckoutRequestBody = await req.json();
    if (!body?.plan_slug || !body?.billing_cycle || !body?.provider) {
      return jsonResponse({ error: "invalid_request" }, 400);
    }

    const admin = createAdminClient();

    const { data: profile } = await admin
      .from("profiles")
      .select("id, email, full_name, role")
      .eq("auth_user_id", user.id)
      .single();

    if (!profile) return jsonResponse({ error: "profile_not_found" }, 404);
    if (!["professional", "professional_staff", "admin", "super_admin"].includes(profile.role)) {
      return jsonResponse({ error: "not_a_professional_account" }, 403);
    }

    const { data: professionalAccount } = await admin
      .from("professional_accounts")
      .select("id, owner_id, business_name")
      .eq("owner_id", profile.id)
      .maybeSingle();

    if (!professionalAccount) return jsonResponse({ error: "no_business_profile" }, 404);

    // Authoritative price lookup — the ONLY source of truth for amount.
    const { data: plan } = await admin
      .from("subscription_plans")
      .select("*")
      .eq("slug", body.plan_slug)
      .eq("status", "active")
      .single();

    if (!plan) return jsonResponse({ error: "plan_not_found" }, 404);

    const amount = body.billing_cycle === "yearly" ? plan.yearly_price : plan.monthly_price;
    if (!amount || amount <= 0) return jsonResponse({ error: "invalid_plan_price" }, 400);

    const reference = `stlx_${crypto.randomUUID()}`;
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://styleatlas.ng";
    const callbackUrl = `${siteUrl}/dashboard/billing?ref=${reference}`;

    const { error: txError } = await admin.from("payment_transactions").insert({
      user_id: profile.id,
      professional_account_id: professionalAccount.id,
      plan_id: plan.id,
      provider: body.provider,
      reference,
      amount,
      currency: plan.currency,
      billing_cycle: body.billing_cycle,
      status: "pending",
      metadata: { business_name: professionalAccount.business_name, plan_slug: plan.slug },
    });

    if (txError) return jsonResponse({ error: "transaction_create_failed", detail: txError.message }, 500);

    let checkoutUrl: string;

    if (body.provider === "paystack") {
      const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
      if (!paystackSecret) return jsonResponse({ error: "provider_not_configured" }, 500);

      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: { Authorization: `Bearer ${paystackSecret}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          amount: Math.round(amount * 100), // kobo
          currency: plan.currency,
          reference,
          callback_url: callbackUrl,
          metadata: {
            plan_id: plan.id,
            plan_slug: plan.slug,
            billing_cycle: body.billing_cycle,
            professional_account_id: professionalAccount.id,
            user_id: profile.id,
          },
        }),
      });

      const paystackData = await response.json();
      if (!response.ok || !paystackData?.data?.authorization_url) {
        return jsonResponse({ error: "paystack_init_failed", detail: paystackData }, 502);
      }
      checkoutUrl = paystackData.data.authorization_url;
    } else {
      const flwSecret = Deno.env.get("FLUTTERWAVE_SECRET_KEY");
      if (!flwSecret) return jsonResponse({ error: "provider_not_configured" }, 500);

      const response = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: { Authorization: `Bearer ${flwSecret}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          tx_ref: reference,
          amount,
          currency: plan.currency,
          redirect_url: callbackUrl,
          customer: { email: profile.email, name: profile.full_name },
          customizations: { title: "STYLEATLAS", description: `${plan.name} subscription (${body.billing_cycle})` },
          meta: {
            plan_id: plan.id,
            plan_slug: plan.slug,
            billing_cycle: body.billing_cycle,
            professional_account_id: professionalAccount.id,
            user_id: profile.id,
          },
        }),
      });

      const flwData = await response.json();
      if (!response.ok || !flwData?.data?.link) {
        return jsonResponse({ error: "flutterwave_init_failed", detail: flwData }, 502);
      }
      checkoutUrl = flwData.data.link;
    }

    return jsonResponse({ checkoutUrl, reference });
  } catch (error) {
    console.error("create-payment-checkout error", error);
    return jsonResponse({ error: "internal_error" }, 500);
  }
});

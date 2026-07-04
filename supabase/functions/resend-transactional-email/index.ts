// Sends branded transactional emails via Resend. Called internally by
// other Edge Functions (webhooks, lead-matching, etc.) using the service
// role — never invoked directly from the browser with user-supplied HTML.
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { createAdminClient } from "../_shared/supabase-admin.ts";
import { renderTemplate, type EmailTemplate } from "./templates.ts";

interface SendEmailBody {
  template: EmailTemplate;
  to: string;
  variables?: Record<string, string | number>;
  internalSecret: string;
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const body: SendEmailBody = await req.json();

    // This function sends arbitrary templated email to any address, so it
    // is gated by a shared secret known only to trusted server callers
    // (other Edge Functions), not exposed to the browser.
    if (body.internalSecret !== Deno.env.get("INTERNAL_FUNCTION_SECRET")) {
      return jsonResponse({ error: "unauthorized" }, 401);
    }

    if (!body.template || !body.to) return jsonResponse({ error: "invalid_request" }, 400);

    const { subject, html } = renderTemplate(body.template, body.variables ?? {});
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const fromAddress = Deno.env.get("RESEND_FROM_EMAIL") ?? "STYLEATLAS <hello@styleatlas.ng>";

    if (!resendKey) return jsonResponse({ error: "email_provider_not_configured" }, 500);

    const admin = createAdminClient();
    let resendMessageId: string | null = null;
    let status = "sent";
    let errorMessage: string | null = null;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: fromAddress, to: body.to, subject, html }),
      });
      const data = await response.json();
      if (!response.ok) {
        status = "failed";
        errorMessage = JSON.stringify(data);
      } else {
        resendMessageId = data.id ?? null;
      }
    } catch (sendError) {
      status = "failed";
      errorMessage = String(sendError);
    }

    await admin.from("email_logs").insert({
      recipient_email: body.to,
      template: body.template,
      subject,
      variables: body.variables ?? {},
      resend_message_id: resendMessageId,
      status,
      error_message: errorMessage,
    });

    if (status === "failed") return jsonResponse({ error: "send_failed", detail: errorMessage }, 502);
    return jsonResponse({ success: true, messageId: resendMessageId });
  } catch (error) {
    console.error("resend-transactional-email error", error);
    return jsonResponse({ error: "internal_error" }, 500);
  }
});

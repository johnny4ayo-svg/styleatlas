// Generic notification dispatcher: writes an in-app notification and
// optionally fans out an email via resend-transactional-email. Used by
// other trusted server-side callers (Next.js server actions using the
// service role, or other Edge Functions) that need to notify a user
// whose RLS session isn't available in the current context.
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { createAdminClient } from "../_shared/supabase-admin.ts";
import type { EmailTemplate } from "../resend-transactional-email/templates.ts";

interface SendNotificationBody {
  userId: string;
  title: string;
  body: string;
  type: "lead" | "message" | "review" | "verification" | "payment" | "subscription" | "system" | "moderation";
  actionUrl?: string;
  email?: { template: EmailTemplate; variables?: Record<string, string | number> };
  internalSecret: string;
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const body: SendNotificationBody = await req.json();

    if (body.internalSecret !== Deno.env.get("INTERNAL_FUNCTION_SECRET")) {
      return jsonResponse({ error: "unauthorized" }, 401);
    }
    if (!body.userId || !body.title || !body.body || !body.type) {
      return jsonResponse({ error: "invalid_request" }, 400);
    }

    const admin = createAdminClient();

    const { error } = await admin.from("notifications").insert({
      user_id: body.userId,
      title: body.title,
      body: body.body,
      type: body.type,
      action_url: body.actionUrl ?? null,
    });

    if (error) return jsonResponse({ error: "server_error", detail: error.message }, 500);

    if (body.email) {
      const { data: profile } = await admin.from("profiles").select("email, notification_preferences").eq("id", body.userId).maybeSingle();
      const prefs = profile?.notification_preferences as { email?: boolean } | null;

      if (profile?.email && prefs?.email !== false) {
        await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/resend-transactional-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            template: body.email.template,
            to: profile.email,
            variables: body.email.variables ?? {},
            internalSecret: body.internalSecret,
          }),
        }).catch((err) => console.error("email dispatch failed", err));
      }
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error("send-notification error", error);
    return jsonResponse({ error: "internal_error" }, 500);
  }
});

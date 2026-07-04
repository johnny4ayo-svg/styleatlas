"use server";

import { createClient } from "@/lib/supabase/server";

export type EngagementEventType =
  | "profile_view"
  | "whatsapp_click"
  | "phone_click"
  | "website_click"
  | "search_appearance"
  | "portfolio_view";

/**
 * Lightweight engagement tracker for profile analytics (WhatsApp/phone/
 * website clicks, profile views). Writes directly to analytics_events —
 * anonymous and cheap, unlike a full lead record. RLS allows public
 * insert on this table (see 0017_rls_analytics.sql) so anonymous
 * visitors can still be tracked without an account.
 */
export async function logEngagementEvent(input: {
  professionalAccountId: string;
  eventType: EngagementEventType;
  sourcePage: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileId: string | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).maybeSingle();
    profileId = (data as { id: string } | null)?.id ?? null;
  }

  const { error } = await supabase.from("analytics_events").insert({
    user_id: profileId,
    professional_account_id: input.professionalAccountId,
    event_type: input.eventType,
    source_page: input.sourcePage,
    metadata: input.metadata ?? {},
  });

  if (error) {
    // Analytics must never break the user-facing action (e.g. opening WhatsApp).
    console.error("logEngagementEvent failed", error.message);
  }

  return { ok: !error };
}

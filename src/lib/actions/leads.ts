"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { leadFormSchema, type LeadFormValues } from "@/lib/validations/lead";
import type { LeadSourceType } from "@/types";

export interface SubmitLeadInput extends LeadFormValues {
  professionalAccountId?: string;
  categoryId?: string;
  city?: string;
  state?: string;
  sourceType: LeadSourceType;
  sourcePage: string;
  utm?: { source?: string; medium?: string; campaign?: string };
}

/**
 * Every lead-capture form on the site (profile inquiry, blog CTA,
 * inspiration CTA, pricing CTA, event CTA, school inquiry) funnels through
 * this one validated, rate-limited entry point.
 */
export async function submitLead(input: SubmitLeadInput) {
  const parsed = leadFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "validation_error" as const, issues: parsed.error.flatten().fieldErrors };
  }

  const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const supabase = createClient();

  const { data: allowed, error: rateLimitError } = await supabase.rpc("check_rate_limit", {
    p_bucket_key: ip,
    p_action: "lead_submission",
    p_max_count: 8,
    p_window_seconds: 3600,
  });

  if (rateLimitError || !allowed) {
    return { error: "rate_limited" as const };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let customerId: string | null = null;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).maybeSingle();
    customerId = (profile as { id: string } | null)?.id ?? null;
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      source_type: input.sourceType,
      source_page: input.sourcePage,
      professional_account_id: input.professionalAccountId ?? null,
      customer_id: customerId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      whatsapp: parsed.data.whatsapp || null,
      city: input.city ?? null,
      state: input.state ?? null,
      category_id: input.categoryId ?? null,
      budget: parsed.data.budget || null,
      message: parsed.data.message,
      utm_source: input.utm?.source ?? null,
      utm_medium: input.utm?.medium ?? null,
      utm_campaign: input.utm?.campaign ?? null,
      device_info: { userAgent: headers().get("user-agent") ?? null },
    })
    .select("id")
    .single();

  if (error) {
    console.error("submitLead insert failed", error.message);
    return { error: "server_error" as const };
  }

  // Notify the professional. Notifications has no public insert policy
  // (only the owner can read/update their own), so this deliberately uses
  // the service-role admin client from trusted server code.
  if (input.professionalAccountId) {
    const admin = createAdminClient();
    const { data: account } = await admin
      .from("professional_accounts")
      .select("owner_id, business_name")
      .eq("id", input.professionalAccountId)
      .maybeSingle();

    if (account) {
      await admin.from("notifications").insert({
        user_id: (account as { owner_id: string }).owner_id,
        title: "New lead received",
        body: `${parsed.data.name} sent an inquiry about ${(account as { business_name: string }).business_name}.`,
        type: "lead",
        action_url: "/dashboard/leads",
      });
    }
  }

  return { success: true as const, leadId: (lead as { id: string }).id };
}

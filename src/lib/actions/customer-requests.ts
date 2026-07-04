"use server";

import { createClient } from "@/lib/supabase/server";
import { customerRequestSchema, type CustomerRequestValues } from "@/lib/validations/customer-request";

export async function submitCustomerRequest(input: CustomerRequestValues) {
  const parsed = customerRequestSchema.safeParse(input);
  if (!parsed.success) return { error: "validation_error" as const, issues: parsed.error.flatten().fieldErrors };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "auth_required" as const };

  const { data: profile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single();
  if (!profile) return { error: "auth_required" as const };

  const { data: allowed } = await supabase.rpc("check_rate_limit", {
    p_bucket_key: (profile as { id: string }).id,
    p_action: "customer_request_submission",
    p_max_count: 5,
    p_window_seconds: 86400,
  });
  if (!allowed) return { error: "rate_limited" as const };

  const { data: request, error } = await supabase
    .from("customer_requests")
    .insert({
      customer_id: (profile as { id: string }).id,
      title: parsed.data.title,
      category_id: parsed.data.categoryId,
      city: parsed.data.city,
      state: parsed.data.state,
      style_needed: parsed.data.styleNeeded || null,
      budget_min: parsed.data.budgetMin ?? null,
      budget_max: parsed.data.budgetMax ?? null,
      deadline: parsed.data.deadline || null,
      number_of_outfits: parsed.data.numberOfOutfits ?? null,
      measurements_status: parsed.data.measurementsStatus ?? null,
      details: parsed.data.details,
      preferred_contact_method: parsed.data.preferredContactMethod,
      consent_given: parsed.data.consentGiven,
    })
    .select("id")
    .single();

  if (error || !request) return { error: "server_error" as const };

  const requestId = (request as { id: string }).id;

  // Matching (finding eligible professionals, ranking by plan/verification,
  // and notifying them) is deliberately handled by the lead-matching Edge
  // Function rather than here — it needs broader cross-account read access
  // than a customer's RLS-scoped session should have.
  const { error: fnError } = await supabase.functions.invoke("lead-matching", { body: { requestId } });
  if (fnError) console.error("lead-matching invoke failed", fnError.message);

  return { success: true as const, requestId };
}

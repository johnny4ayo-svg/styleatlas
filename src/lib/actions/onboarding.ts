"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const professionalOnboardingSchema = z.object({
  businessName: z.string().trim().min(2).max(160),
  categoryId: z.string().uuid(),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  whatsapp: z.string().trim().min(7).max(20),
});

export async function completeProfessionalOnboarding(input: z.infer<typeof professionalOnboardingSchema>) {
  const parsed = professionalOnboardingSchema.safeParse(input);
  if (!parsed.success) return { error: "validation_error" as const };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "auth_required" as const };

  const { data: profile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single();
  if (!profile) return { error: "auth_required" as const };
  const profileId = (profile as { id: string }).id;

  const { data: slugResult } = await supabase.rpc("generate_unique_slug", {
    base_text: parsed.data.businessName,
    table_name: "professional_accounts",
    column_name: "slug",
    existing_id: null,
  });

  const { data: account, error } = await supabase
    .from("professional_accounts")
    .insert({
      owner_id: profileId,
      business_name: parsed.data.businessName,
      slug: slugResult as string,
      category_id: parsed.data.categoryId,
      city: parsed.data.city,
      state: parsed.data.state,
      whatsapp: parsed.data.whatsapp,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !account) return { error: "server_error" as const };

  // Ensure the profile's role reflects the professional account (in case
  // they registered as a customer and are upgrading).
  await supabase.from("profiles").update({ role: "professional", onboarding_completed: true }).eq("id", profileId);

  redirect("/dashboard");
}

const customerOnboardingSchema = z.object({
  phone: z.string().trim().min(7).max(20).optional().or(z.literal("")),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
});

export async function completeCustomerOnboarding(input: z.infer<typeof customerOnboardingSchema>) {
  const parsed = customerOnboardingSchema.safeParse(input);
  if (!parsed.success) return { error: "validation_error" as const };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "auth_required" as const };

  const { error } = await supabase
    .from("profiles")
    .update({
      phone: parsed.data.phone || null,
      city: parsed.data.city,
      state: parsed.data.state,
      onboarding_completed: true,
    })
    .eq("auth_user_id", user.id);

  if (error) return { error: "server_error" as const };
  redirect("/dashboard");
}

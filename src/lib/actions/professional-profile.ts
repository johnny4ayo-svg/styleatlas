"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  professionalProfileSchema,
  type ProfessionalProfileValues,
} from "@/lib/validations/professional-profile";

export async function updateProfessionalProfile(accountId: string, input: ProfessionalProfileValues) {
  const parsed = professionalProfileSchema.safeParse(input);
  if (!parsed.success) return { error: "validation_error" as const, issues: parsed.error.flatten().fieldErrors };

  const supabase = createClient();
  const { error } = await supabase
    .from("professional_accounts")
    .update({
      business_name: parsed.data.businessName,
      description: parsed.data.description || null,
      brand_story: parsed.data.brandStory || null,
      phone: parsed.data.phone || null,
      whatsapp: parsed.data.whatsapp || null,
      email: parsed.data.email || null,
      website: parsed.data.website || null,
      instagram: parsed.data.instagram || null,
      facebook: parsed.data.facebook || null,
      tiktok: parsed.data.tiktok || null,
      youtube: parsed.data.youtube || null,
      address: parsed.data.address || null,
      city: parsed.data.city,
      state: parsed.data.state,
      price_range: parsed.data.priceRange || null,
      availability_status: parsed.data.availabilityStatus,
      logo_url: parsed.data.logoUrl || null,
      cover_image_url: parsed.data.coverImageUrl || null,
    })
    .eq("id", accountId);

  if (error) return { error: "server_error" as const, message: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  return { success: true as const };
}

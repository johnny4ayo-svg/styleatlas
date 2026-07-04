"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { accountSettingsSchema, type AccountSettingsValues } from "@/lib/validations/account-settings";

export async function updateAccountSettings(input: AccountSettingsValues) {
  const parsed = accountSettingsSchema.safeParse(input);
  if (!parsed.success) return { error: "validation_error" as const };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "auth_required" as const };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
      city: parsed.data.city || null,
      state: parsed.data.state || null,
      notification_preferences: { email: parsed.data.emailNotifications, sms: parsed.data.smsNotifications },
    })
    .eq("auth_user_id", user.id);

  if (error) return { error: "server_error" as const };
  revalidatePath("/dashboard/settings");
  return { success: true as const };
}

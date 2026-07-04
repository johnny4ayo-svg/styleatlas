import { createClient } from "@/lib/supabase/server";
import type { ProfessionalAccount } from "@/types";

/**
 * Resolves the professional_accounts row the signed-in user can manage —
 * either as owner or as active staff. RLS already scopes what comes back;
 * this just picks the first (professionals currently have exactly one
 * business account).
 */
export async function getManagedProfessionalAccount(profileId: string): Promise<ProfessionalAccount | null> {
  const supabase = createClient();

  const { data: owned } = await supabase
    .from("professional_accounts")
    .select("*, category:categories(*), plan:subscription_plans(*)")
    .eq("owner_id", profileId)
    .maybeSingle();

  if (owned) return owned as unknown as ProfessionalAccount;

  const { data: staffRow } = await supabase
    .from("professional_staff")
    .select("professional_account_id")
    .eq("user_id", profileId)
    .eq("status", "active")
    .maybeSingle();

  if (!staffRow) return null;

  const { data: staffAccount } = await supabase
    .from("professional_accounts")
    .select("*, category:categories(*), plan:subscription_plans(*)")
    .eq("id", (staffRow as { professional_account_id: string }).professional_account_id)
    .maybeSingle();

  return (staffAccount as unknown as ProfessionalAccount) ?? null;
}

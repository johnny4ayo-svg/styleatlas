import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/rbac";
import { getManagedProfessionalAccount } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/server";
import { LeadsTable } from "@/components/dashboard/leads-table";
import type { Lead } from "@/types";

export default async function DashboardLeadsPage() {
  const profile = await requireAuth();
  const account = await getManagedProfessionalAccount(profile.id);
  if (!account) redirect("/onboarding/professional");

  const supabase = createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("professional_account_id", account.id)
    .order("created_at", { ascending: false });

  return <LeadsTable leads={(leads ?? []) as unknown as Lead[]} />;
}

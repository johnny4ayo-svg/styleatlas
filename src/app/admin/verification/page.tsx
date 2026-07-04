import { createClient } from "@/lib/supabase/server";
import { VerificationQueue, type PendingVerification } from "@/components/admin/verification-queue";

export default async function AdminVerificationPage() {
  const supabase = createClient();
  const { data: requests } = await supabase
    .from("verification_requests")
    .select("id, requested_level, created_at, professional_account:professional_accounts(business_name, slug)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return <VerificationQueue requests={(requests ?? []) as unknown as PendingVerification[]} />;
}

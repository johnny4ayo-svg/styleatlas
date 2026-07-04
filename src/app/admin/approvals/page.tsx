import { createClient } from "@/lib/supabase/server";
import { ApprovalQueue, type PendingListing } from "@/components/admin/approval-queue";

export default async function AdminApprovalsPage() {
  const supabase = createClient();
  const { data: listings } = await supabase
    .from("professional_accounts")
    .select("id, business_name, slug, city, state, created_at, category:categories(name)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return <ApprovalQueue listings={(listings ?? []) as unknown as PendingListing[]} />;
}

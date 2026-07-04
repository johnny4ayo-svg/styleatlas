import { createClient } from "@/lib/supabase/server";
import { ReviewModerationQueue, type PendingReview } from "@/components/admin/review-moderation-queue";

export default async function AdminReviewsPage() {
  const supabase = createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, title, body, professional_account:professional_accounts(business_name), customer:profiles(full_name)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return <ReviewModerationQueue reviews={(reviews ?? []) as unknown as PendingReview[]} />;
}

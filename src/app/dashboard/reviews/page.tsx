import { requireAuth } from "@/lib/auth/rbac";
import { getManagedProfessionalAccount } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/server";
import { ProfessionalReviewsList } from "@/components/dashboard/professional-reviews-list";
import { RatingStars } from "@/components/shared/rating-stars";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

export default async function DashboardReviewsPage() {
  const profile = await requireAuth();
  const isProfessional = profile.role === "professional" || profile.role === "professional_staff";
  const supabase = createClient();

  if (isProfessional) {
    const account = await getManagedProfessionalAccount(profile.id);
    if (!account) return <EmptyState title="Set up your business first" description="Create your business profile to start receiving reviews." />;

    const { data: reviews } = await supabase
      .from("reviews")
      .select("*")
      .eq("professional_account_id", account.id)
      .order("created_at", { ascending: false });

    return <ProfessionalReviewsList reviews={(reviews ?? []) as unknown as Review[]} professionalSlug={account.slug} />;
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, professional:professional_accounts(business_name, slug)")
    .eq("customer_id", profile.id)
    .order("created_at", { ascending: false });

  const typedReviews = (reviews ?? []) as unknown as (Review & { professional: { business_name: string; slug: string } })[];

  if (typedReviews.length === 0) {
    return <EmptyState title="You haven't left any reviews yet" description="Reviews you leave for professionals will appear here." actionLabel="Browse the directory" actionHref="/directory" />;
  }

  return (
    <div className="space-y-4">
      {typedReviews.map((review) => (
        <div key={review.id} className="rounded-lg border border-charcoal-100 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="font-medium text-charcoal-900">{review.professional?.business_name}</p>
            <Badge variant="outline" className="capitalize">{review.status}</Badge>
          </div>
          <RatingStars rating={review.rating} size={14} className="mt-1.5" />
          <p className="mt-2 text-sm text-charcoal-700">{review.body}</p>
          <p className="mt-2 text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
        </div>
      ))}
    </div>
  );
}

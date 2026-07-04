"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/rating-stars";
import { EmptyState } from "@/components/shared/empty-state";
import { moderateReview } from "@/lib/actions/admin-moderation";

export interface PendingReview {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  professional_account: { business_name: string } | null;
  customer: { full_name: string } | null;
}

export function ReviewModerationQueue({ reviews }: { reviews: PendingReview[] }) {
  const [isPending, startTransition] = useTransition();

  if (reviews.length === 0) {
    return <EmptyState title="No reviews pending moderation" description="New and edited reviews will appear here." />;
  }

  const handleDecision = (id: string, decision: "published" | "hidden" | "rejected") => {
    startTransition(async () => {
      const result = await moderateReview(id, decision);
      if (result.error) toast.error("Something went wrong.");
      else toast.success(`Review ${decision}.`);
    });
  };

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg border border-charcoal-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-charcoal-900">
              {review.customer?.full_name} → {review.professional_account?.business_name}
            </p>
            <RatingStars rating={review.rating} size={14} />
          </div>
          {review.title && <p className="mt-2 text-sm font-medium text-charcoal-800">{review.title}</p>}
          <p className="mt-1 text-sm text-charcoal-700">{review.body}</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleDecision(review.id, "rejected")}>
              Reject
            </Button>
            <Button size="sm" variant="outline" disabled={isPending} onClick={() => handleDecision(review.id, "hidden")}>
              Hide
            </Button>
            <Button size="sm" disabled={isPending} onClick={() => handleDecision(review.id, "published")}>
              Publish
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

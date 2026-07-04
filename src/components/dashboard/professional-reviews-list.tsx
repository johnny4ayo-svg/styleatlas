"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RatingStars } from "@/components/shared/rating-stars";
import { EmptyState } from "@/components/shared/empty-state";
import { replyToReview } from "@/lib/actions/reviews";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

function ReplyBox({ review, professionalSlug }: { review: Review; professionalSlug: string }) {
  const [reply, setReply] = useState(review.professional_reply ?? "");
  const [isPending, startTransition] = useTransition();

  const handleReply = () => {
    startTransition(async () => {
      const result = await replyToReview(review.id, professionalSlug, reply);
      if (result.error) toast.error("Couldn't save your reply.");
      else toast.success("Reply saved.");
    });
  };

  return (
    <div className="mt-3 flex items-start gap-2">
      <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={2} placeholder="Write a reply…" className="text-sm" />
      <Button size="sm" onClick={handleReply} disabled={isPending || !reply.trim()}>
        {isPending ? "Saving…" : "Reply"}
      </Button>
    </div>
  );
}

export function ProfessionalReviewsList({ reviews, professionalSlug }: { reviews: Review[]; professionalSlug: string }) {
  if (reviews.length === 0) {
    return <EmptyState title="No reviews yet" description="Reviews from completed interactions with customers will appear here." />;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg border border-charcoal-100 bg-white p-5">
          <div className="flex items-center justify-between">
            <RatingStars rating={review.rating} size={14} />
            <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
          </div>
          {review.title && <p className="mt-2 font-medium text-charcoal-900">{review.title}</p>}
          <p className="mt-1 text-sm text-charcoal-700">{review.body}</p>
          <ReplyBox review={review} professionalSlug={professionalSlug} />
        </div>
      ))}
    </div>
  );
}

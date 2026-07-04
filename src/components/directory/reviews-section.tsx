import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RatingStars } from "@/components/shared/rating-stars";
import { ReviewFormDialog } from "@/components/directory/review-form-dialog";
import { formatDate, initials } from "@/lib/utils";
import type { Review } from "@/types";

export function ReviewsSection({
  reviews,
  ratingAverage,
  reviewCount,
  professionalAccountId,
  professionalSlug,
}: {
  reviews: Review[];
  ratingAverage: number;
  reviewCount: number;
  professionalAccountId: string;
  professionalSlug: string;
}) {
  return (
    <section className="border-t border-charcoal-100 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-charcoal-900">Customer Reviews</h2>
          <div className="mt-1.5">
            <RatingStars rating={ratingAverage} reviewCount={reviewCount} showValue size={18} />
          </div>
        </div>
        <ReviewFormDialog professionalAccountId={professionalAccountId} professionalSlug={professionalSlug} />
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet — be the first to share your experience.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-charcoal-100 pb-6 last:border-0">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={review.customer?.avatar_url ?? undefined} />
                  <AvatarFallback>{initials(review.customer?.full_name ?? "Customer")}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-charcoal-900">{review.customer?.full_name ?? "Verified Customer"}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
                  </div>
                  <RatingStars rating={review.rating} size={14} className="mt-1" />
                  {review.title && <p className="mt-2 font-medium text-charcoal-800">{review.title}</p>}
                  <p className="mt-1.5 text-sm text-charcoal-700">{review.body}</p>

                  {review.photos && review.photos.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {review.photos.map((photo) => (
                        <div key={photo.id} className="relative h-16 w-16 overflow-hidden rounded-md bg-charcoal-100">
                          <Image src={photo.image_url} alt={photo.alt_text ?? "Review photo"} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {review.professional_reply && (
                    <div className="mt-3 rounded-lg bg-ivory p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">Business Reply</p>
                      <p className="mt-1 text-sm text-charcoal-700">{review.professional_reply}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

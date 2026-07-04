import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = 16,
  showValue = false,
  reviewCount,
  className,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}) {
  if (typeof reviewCount === "number" && reviewCount === 0) {
    return (
      <span className={cn("text-sm font-medium text-gold-600", className)}>New on STYLEATLAS</span>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = rating >= i + 1;
          const half = !filled && rating > i && rating < i + 1;
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-charcoal-200" />
              {(filled || half) && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: half ? "50%" : "100%" }}>
                  <Star size={size} className="fill-gold-400 text-gold-400" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && <span className="text-sm font-medium text-charcoal-700">{rating.toFixed(1)}</span>}
      {typeof reviewCount === "number" && (
        <span className="text-sm text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { MapPin, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/rating-stars";
import { VerifiedBadge, PlanBadge } from "@/components/shared/verified-badge";
import { SaveButton } from "@/components/shared/save-button";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import type { ProfessionalAccount } from "@/types";
import { cn } from "@/lib/utils";

const PRICE_LABEL: Record<string, string> = { budget: "₦", mid: "₦₦", premium: "₦₦₦", luxury: "₦₦₦₦" };

export function ListingCard({
  listing,
  saved = false,
  featured = false,
}: {
  listing: ProfessionalAccount;
  saved?: boolean;
  featured?: boolean;
}) {
  const planSlug = listing.plan?.slug;
  const isElite = planSlug === "elite";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all hover:shadow-elevated",
        (featured || isElite) && "ring-1 ring-gold-300"
      )}
    >
      <Link href={`/designers/${listing.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal-100">
          <Image
            src={listing.cover_image_url || listing.logo_url || "/images/placeholder-cover.jpg"}
            alt={listing.business_name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {(featured || isElite) && <PlanBadge plan="elite" />}
            {planSlug === "premium" && <PlanBadge plan="premium" />}
          </div>
          <div className="absolute right-3 top-3">
            <SaveButton entityType="professional_account" entityId={listing.id} initialSaved={saved} />
          </div>
          {listing.availability_status === "available" && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              Available
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <Link href={`/designers/${listing.slug}`}>
            <h3 className="font-serif text-lg font-semibold leading-snug text-charcoal-900 hover:text-gold-600">
              {listing.business_name}
            </h3>
          </Link>
        </div>

        <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {listing.city}, {listing.state}
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <VerifiedBadge level={listing.verification_status} />
          {listing.category?.name && (
            <span className="text-xs font-medium uppercase tracking-wide text-charcoal-400">
              {listing.category.name}
            </span>
          )}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <RatingStars
            rating={listing.rating_average ?? 0}
            reviewCount={listing.review_count ?? 0}
            size={14}
            showValue
          />
          {listing.price_range && (
            <span className="text-sm font-semibold text-gold-600">{PRICE_LABEL[listing.price_range]}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/designers/${listing.slug}`}>View Profile</Link>
          </Button>
          {listing.whatsapp ? (
            <WhatsAppButton
              phone={listing.whatsapp}
              professionalAccountId={listing.id}
              sourcePage="homepage_listing_card"
              size="sm"
              className="flex-1"
            />
          ) : (
            <Button asChild variant="emerald" size="sm" className="flex-1">
              <Link href={`/designers/${listing.slug}`}>Send Inquiry</Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-charcoal-100 bg-white shadow-card">
      <div className="aspect-[4/3] w-full animate-pulse bg-charcoal-100" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-charcoal-100" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-charcoal-100" />
        <div className="h-4 w-full animate-pulse rounded bg-charcoal-100" />
      </div>
    </div>
  );
}

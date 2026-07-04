import Image from "next/image";
import { MapPin, MessageCircle, Eye, CheckCircle2 } from "lucide-react";
import { RatingStars } from "@/components/shared/rating-stars";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { Badge } from "@/components/ui/badge";

const PORTFOLIO_IMAGES = [
  "/images/lola-azizada--eXbTwI0VU0-unsplash.jpg",
  "/images/microboss-nigerian-5169012_1920.jpg",
  "/images/tope-a-asokere-AZKkp0bwJLM-unsplash.jpg",
] as const;

export function HeroMockupCard() {
  return (
    <div className="mx-auto w-full max-w-sm animate-fade-in-up rounded-2xl border border-white/10 bg-white p-4 shadow-elevated sm:p-5">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-charcoal-100">
        <Image src={PORTFOLIO_IMAGES[0]} alt="" fill sizes="384px" className="object-cover" />
        <div className="absolute left-2.5 top-2.5">
          <Badge variant="gold">Featured</Badge>
        </div>
        <div className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          Available This Week
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold leading-snug text-charcoal-900">Amaka Bello Couture</h3>
          <span className="shrink-0 text-sm font-semibold text-gold-600">₦₦₦</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          Lagos, Nigeria
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <VerifiedBadge level="business_verified" />
          <RatingStars rating={4.8} reviewCount={126} size={13} showValue />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {PORTFOLIO_IMAGES.map((src) => (
            <div key={src} className="relative aspect-square overflow-hidden rounded-md bg-charcoal-100">
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-charcoal-50 px-3 py-2 text-xs text-charcoal-500">
          <span className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            48 profile views this week
          </span>
          <span>12 new enquiries</span>
        </div>

        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white">
          <MessageCircle className="h-4 w-4" />
          Contact on WhatsApp
        </button>
      </div>
    </div>
  );
}

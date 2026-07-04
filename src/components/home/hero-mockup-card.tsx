import Image from "next/image";
import { MapPin, Eye, CheckCircle2, MessageCircle } from "lucide-react";
import { RatingStars } from "@/components/shared/rating-stars";
import { VerifiedBadge } from "@/components/shared/verified-badge";
import { Badge } from "@/components/ui/badge";

const BRIDAL_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80";

export function HeroMockupCard() {
  return (
    <div className="relative mx-auto w-full max-w-sm animate-fade-in-up pb-14">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
        <Image
          src={BRIDAL_IMAGE}
          alt="Bridal gown by a STYLEATLAS verified designer"
          fill
          sizes="384px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/10" />

        <div className="absolute left-3 top-3">
          <Badge variant="gold">Featured</Badge>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          Available This Week
        </div>
        <div className="absolute bottom-24 right-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-charcoal-700 shadow-elevated">
          <Eye className="h-3 w-3 text-gold-600" />
          48 views this week
        </div>
      </div>

      {/* Floating profile card, overlapping the bottom of the image */}
      <div className="absolute inset-x-4 bottom-14 rounded-2xl bg-white p-4 shadow-elevated">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-base font-semibold leading-snug text-charcoal-900">
            Amaka Bello Couture
          </h3>
          <span className="shrink-0 text-sm font-semibold text-gold-600">₦₦₦</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          Lagos, Nigeria
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <VerifiedBadge level="business_verified" />
          <RatingStars rating={4.8} reviewCount={126} size={12} showValue />
        </div>
      </div>

      <button className="absolute inset-x-4 bottom-0 flex items-center justify-center gap-2 rounded-md bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-elevated">
        <MessageCircle className="h-4 w-4" />
        Contact on WhatsApp
      </button>
    </div>
  );
}

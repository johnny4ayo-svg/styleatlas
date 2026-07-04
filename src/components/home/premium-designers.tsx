import Link from "next/link";
import { ListingCard } from "@/components/directory/listing-card";
import type { ProfessionalAccount } from "@/types";

export function PremiumDesigners({ listings }: { listings: ProfessionalAccount[] }) {
  if (listings.length === 0) return null;

  return (
    <section className="section-container py-16 sm:py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Handpicked</p>
          <h2 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">Premium Featured Designers</h2>
        </div>
        <Link href="/directory/fashion-designers" className="hidden text-sm font-medium text-gold-600 hover:underline sm:block">
          View all designers →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} featured />
        ))}
      </div>
    </section>
  );
}

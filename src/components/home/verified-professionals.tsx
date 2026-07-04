import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ListingCard } from "@/components/directory/listing-card";
import type { ProfessionalAccount } from "@/types";

export function VerifiedProfessionals({ listings }: { listings: ProfessionalAccount[] }) {
  if (listings.length === 0) return null;

  return (
    <section className="bg-ivory py-16 sm:py-20">
      <div className="section-container">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified & Trusted
            </p>
            <h2 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">Verified Professionals</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              These professionals have completed identity, business, or address verification with our team —
              book with an extra layer of confidence.
            </p>
          </div>
          <Link href="/verification" className="hidden shrink-0 text-sm font-medium text-gold-600 hover:underline sm:block">
            How verification works →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { MapPin } from "lucide-react";
import { FEATURED_CITIES } from "@/lib/constants";

export function LocationDiscovery() {
  return (
    <section className="section-container py-16 sm:py-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Find Near You</p>
        <h2 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">
          Fashion Designers Across Nigeria
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {FEATURED_CITIES.map((city) => (
          <Link
            key={city.slug}
            href={`/directory/fashion-designers/${city.slug}`}
            className="group flex items-center gap-2 rounded-lg border border-charcoal-100 bg-white px-4 py-3 text-sm font-medium text-charcoal-700 shadow-card transition hover:border-gold-300 hover:text-gold-600"
          >
            <MapPin className="h-4 w-4 shrink-0 text-charcoal-300 group-hover:text-gold-500" />
            {city.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

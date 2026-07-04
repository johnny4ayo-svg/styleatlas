import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { getFeaturedOutfits } from "@/lib/data/outfits";
import { OUTFIT_CATEGORIES } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Outfit Inspiration Gallery — Aso Ebi, Ankara, Bridal & More | STYLEATLAS",
  description:
    "Browse Nigeria's premium fashion inspiration gallery: Aso Ebi, Ankara, bridal, agbada, corporate, and children's fashion, all linked to the designers who made them.",
  path: "/inspiration",
});

export default async function InspirationLandingPage() {
  const outfits = await getFeaturedOutfits(16);

  return (
    <div>
      <section className="bg-charcoal-900 py-16 text-center">
        <div className="section-container">
          <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">Outfit Inspiration</h1>
          <p className="mx-auto mt-3 max-w-xl text-charcoal-300">
            A premium style edit — every look linked back to the designer who created it.
          </p>
        </div>
      </section>

      <section className="section-container py-10">
        <div className="flex flex-wrap gap-2.5">
          {OUTFIT_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/inspiration/${cat.slug}`}
              className="rounded-full border border-charcoal-200 px-4 py-2 text-sm font-medium text-charcoal-700 hover:border-gold-300 hover:text-gold-600"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="section-container pb-16">
        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {outfits.map((outfit) => (
            <Link key={outfit.id} href={`/inspiration/item/${outfit.slug}`} className="group relative block break-inside-avoid overflow-hidden rounded-lg">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal-100">
                <Image
                  src={outfit.image_url}
                  alt={outfit.alt_text || outfit.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { OutfitInspiration } from "@/types";

export function OutfitGalleryPreview({ outfits }: { outfits: OutfitInspiration[] }) {
  if (outfits.length === 0) return null;

  return (
    <section className="bg-ivory py-16 sm:py-20">
      <div className="section-container">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Style Edit</p>
            <h2 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">Outfit Inspiration</h2>
          </div>
          <Link href="/inspiration" className="hidden text-sm font-medium text-gold-600 hover:underline sm:block">
            Explore the gallery →
          </Link>
        </div>

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
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-sm font-medium text-white">{outfit.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

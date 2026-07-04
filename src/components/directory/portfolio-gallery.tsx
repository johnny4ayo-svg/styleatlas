"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { PortfolioItem } from "@/types";

export function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-charcoal-100"
          >
            <Image
              src={item.image_url}
              alt={item.alt_text || item.title}
              fill
              sizes="(max-width: 768px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
          {activeIndex !== null && items[activeIndex] && (
            <div className="relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-charcoal-900 sm:aspect-video">
                <Image
                  src={items[activeIndex]!.image_url}
                  alt={items[activeIndex]!.alt_text || items[activeIndex]!.title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <div className="mt-3 rounded-lg bg-white p-3 text-center">
                <p className="font-medium text-charcoal-900">{items[activeIndex]!.title}</p>
              </div>
              {items.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveIndex((i) => (i === null ? 0 : (i - 1 + items.length) % items.length))}
                    className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal-800"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveIndex((i) => (i === null ? 0 : (i + 1) % items.length))}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal-800"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

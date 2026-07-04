"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { MEGA_MENU_SECTIONS, PRIMARY_NAV } from "./nav-data";
import { cn } from "@/lib/utils";

export function MegaMenu() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setOpenIndex(null)}>
      {MEGA_MENU_SECTIONS.map((section, index) => (
        <div key={section.label} className="relative" onMouseEnter={() => setOpenIndex(index)}>
          <Link
            href={section.href}
            className={cn(
              "flex items-center gap-1 px-4 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:text-gold-600",
              openIndex === index && "text-gold-600"
            )}
          >
            {section.label}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", openIndex === index && "rotate-180")} />
          </Link>

          {openIndex === index && (
            <div className="absolute left-1/2 top-full z-40 w-[640px] -translate-x-1/2 pt-3 animate-fade-in-up">
              <div className="grid grid-cols-3 gap-6 rounded-lg border border-charcoal-100 bg-white p-6 shadow-elevated">
                {section.columns.map((col) => (
                  <div key={col.heading}>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-charcoal-400">
                      {col.heading}
                    </p>
                    <ul className="space-y-2">
                      {col.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="text-sm text-charcoal-700 transition-colors hover:text-gold-600"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {PRIMARY_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="px-4 py-2 text-sm font-medium text-charcoal-700 transition-colors hover:text-gold-600"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

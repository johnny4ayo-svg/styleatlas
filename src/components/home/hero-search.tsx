"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROFESSIONAL_CATEGORIES, FEATURED_CITIES, PRICE_RANGES } from "@/lib/constants";

const BUDGET_LABELS: Record<string, string> = {
  budget: "Budget Friendly",
  mid: "Mid Range",
  premium: "Premium",
  luxury: "Luxury",
};

export function HeroSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (city) params.set("city", city);
    if (budget) params.set("price_range", budget);
    router.push(`/directory/fashion-designers?${params.toString()}`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-2 rounded-xl border border-charcoal-100 bg-white p-2 shadow-elevated sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2.5">
          <Search className="h-4.5 w-4.5 shrink-0 text-charcoal-400" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Bridal gown, Aso Ebi, Ankara, stylist, fashion school"
            className="w-full bg-transparent text-sm text-charcoal-800 outline-none placeholder:text-charcoal-400"
          />
        </div>
        <div className="hidden items-center gap-2 border-l border-charcoal-100 px-3 py-2.5 sm:flex">
          <MapPin className="h-4.5 w-4.5 shrink-0 text-charcoal-400" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-32 bg-transparent text-sm text-charcoal-800 outline-none"
          >
            <option value="">Location</option>
            {FEATURED_CITIES.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden items-center gap-2 border-l border-charcoal-100 px-3 py-2.5 lg:flex">
          <Wallet className="h-4.5 w-4.5 shrink-0 text-charcoal-400" />
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-32 bg-transparent text-sm text-charcoal-800 outline-none"
          >
            <option value="">Budget</option>
            {PRICE_RANGES.map((p) => (
              <option key={p.value} value={p.value}>
                {BUDGET_LABELS[p.value]}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" size="lg" className="shrink-0">
          Find Fashion Experts
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-charcoal-300">Popular:</span>
        {PROFESSIONAL_CATEGORIES.slice(0, 5).map((cat) => (
          <a
            key={cat.slug}
            href={`/directory/${cat.slug}`}
            className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-gold-500 hover:text-charcoal-900"
          >
            {cat.name}
          </a>
        ))}
      </div>
    </div>
  );
}

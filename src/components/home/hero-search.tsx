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
        className="flex flex-col gap-1.5 rounded-2xl border border-gold-500/30 bg-white p-2.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-black/5 transition-shadow focus-within:ring-2 focus-within:ring-gold-500 sm:flex-row sm:items-stretch sm:gap-0"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3.5 py-2.5">
          <Search className="h-5 w-5 shrink-0 text-gold-600" />
          <div className="min-w-0 flex-1">
            <label className="block whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-charcoal-400">
              Service
            </label>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Bridal gown, Aso Ebi, stylist…"
              className="w-full truncate bg-transparent text-sm font-medium text-charcoal-900 outline-none placeholder:font-normal placeholder:text-charcoal-400"
            />
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 border-charcoal-100 px-3.5 py-2.5 sm:flex sm:border-l">
          <MapPin className="h-5 w-5 shrink-0 text-gold-600" />
          <div className="min-w-0">
            <label className="block whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-charcoal-400">
              Location
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-20 max-w-[6rem] bg-transparent text-sm font-medium text-charcoal-900 outline-none"
            >
              <option value="">Any city</option>
              {FEATURED_CITIES.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 border-charcoal-100 px-3.5 py-2.5 lg:flex lg:border-l">
          <Wallet className="h-5 w-5 shrink-0 text-gold-600" />
          <div className="min-w-0">
            <label className="block whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-charcoal-400">
              Budget
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-24 max-w-[6.5rem] bg-transparent text-sm font-medium text-charcoal-900 outline-none"
            >
              <option value="">Any</option>
              {PRICE_RANGES.map((p) => (
                <option key={p.value} value={p.value}>
                  {BUDGET_LABELS[p.value]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button type="submit" size="lg" className="shrink-0 rounded-xl px-6 text-sm shadow-gold sm:text-base">
          Find Experts
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
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

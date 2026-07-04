import Link from "next/link";
import { Scissors, ShoppingBag, Sparkles, GraduationCap, Ruler, Brush, Gem, Users } from "lucide-react";
import { PROFESSIONAL_CATEGORIES } from "@/lib/constants";

const ICONS: Record<string, typeof Scissors> = {
  Scissors, ShoppingBag, Sparkles, GraduationCap, Ruler, Brush, Gem, Users,
};

export function FeaturedCategories() {
  return (
    <section className="section-container py-16 sm:py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Explore</p>
          <h2 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">Browse by Category</h2>
        </div>
        <Link href="/directory" className="hidden text-sm font-medium text-gold-600 hover:underline sm:block">
          View all categories →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {PROFESSIONAL_CATEGORIES.slice(0, 8).map((cat) => {
          const Icon = ICONS[cat.icon] ?? Scissors;
          return (
            <Link
              key={cat.slug}
              href={`/directory/${cat.slug}`}
              className="group flex flex-col items-start gap-3 rounded-lg border border-charcoal-100 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-50 text-gold-600 transition-colors group-hover:bg-gold-400 group-hover:text-charcoal-900">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-base font-semibold text-charcoal-900">{cat.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{cat.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

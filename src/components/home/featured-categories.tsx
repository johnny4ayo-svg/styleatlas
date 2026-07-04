import Link from "next/link";
import { Scissors, Gem, GraduationCap, Sparkles, Store, type LucideIcon } from "lucide-react";

const NEEDS: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    title: "I Need a Designer",
    description: "Custom gowns, native wear, bridal fashion, men's outfits, and children's fashion.",
    href: "/directory/fashion-designers",
    icon: Scissors,
  },
  {
    title: "I Need Wedding or Aso Ebi Fashion",
    description: "Find bridal houses, lace vendors, makeup artists, stylists, and event fashion teams.",
    href: "/directory/bridal-houses",
    icon: Gem,
  },
  {
    title: "I Need a Fashion School",
    description: "Compare tailoring schools, fashion design academies, styling classes, and training centers.",
    href: "/directory/fashion-schools",
    icon: GraduationCap,
  },
  {
    title: "I Need a Stylist",
    description: "Personal styling, shoot styling, wardrobe planning, and event styling.",
    href: "/directory/stylists",
    icon: Sparkles,
  },
  {
    title: "I Sell Fashion Services",
    description: "Create a business profile and get discovered by customers looking for your exact service.",
    href: "/register?type=professional",
    icon: Store,
  },
];

export function FeaturedCategories() {
  return (
    <section className="section-container py-16 sm:py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Explore</p>
          <h2 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">
            What Are You Looking For?
          </h2>
        </div>
        <Link href="/directory" className="hidden text-sm font-medium text-gold-600 hover:underline sm:block">
          Explore all categories →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {NEEDS.map((need) => (
          <Link
            key={need.title}
            href={need.href}
            className="group flex flex-col items-start gap-3 rounded-xl border border-charcoal-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold-300 hover:shadow-elevated"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-50 text-gold-600 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-white">
              <need.icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-serif text-base font-semibold leading-snug text-charcoal-900">{need.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{need.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

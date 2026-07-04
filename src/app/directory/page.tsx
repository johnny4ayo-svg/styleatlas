import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getCategories } from "@/lib/data/categories";
import { HeroSearch } from "@/components/home/hero-search";
import { FEATURED_CITIES } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "Fashion Directory — Designers, Brands, Stylists & Schools | STYLEATLAS",
  description:
    "Search Nigeria's largest verified fashion directory: designers, brands, stylists, tailors, schools, makeup artists, and more — by city, category, and budget.",
  path: "/directory",
});

export default async function DirectoryLandingPage() {
  const categories = await getCategories();
  const topLevel = categories.filter((c) => !c.parent_id);

  return (
    <div>
      <section className="bg-charcoal-900 py-16 text-center">
        <div className="section-container">
          <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">The STYLEATLAS Directory</h1>
          <p className="mx-auto mt-3 max-w-xl text-charcoal-300">
            Every verified fashion professional in Nigeria, searchable by category, city, and budget.
          </p>
          <div className="mt-8">
            <HeroSearch />
          </div>
        </div>
      </section>

      <section className="section-container py-14">
        <h2 className="mb-6 font-serif text-2xl font-semibold text-charcoal-900">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {topLevel.map((cat) => (
            <Link
              key={cat.id}
              href={`/directory/${cat.slug}`}
              className="rounded-lg border border-charcoal-100 bg-white p-5 shadow-card transition hover:border-gold-300 hover:shadow-elevated"
            >
              <h3 className="font-serif text-base font-semibold text-charcoal-900">{cat.name}</h3>
              {cat.description && <p className="mt-1 text-xs text-muted-foreground">{cat.description}</p>}
            </Link>
          ))}
        </div>
      </section>

      <section className="section-container pb-16">
        <h2 className="mb-6 font-serif text-2xl font-semibold text-charcoal-900">Browse by City</h2>
        <div className="flex flex-wrap gap-2.5">
          {FEATURED_CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/directory/fashion-designers/${city.slug}`}
              className="rounded-full border border-charcoal-200 px-4 py-2 text-sm font-medium text-charcoal-700 hover:border-gold-300 hover:text-gold-600"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

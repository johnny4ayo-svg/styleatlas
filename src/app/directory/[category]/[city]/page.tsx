import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/data/categories";
import { searchProfessionals } from "@/lib/data/professionals";
import { getSeoPage, buildFallbackIntro } from "@/lib/data/seo-pages";
import { buildMetadata, localBusinessSchema, jsonLdScript } from "@/lib/seo";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { FaqSection } from "@/components/shared/faq-section";
import { DirectoryResults } from "@/components/directory/directory-results";
import { FEATURED_CITIES } from "@/lib/constants";
import Link from "next/link";

interface Props {
  params: { category: string; city: string };
  searchParams: Record<string, string | undefined>;
}

function cityLabel(citySlug: string) {
  const known = FEATURED_CITIES.find((c) => c.slug === citySlug);
  return known?.name ?? citySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function pageSlug(category: string, city: string) {
  return `${category}-in-${city}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) return {};

  const city = cityLabel(params.city);
  const seoPage = await getSeoPage(pageSlug(params.category, params.city));
  const title = seoPage?.seo_title ?? `${category.name} in ${city} | STYLEATLAS`;
  const description =
    seoPage?.meta_description ??
    `Discover verified ${category.name.toLowerCase()} in ${city}. Compare portfolios, reviews, and pricing, then contact your favorites directly.`;

  return buildMetadata({ title, description, path: `/directory/${params.category}/${params.city}` });
}

export default async function CategoryCityPage({ params, searchParams }: Props) {
  const category = await getCategoryBySlug(params.category);
  if (!category) notFound();

  const city = cityLabel(params.city);
  const seoPage = await getSeoPage(pageSlug(params.category, params.city));
  const fallback = buildFallbackIntro(category.name, city);

  const page = Number(searchParams.page ?? "1");
  const result = await searchProfessionals({
    categorySlug: params.category,
    city,
    state: searchParams.state,
    priceRange: searchParams.price as "budget" | "mid" | "premium" | "luxury" | undefined,
    minRating: searchParams.minRating ? Number(searchParams.minRating) : undefined,
    verifiedOnly: searchParams.verified === "true",
    availability: searchParams.availability as "available" | "booked" | "unavailable" | undefined,
    sort: (searchParams.sort as "relevance" | "rating" | "newest" | "verified" | "most_reviewed" | "premium") ?? "relevance",
    keyword: searchParams.q,
    page,
  });

  const otherCities = FEATURED_CITIES.filter((c) => c.slug !== params.city).slice(0, 6);

  return (
    <div className="section-container py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          localBusinessSchema({
            name: `${category.name} in ${city}`,
            description: seoPage?.meta_description ?? fallback.intro,
            url: `/directory/${params.category}/${params.city}`,
            address: { city, state: FEATURED_CITIES.find((c) => c.slug === params.city)?.state ?? city, country: "Nigeria" },
          })
        )}
      />

      <Breadcrumbs
        items={[
          { label: "Directory", href: "/directory" },
          { label: category.name, href: `/directory/${params.category}` },
          { label: city },
        ]}
      />

      <h1 className="mt-4 font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">
        {seoPage?.h1 ?? fallback.h1}
      </h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">{seoPage?.intro_content ?? fallback.intro}</p>

      <div className="mt-10">
        <DirectoryResults
          result={result}
          basePath={`/directory/${params.category}/${params.city}`}
          currentSearchParams={searchParams}
        />
      </div>

      <section className="border-t border-charcoal-100 py-10">
        <h2 className="mb-4 font-serif text-xl font-semibold text-charcoal-900">
          {category.name} in Other Cities
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {otherCities.map((c) => (
            <Link
              key={c.slug}
              href={`/directory/${params.category}/${c.slug}`}
              className="rounded-full border border-charcoal-200 px-4 py-2 text-sm font-medium text-charcoal-700 hover:border-gold-300 hover:text-gold-600"
            >
              {category.name} in {c.name}
            </Link>
          ))}
        </div>
      </section>

      <FaqSection faqs={seoPage?.faq_json ?? fallback.faqs} />
    </div>
  );
}

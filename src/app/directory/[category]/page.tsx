import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/data/categories";
import { searchProfessionals } from "@/lib/data/professionals";
import { getSeoPage, buildFallbackIntro } from "@/lib/data/seo-pages";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { FaqSection } from "@/components/shared/faq-section";
import { DirectoryResults } from "@/components/directory/directory-results";

interface Props {
  params: { category: string };
  searchParams: Record<string, string | undefined>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) return {};

  const seoPage = await getSeoPage(params.category);
  const title = seoPage?.seo_title ?? category.seo_title ?? `${category.name} in Nigeria | STYLEATLAS`;
  const description =
    seoPage?.meta_description ??
    category.seo_description ??
    `Find and compare verified ${category.name.toLowerCase()} across Nigeria. Read reviews, view portfolios, and contact directly.`;

  return buildMetadata({ title, description, path: `/directory/${params.category}` });
}

export default async function CategoryDirectoryPage({ params, searchParams }: Props) {
  const category = await getCategoryBySlug(params.category);
  if (!category) notFound();

  const seoPage = await getSeoPage(params.category);
  const fallback = buildFallbackIntro(category.name);

  const page = Number(searchParams.page ?? "1");
  const result = await searchProfessionals({
    categorySlug: params.category,
    city: searchParams.city,
    state: searchParams.state,
    priceRange: searchParams.price as "budget" | "mid" | "premium" | "luxury" | undefined,
    minRating: searchParams.minRating ? Number(searchParams.minRating) : undefined,
    verifiedOnly: searchParams.verified === "true",
    availability: searchParams.availability as "available" | "booked" | "unavailable" | undefined,
    sort: (searchParams.sort as "relevance" | "rating" | "newest" | "verified" | "most_reviewed" | "premium") ?? "relevance",
    keyword: searchParams.q,
    page,
  });

  return (
    <div className="section-container py-10">
      <Breadcrumbs items={[{ label: "Directory", href: "/directory" }, { label: category.name }]} />

      <h1 className="mt-4 font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">
        {seoPage?.h1 ?? fallback.h1}
      </h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">{seoPage?.intro_content ?? fallback.intro}</p>

      <div className="mt-10">
        <DirectoryResults result={result} basePath={`/directory/${params.category}`} currentSearchParams={searchParams} />
      </div>

      <FaqSection faqs={seoPage?.faq_json ?? fallback.faqs} />
    </div>
  );
}

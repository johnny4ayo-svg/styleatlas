import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getOutfitsByCategory } from "@/lib/data/outfits";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { OUTFIT_CATEGORIES } from "@/lib/constants";

interface Props {
  params: { category: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = OUTFIT_CATEGORIES.find((c) => c.slug === params.category);
  if (!meta) return {};
  return buildMetadata({
    title: `${meta.name} Inspiration Gallery | STYLEATLAS`,
    description: `Browse premium ${meta.name.toLowerCase()} looks from Nigeria's top fashion designers. Save your favorites and connect with the designer behind each look.`,
    path: `/inspiration/${params.category}`,
  });
}

export default async function InspirationCategoryPage({ params, searchParams }: Props) {
  const categoryMeta = OUTFIT_CATEGORIES.find((c) => c.slug === params.category);
  if (!categoryMeta) notFound();

  const page = Number(searchParams.page ?? "1");
  const pageSize = 24;
  const { data: outfits, count } = await getOutfitsByCategory(params.category, page, pageSize);
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div className="section-container py-10">
      <Breadcrumbs items={[{ label: "Inspiration", href: "/inspiration" }, { label: categoryMeta.name }]} />
      <h1 className="mt-4 font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">{categoryMeta.name} Inspiration</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{categoryMeta.description}</p>

      <div className="mt-10">
        {outfits.length === 0 ? (
          <EmptyState
            title="No looks published yet"
            description="Check back soon, or explore another category for inspiration."
            actionLabel="Browse all inspiration"
            actionHref="/inspiration"
          />
        ) : (
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
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Pagination currentPage={page} totalPages={totalPages} buildHref={(p) => `/inspiration/${params.category}?page=${p}`} />
        </div>
      </div>
    </div>
  );
}

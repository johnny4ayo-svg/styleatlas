import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostsByCategory } from "@/lib/data/blog";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";

interface Props {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoryName } = await getPostsByCategory(params.slug);
  if (!categoryName) return {};
  return buildMetadata({
    title: `${categoryName} Articles | STYLEATLAS Journal`,
    description: `Read the latest ${categoryName.toLowerCase()} articles from the STYLEATLAS Journal.`,
    path: `/blog/category/${params.slug}`,
  });
}

export default async function BlogCategoryPage({ params, searchParams }: Props) {
  const page = Number(searchParams.page ?? "1");
  const { data: posts, count, categoryName } = await getPostsByCategory(params.slug, page);
  if (!categoryName) notFound();

  const totalPages = Math.max(1, Math.ceil(count / 12));

  return (
    <div className="section-container py-10">
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: categoryName }]} />
      <h1 className="mt-4 font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">{categoryName}</h1>

      <div className="mt-10">
        {posts.length === 0 ? (
          <EmptyState title="No posts in this category yet" description="Check back soon." actionLabel="Browse all posts" actionHref="/blog" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        <div className="mt-10">
          <Pagination currentPage={page} totalPages={totalPages} buildHref={(p) => `/blog/category/${params.slug}?page=${p}`} />
        </div>
      </div>
    </div>
  );
}

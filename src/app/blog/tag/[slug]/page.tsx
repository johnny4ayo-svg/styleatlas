import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostsByTag } from "@/lib/data/blog";
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
  const { tagName } = await getPostsByTag(params.slug);
  if (!tagName) return {};
  return buildMetadata({
    title: `#${tagName} Articles | STYLEATLAS Journal`,
    description: `Articles tagged ${tagName} from the STYLEATLAS Journal.`,
    path: `/blog/tag/${params.slug}`,
  });
}

export default async function BlogTagPage({ params, searchParams }: Props) {
  const page = Number(searchParams.page ?? "1");
  const { data: posts, count, tagName } = await getPostsByTag(params.slug, page);
  if (!tagName) notFound();

  const totalPages = Math.max(1, Math.ceil(count / 12));

  return (
    <div className="section-container py-10">
      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: `#${tagName}` }]} />
      <h1 className="mt-4 font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">#{tagName}</h1>

      <div className="mt-10">
        {posts.length === 0 ? (
          <EmptyState title="No posts with this tag yet" description="Check back soon." actionLabel="Browse all posts" actionHref="/blog" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        <div className="mt-10">
          <Pagination currentPage={page} totalPages={totalPages} buildHref={(p) => `/blog/tag/${params.slug}?page=${p}`} />
        </div>
      </div>
    </div>
  );
}

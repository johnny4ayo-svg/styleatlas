import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { getPublishedPosts, getBlogCategories, getRecentPosts } from "@/lib/data/blog";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";

export const metadata = buildMetadata({
  title: "The STYLEATLAS Journal — Nigerian Fashion Blog",
  description: "Style guides, designer spotlights, trend reports, and industry news from Nigeria's fashion capital.",
  path: "/blog",
});

interface Props {
  searchParams: { page?: string };
}

export default async function BlogHomePage({ searchParams }: Props) {
  const page = Number(searchParams.page ?? "1");
  const [{ data: posts, count }, categories, featured] = await Promise.all([
    getPublishedPosts(page, 9),
    getBlogCategories(),
    getRecentPosts(1),
  ]);
  const totalPages = Math.max(1, Math.ceil(count / 9));
  const featuredPost = page === 1 ? featured[0] : undefined;

  return (
    <div>
      <section className="bg-charcoal-900 py-16 text-center">
        <div className="section-container">
          <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">The STYLEATLAS Journal</h1>
          <p className="mx-auto mt-3 max-w-xl text-charcoal-300">
            Style guides, designer spotlights, and trend reports from Nigeria&apos;s fashion capital.
          </p>
        </div>
      </section>

      <section className="section-container py-10">
        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog/category/${cat.slug}`}
              className="rounded-full border border-charcoal-200 px-4 py-2 text-sm font-medium text-charcoal-700 hover:border-gold-300 hover:text-gold-600"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {featuredPost && (
        <section className="section-container pb-10">
          <Link href={`/blog/${featuredPost.slug}`} className="group grid gap-6 overflow-hidden rounded-xl border border-charcoal-100 bg-white shadow-card md:grid-cols-2">
            <div className="relative aspect-video overflow-hidden bg-charcoal-100 md:aspect-auto">
              {featuredPost.featured_image_url && (
                <Image
                  src={featuredPost.featured_image_url}
                  alt={featuredPost.featured_image_alt || featuredPost.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div className="flex flex-col justify-center p-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold-600">Featured</p>
              <h2 className="font-serif text-2xl font-semibold text-charcoal-900 group-hover:text-gold-600">{featuredPost.title}</h2>
              {featuredPost.excerpt && <p className="mt-3 text-muted-foreground">{featuredPost.excerpt}</p>}
            </div>
          </Link>
        </section>
      )}

      <section className="section-container pb-16">
        {posts.length === 0 ? (
          <EmptyState title="No posts published yet" description="Check back soon for style guides and designer spotlights." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        <div className="mt-10">
          <Pagination currentPage={page} totalPages={totalPages} buildHref={(p) => `/blog?page=${p}`} />
        </div>
      </section>

      <section className="section-container pb-16">
        <NewsletterSignup />
      </section>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-ivory py-16 sm:py-20">
      <div className="section-container">
        <div className="mb-10 flex items-end justify-between">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">Fashion Guides &amp; Stories</p>
            <h2 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">The STYLEATLAS Journal</h2>
            <p className="mt-3 text-charcoal-500">
              Fashion guides, bridal tips, Aso Ebi trends, designer advice, and practical resources for Nigeria&apos;s
              fashion community.
            </p>
          </div>
          <Link href="/blog" className="hidden text-sm font-medium text-gold-600 hover:underline sm:block">
            Read more →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-lg border border-charcoal-100 bg-white shadow-card transition hover:shadow-elevated">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-charcoal-100">
                {post.featured_image_url && (
                  <Image
                    src={post.featured_image_url}
                    alt={post.featured_image_alt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gold-600">
                  {formatDate(post.published_at ?? post.created_at)} · {post.reading_time} min read
                </p>
                <h3 className="font-serif text-lg font-semibold leading-snug text-charcoal-900 group-hover:text-gold-600">
                  {post.title}
                </h3>
                {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

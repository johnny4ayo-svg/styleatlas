import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getPostBySlug, getRelatedPosts } from "@/lib/data/blog";
import { createClient } from "@/lib/supabase/server";
import { buildMetadata, articleSchema, jsonLdScript } from "@/lib/seo";
import { extractHeadingsAndInjectIds } from "@/lib/toc";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { ShareButton } from "@/components/shared/share-button";
import { FaqSection } from "@/components/shared/faq-section";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  return buildMetadata({
    title: post.seo_title ?? post.title,
    description: post.meta_description ?? post.excerpt ?? "",
    path: `/blog/${post.slug}`,
    image: post.og_image_url ?? post.featured_image_url ?? undefined,
    noindex: post.noindex,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const supabase = createClient();
  const { data: author } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", post.author_id).maybeSingle();

  const categoryIds = (post.categories ?? []).map((c) => (c as unknown as { category: { id: string } }).category?.id).filter(Boolean) as string[];
  const relatedPosts = await getRelatedPosts(post.id, categoryIds);

  const { html, headings } = extractHeadingsAndInjectIds(post.content);
  const faqs = Array.isArray(post.faq_json) ? (post.faq_json as { question: string; answer: string }[]) : [];

  return (
    <article className="section-container py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          articleSchema({
            headline: post.title,
            description: post.meta_description ?? post.excerpt,
            image: post.featured_image_url,
            datePublished: post.published_at,
            dateModified: post.updated_at,
            authorName: (author as { full_name: string } | null)?.full_name ?? "STYLEATLAS Editorial",
            url: `/blog/${post.slug}`,
            schemaType: post.schema_type,
          })
        )}
      />

      <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

      <header className="mx-auto mt-6 max-w-3xl text-center">
        {post.is_sponsored && <Badge variant="outline" className="mb-3">Sponsored</Badge>}
        <h1 className="font-serif text-3xl font-semibold text-charcoal-900 sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          By {(author as { full_name: string } | null)?.full_name ?? "STYLEATLAS Editorial"} · {formatDate(post.published_at ?? post.created_at)} · {post.reading_time} min read
        </p>
      </header>

      {post.featured_image_url && (
        <div className="relative mx-auto mt-8 aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-charcoal-100">
          <Image src={post.featured_image_url} alt={post.featured_image_alt || post.title} fill priority className="object-cover" />
        </div>
      )}

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-10 lg:grid-cols-[1fr_240px]">
        <div>
          <div className="prose-editorial" dangerouslySetInnerHTML={{ __html: html }} />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((t) => {
                const tag = (t as unknown as { tag: { slug: string; name: string } }).tag;
                return (
                  <Link key={tag.slug} href={`/blog/tag/${tag.slug}`} className="rounded-full bg-charcoal-50 px-3 py-1 text-xs text-charcoal-600 hover:bg-gold-50 hover:text-gold-600">
                    #{tag.name}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8">
            <ShareButton title={post.title} path={`/blog/${post.slug}`} />
          </div>

          <FaqSection faqs={faqs} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <TableOfContents headings={headings} />
        </aside>
      </div>

      {relatedPosts.length > 0 && (
        <section className="mx-auto mt-16 max-w-4xl border-t border-charcoal-100 pt-10">
          <h2 className="mb-6 font-serif text-2xl font-semibold text-charcoal-900">Related Articles</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {relatedPosts.map((related) => (
              <BlogPostCard key={related.id} post={related} />
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto mt-16 max-w-4xl">
        <NewsletterSignup />
      </div>
    </article>
  );
}

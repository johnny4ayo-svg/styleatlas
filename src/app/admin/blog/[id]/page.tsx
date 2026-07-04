import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogPostEditor } from "@/components/cms/blog-post-editor";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: post }, { data: categories }, { data: postCategories }, { data: postTags }] = await Promise.all([
    supabase.from("blog_posts").select("*").eq("id", params.id).maybeSingle(),
    supabase.from("blog_categories").select("id, name").order("name"),
    supabase.from("blog_post_categories").select("category_id").eq("post_id", params.id),
    supabase.from("blog_post_tags").select("tag:blog_tags(name)").eq("post_id", params.id),
  ]);

  if (!post) notFound();

  const typedPost = post as {
    title: string; slug: string; excerpt: string | null; content: string; featured_image_url: string | null;
    featured_image_alt: string | null; status: "draft" | "scheduled" | "published" | "archived"; scheduled_at: string | null;
    seo_title: string | null; meta_description: string | null; canonical_url: string | null; focus_keyword: string | null;
    og_title: string | null; og_description: string | null; og_image_url: string | null; noindex: boolean;
    is_sponsored: boolean; schema_type: "Article" | "BlogPosting" | "NewsArticle"; faq_json: { question: string; answer: string }[];
  };

  return (
    <BlogPostEditor
      postId={params.id}
      categories={categories ?? []}
      defaultValues={{
        title: typedPost.title,
        slug: typedPost.slug,
        excerpt: typedPost.excerpt ?? "",
        content: typedPost.content,
        featuredImageUrl: typedPost.featured_image_url ?? "",
        featuredImageAlt: typedPost.featured_image_alt ?? "",
        status: typedPost.status,
        scheduledAt: typedPost.scheduled_at ?? "",
        seoTitle: typedPost.seo_title ?? "",
        metaDescription: typedPost.meta_description ?? "",
        canonicalUrl: typedPost.canonical_url ?? "",
        focusKeyword: typedPost.focus_keyword ?? "",
        ogTitle: typedPost.og_title ?? "",
        ogDescription: typedPost.og_description ?? "",
        ogImageUrl: typedPost.og_image_url ?? "",
        noindex: typedPost.noindex,
        isSponsored: typedPost.is_sponsored,
        schemaType: typedPost.schema_type,
        faqs: typedPost.faq_json ?? [],
        categoryIds: (postCategories ?? []).map((c) => (c as { category_id: string }).category_id),
        tagNames: (postTags ?? []).map((t) => (t as unknown as { tag: { name: string } }).tag?.name).filter(Boolean),
      }}
    />
  );
}

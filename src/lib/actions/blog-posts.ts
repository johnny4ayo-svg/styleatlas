"use server";

import DOMPurify from "isomorphic-dompurify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { blogPostSchema, type BlogPostFormValues } from "@/lib/validations/blog-post";
import { readingTime, slugify } from "@/lib/utils";
import { requireRole } from "@/lib/auth/rbac";

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li", "blockquote",
    "h2", "h3", "h4", "img", "iframe", "table", "thead", "tbody", "tr", "th", "td", "code", "pre",
  ],
  ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel", "class", "id", "colspan", "rowspan", "frameborder", "allowfullscreen"],
};

async function ensureUniqueSlug(desiredSlug: string, excludeId?: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("generate_unique_slug", {
    base_text: desiredSlug,
    table_name: "blog_posts",
    column_name: "slug",
    existing_id: excludeId ?? null,
  });
  if (error) throw new Error(error.message);
  return data as string;
}

async function syncCategoriesAndTags(postId: string, categoryIds: string[], tagNames: string[]) {
  const supabase = createClient();

  await supabase.from("blog_post_categories").delete().eq("post_id", postId);
  if (categoryIds.length > 0) {
    await supabase.from("blog_post_categories").insert(categoryIds.map((category_id) => ({ post_id: postId, category_id })));
  }

  await supabase.from("blog_post_tags").delete().eq("post_id", postId);
  if (tagNames.length > 0) {
    const tagIds: string[] = [];
    for (const name of tagNames) {
      const slug = slugify(name);
      const { data: existing } = await supabase.from("blog_tags").select("id").eq("slug", slug).maybeSingle();
      if (existing) {
        tagIds.push((existing as { id: string }).id);
      } else {
        const { data: created } = await supabase.from("blog_tags").insert({ name, slug }).select("id").single();
        if (created) tagIds.push((created as { id: string }).id);
      }
    }
    await supabase.from("blog_post_tags").insert(tagIds.map((tag_id) => ({ post_id: postId, tag_id })));
  }
}

export async function createBlogPost(input: BlogPostFormValues) {
  const profile = await requireRole("admin", "super_admin");
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) return { error: "validation_error" as const, issues: parsed.error.flatten().fieldErrors };

  const supabase = createClient();
  const slug = await ensureUniqueSlug(parsed.data.slug || slugify(parsed.data.title));
  const sanitizedContent = DOMPurify.sanitize(parsed.data.content, SANITIZE_CONFIG);

  const { data: post, error } = await supabase
    .from("blog_posts")
    .insert({
      author_id: profile.id,
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt || null,
      content: sanitizedContent,
      featured_image_url: parsed.data.featuredImageUrl || null,
      featured_image_alt: parsed.data.featuredImageAlt || null,
      status: parsed.data.status,
      published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
      scheduled_at: parsed.data.status === "scheduled" ? parsed.data.scheduledAt || null : null,
      seo_title: parsed.data.seoTitle || null,
      meta_description: parsed.data.metaDescription || null,
      canonical_url: parsed.data.canonicalUrl || null,
      focus_keyword: parsed.data.focusKeyword || null,
      og_title: parsed.data.ogTitle || null,
      og_description: parsed.data.ogDescription || null,
      og_image_url: parsed.data.ogImageUrl || null,
      noindex: parsed.data.noindex,
      is_sponsored: parsed.data.isSponsored,
      schema_type: parsed.data.schemaType,
      faq_json: parsed.data.faqs,
      reading_time: readingTime(sanitizedContent.replace(/<[^>]+>/g, " ")),
    })
    .select("id")
    .single();

  if (error || !post) return { error: "server_error" as const, message: error?.message };

  const postId = (post as { id: string }).id;
  await syncCategoriesAndTags(postId, parsed.data.categoryIds, parsed.data.tagNames);
  await supabase.from("blog_post_revisions").insert({
    post_id: postId,
    editor_id: profile.id,
    title: parsed.data.title,
    content: sanitizedContent,
    is_autosave: false,
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect(`/admin/blog/${postId}`);
}

export async function updateBlogPost(postId: string, input: BlogPostFormValues) {
  const profile = await requireRole("admin", "super_admin");
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) return { error: "validation_error" as const, issues: parsed.error.flatten().fieldErrors };

  const supabase = createClient();
  const slug = await ensureUniqueSlug(parsed.data.slug || slugify(parsed.data.title), postId);
  const sanitizedContent = DOMPurify.sanitize(parsed.data.content, SANITIZE_CONFIG);

  const { data: existing } = await supabase.from("blog_posts").select("slug, status, published_at").eq("id", postId).single();
  const previousSlug = (existing as { slug: string } | null)?.slug;
  const wasPublished = (existing as { status: string } | null)?.status === "published";

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt || null,
      content: sanitizedContent,
      featured_image_url: parsed.data.featuredImageUrl || null,
      featured_image_alt: parsed.data.featuredImageAlt || null,
      status: parsed.data.status,
      published_at:
        parsed.data.status === "published"
          ? wasPublished
            ? (existing as { published_at: string }).published_at
            : new Date().toISOString()
          : null,
      scheduled_at: parsed.data.status === "scheduled" ? parsed.data.scheduledAt || null : null,
      seo_title: parsed.data.seoTitle || null,
      meta_description: parsed.data.metaDescription || null,
      canonical_url: parsed.data.canonicalUrl || null,
      focus_keyword: parsed.data.focusKeyword || null,
      og_title: parsed.data.ogTitle || null,
      og_description: parsed.data.ogDescription || null,
      og_image_url: parsed.data.ogImageUrl || null,
      noindex: parsed.data.noindex,
      is_sponsored: parsed.data.isSponsored,
      schema_type: parsed.data.schemaType,
      faq_json: parsed.data.faqs,
      reading_time: readingTime(sanitizedContent.replace(/<[^>]+>/g, " ")),
    })
    .eq("id", postId);

  if (error) return { error: "server_error" as const, message: error.message };

  await syncCategoriesAndTags(postId, parsed.data.categoryIds, parsed.data.tagNames);
  await supabase.from("blog_post_revisions").insert({
    post_id: postId,
    editor_id: profile.id,
    title: parsed.data.title,
    content: sanitizedContent,
    is_autosave: false,
  });

  // Slug changed on an already-indexed post: leave a 301 so old links/SEO
  // equity aren't lost (redirect manager requirement).
  if (previousSlug && previousSlug !== slug) {
    await supabase.from("redirects").insert({
      from_path: `/blog/${previousSlug}`,
      to_path: `/blog/${slug}`,
      status_code: 301,
    });
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return { success: true as const };
}

export async function autosaveBlogPost(postId: string, title: string, content: string) {
  const profile = await requireRole("admin", "super_admin");
  const supabase = createClient();
  await supabase.from("blog_post_revisions").insert({
    post_id: postId,
    editor_id: profile.id,
    title,
    content: DOMPurify.sanitize(content, SANITIZE_CONFIG),
    is_autosave: true,
  });
  return { success: true as const };
}

export async function deleteBlogPost(postId: string) {
  await requireRole("admin", "super_admin");
  const supabase = createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", postId);
  if (error) return { error: "server_error" as const };
  revalidatePath("/admin/blog");
  return { success: true as const };
}

import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types";

export async function getRecentPosts(limit = 3): Promise<BlogPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, categories:blog_post_categories(category:blog_categories(*))")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentPosts failed", error.message);
    return [];
  }
  return (data ?? []) as unknown as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, categories:blog_post_categories(category:blog_categories(*)), tags:blog_post_tags(tag:blog_tags(*))")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("getPostBySlug failed", error.message);
    return null;
  }
  return (data as unknown as BlogPost) ?? null;
}

export async function getPublishedPosts(page = 1, pageSize = 12) {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const { data, error, count } = await supabase
    .from("blog_posts")
    .select("*, categories:blog_post_categories(category:blog_categories(*))", { count: "exact" })
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) {
    console.error("getPublishedPosts failed", error.message);
    return { data: [] as BlogPost[], count: 0 };
  }
  return { data: (data ?? []) as unknown as BlogPost[], count: count ?? 0 };
}

export async function getBlogCategories() {
  const supabase = createClient();
  const { data, error } = await supabase.from("blog_categories").select("*").order("name");
  if (error) {
    console.error("getBlogCategories failed", error.message);
    return [];
  }
  return data ?? [];
}

export async function getBlogTags() {
  const supabase = createClient();
  const { data, error } = await supabase.from("blog_tags").select("*").order("name");
  if (error) {
    console.error("getBlogTags failed", error.message);
    return [];
  }
  return data ?? [];
}

export async function getPostsByCategory(categorySlug: string, page = 1, pageSize = 12) {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const { data: categoryRow } = await supabase.from("blog_categories").select("id, name").eq("slug", categorySlug).maybeSingle();
  if (!categoryRow) return { data: [] as BlogPost[], count: 0, categoryName: null as string | null };

  const { data: postIdRows } = await supabase
    .from("blog_post_categories")
    .select("post_id")
    .eq("category_id", (categoryRow as { id: string }).id);
  const postIds = (postIdRows ?? []).map((r) => (r as { post_id: string }).post_id);
  if (postIds.length === 0) return { data: [] as BlogPost[], count: 0, categoryName: (categoryRow as { name: string }).name };

  const { data, error, count } = await supabase
    .from("blog_posts")
    .select("*, categories:blog_post_categories(category:blog_categories(*))", { count: "exact" })
    .in("id", postIds)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) {
    console.error("getPostsByCategory failed", error.message);
    return { data: [] as BlogPost[], count: 0, categoryName: (categoryRow as { name: string }).name };
  }
  return { data: (data ?? []) as unknown as BlogPost[], count: count ?? 0, categoryName: (categoryRow as { name: string }).name };
}

export async function getPostsByTag(tagSlug: string, page = 1, pageSize = 12) {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const { data: tagRow } = await supabase.from("blog_tags").select("id, name").eq("slug", tagSlug).maybeSingle();
  if (!tagRow) return { data: [] as BlogPost[], count: 0, tagName: null as string | null };

  const { data: postIdRows } = await supabase.from("blog_post_tags").select("post_id").eq("tag_id", (tagRow as { id: string }).id);
  const postIds = (postIdRows ?? []).map((r) => (r as { post_id: string }).post_id);
  if (postIds.length === 0) return { data: [] as BlogPost[], count: 0, tagName: (tagRow as { name: string }).name };

  const { data, error, count } = await supabase
    .from("blog_posts")
    .select("*, categories:blog_post_categories(category:blog_categories(*))", { count: "exact" })
    .in("id", postIds)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) {
    console.error("getPostsByTag failed", error.message);
    return { data: [] as BlogPost[], count: 0, tagName: (tagRow as { name: string }).name };
  }
  return { data: (data ?? []) as unknown as BlogPost[], count: count ?? 0, tagName: (tagRow as { name: string }).name };
}

export async function getRelatedPosts(postId: string, categoryIds: string[], limit = 3): Promise<BlogPost[]> {
  if (categoryIds.length === 0) return [];
  const supabase = createClient();
  const { data: postIdRows } = await supabase
    .from("blog_post_categories")
    .select("post_id")
    .in("category_id", categoryIds)
    .neq("post_id", postId);

  const postIds = Array.from(new Set((postIdRows ?? []).map((r) => (r as { post_id: string }).post_id)));
  if (postIds.length === 0) return [];

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .in("id", postIds)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRelatedPosts failed", error.message);
    return [];
  }
  return (data ?? []) as unknown as BlogPost[];
}

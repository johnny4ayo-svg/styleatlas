import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("status", "active")
    .order("sort_order");

  if (error) {
    console.error("getCategories failed", error.message);
    return [];
  }
  return (data ?? []) as unknown as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    console.error("getCategoryBySlug failed", error.message);
    return null;
  }
  return (data as unknown as Category) ?? null;
}

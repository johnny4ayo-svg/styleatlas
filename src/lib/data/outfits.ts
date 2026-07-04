import { createClient } from "@/lib/supabase/server";
import type { OutfitInspiration } from "@/types";

export async function getFeaturedOutfits(limit = 8): Promise<OutfitInspiration[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("outfit_inspirations")
    .select("*, category:categories(*), designer:professional_accounts(id, business_name, slug, logo_url)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedOutfits failed", error.message);
    return [];
  }
  return (data ?? []) as unknown as OutfitInspiration[];
}

export async function getOutfitsByCategory(categorySlug: string, page = 1, pageSize = 24) {
  const supabase = createClient();
  const from = (page - 1) * pageSize;
  const { data, error, count } = await supabase
    .from("outfit_inspirations")
    .select("*, category:categories!inner(*), designer:professional_accounts(id, business_name, slug, logo_url)", { count: "exact" })
    .eq("status", "active")
    .eq("category.slug", categorySlug)
    .order("created_at", { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) {
    console.error("getOutfitsByCategory failed", error.message);
    return { data: [] as OutfitInspiration[], count: 0 };
  }
  return { data: (data ?? []) as unknown as OutfitInspiration[], count: count ?? 0 };
}

export async function getOutfitBySlug(slug: string): Promise<OutfitInspiration | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("outfit_inspirations")
    .select("*, category:categories(*), designer:professional_accounts(id, business_name, slug, logo_url)")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error("getOutfitBySlug failed", error.message);
    return null;
  }
  return (data as unknown as OutfitInspiration) ?? null;
}

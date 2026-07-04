import { createClient } from "@/lib/supabase/server";
import type { PortfolioItem, ProfessionalAccount, Review, OutfitInspiration } from "@/types";

export async function getPortfolioItems(accountId: string): Promise<PortfolioItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("professional_account_id", accountId)
    .eq("status", "active")
    .order("sort_order");

  if (error) {
    console.error("getPortfolioItems failed", error.message);
    return [];
  }
  return (data ?? []) as unknown as PortfolioItem[];
}

export async function getServices(accountId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("professional_account_id", accountId)
    .eq("status", "active")
    .order("sort_order");

  if (error) {
    console.error("getServices failed", error.message);
    return [];
  }
  return data ?? [];
}

export async function getPublishedReviews(accountId: string, limit = 20): Promise<Review[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, customer:profiles(id, full_name, avatar_url), photos:review_photos(id, image_url, alt_text)")
    .eq("professional_account_id", accountId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getPublishedReviews failed", error.message);
    return [];
  }
  return (data ?? []) as unknown as Review[];
}

export async function getSimilarProfessionals(
  categoryId: string,
  city: string,
  excludeId: string,
  limit = 4
): Promise<ProfessionalAccount[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("professional_accounts")
    .select("*, category:categories(*), plan:subscription_plans(*)")
    .eq("category_id", categoryId)
    .eq("status", "active")
    .neq("id", excludeId)
    .order("rating_average", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getSimilarProfessionals failed", error.message);
    return [];
  }

  const rows = (data ?? []) as unknown as ProfessionalAccount[];
  // Prefer same-city matches, but backfill with other cities if needed.
  const sameCity = rows.filter((r) => r.city === city);
  const rest = rows.filter((r) => r.city !== city);
  return [...sameCity, ...rest].slice(0, limit);
}

export async function getRelatedOutfits(designerId: string, limit = 4): Promise<OutfitInspiration[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("outfit_inspirations")
    .select("*, category:categories(*)")
    .eq("designer_id", designerId)
    .eq("status", "active")
    .limit(limit);

  if (error) {
    console.error("getRelatedOutfits failed", error.message);
    return [];
  }
  return (data ?? []) as unknown as OutfitInspiration[];
}

export async function isFavorited(userId: string | null, entityId: string): Promise<boolean> {
  if (!userId) return false;
  const supabase = createClient();
  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("entity_type", "professional_account")
    .eq("entity_id", entityId)
    .maybeSingle();
  return !!data;
}

import { createClient } from "@/lib/supabase/server";
import type { PaginatedResult, ProfessionalAccount } from "@/types";

export interface DirectorySearchParams {
  keyword?: string;
  categorySlug?: string;
  city?: string;
  state?: string;
  specialtySlugs?: string[];
  priceRange?: "budget" | "mid" | "premium" | "luxury";
  minRating?: number;
  verifiedOnly?: boolean;
  availability?: "available" | "booked" | "unavailable";
  sort?: "relevance" | "rating" | "newest" | "verified" | "most_reviewed" | "premium";
  page?: number;
  pageSize?: number;
}

/**
 * Calls the `search_professionals` Postgres function so filtering, plan-
 * boosted ranking, and pagination all happen server-side in a single
 * round trip instead of shipping the whole table to the client.
 */
export async function searchProfessionals(
  params: DirectorySearchParams
): Promise<PaginatedResult<ProfessionalAccount>> {
  const supabase = createClient();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;

  const { data, error } = await supabase.rpc("search_professionals", {
    p_keyword: params.keyword ?? null,
    p_category_slug: params.categorySlug ?? null,
    p_city: params.city ?? null,
    p_state: params.state ?? null,
    p_specialty_slugs: params.specialtySlugs ?? null,
    p_price_range: params.priceRange ?? null,
    p_min_rating: params.minRating ?? null,
    p_verified_only: params.verifiedOnly ?? false,
    p_availability: params.availability ?? null,
    p_sort: params.sort ?? "relevance",
    p_page: page,
    p_page_size: pageSize,
  });

  if (error) {
    console.error("searchProfessionals failed", error.message);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  const rows = (data ?? []) as Array<Record<string, unknown>>;
  const count = rows[0]?.total_count ? Number(rows[0].total_count) : 0;

  return {
    data: rows.map(
      (row) =>
        ({
          id: row.id,
          business_name: row.business_name,
          slug: row.slug,
          city: row.city,
          state: row.state,
          logo_url: row.logo_url,
          cover_image_url: row.cover_image_url,
          price_range: row.price_range,
          verification_status: row.verification_status,
          rating_average: row.rating_average,
          review_count: row.review_count,
          category_id: row.category_id,
          plan: row.plan_slug ? { slug: row.plan_slug } : undefined,
        }) as unknown as ProfessionalAccount
    ),
    count,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(count / pageSize)),
  };
}

export async function getFeaturedProfessionals(limit = 8): Promise<ProfessionalAccount[]> {
  const result = await searchProfessionals({ sort: "premium", pageSize: limit });
  return result.data;
}

/**
 * Distinct from getFeaturedProfessionals (which ranks by paid plan tier):
 * this powers the homepage "Verified Professionals" trust section, so it
 * ranks by verification level instead of subscription — a free-plan
 * professional with premium_verified status should still show up here.
 */
export async function getVerifiedProfessionals(limit = 6): Promise<ProfessionalAccount[]> {
  const result = await searchProfessionals({ sort: "verified", verifiedOnly: true, pageSize: limit });
  return result.data;
}

export async function getProfessionalBySlug(slug: string): Promise<ProfessionalAccount | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("professional_accounts")
    .select("*, category:categories(*), plan:subscription_plans(*)")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error("getProfessionalBySlug failed", error.message);
    return null;
  }
  return (data as unknown as ProfessionalAccount) ?? null;
}

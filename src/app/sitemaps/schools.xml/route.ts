import { createClient } from "@/lib/supabase/server";
import { urlSetXml, xmlResponse } from "@/lib/sitemap";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export async function GET() {
  const supabase = createClient();
  const { data } = await supabase
    .from("professional_accounts")
    .select("slug, updated_at, category:categories!inner(slug)")
    .eq("status", "active")
    .eq("category.slug", "fashion-schools");

  return xmlResponse(
    urlSetXml((data ?? []).map((row) => ({ loc: `${SITE_URL}/designers/${row.slug}`, lastmod: row.updated_at, changefreq: "weekly", priority: 0.7 })))
  );
}

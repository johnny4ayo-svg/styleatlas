import { createClient } from "@/lib/supabase/server";
import { urlSetXml, xmlResponse } from "@/lib/sitemap";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export async function GET() {
  const supabase = createClient();
  const { data } = await supabase.from("categories").select("slug, updated_at").eq("status", "active");

  return xmlResponse(
    urlSetXml(
      (data ?? []).map((row) => ({
        loc: `${SITE_URL}/directory/${row.slug}`,
        lastmod: row.updated_at,
        changefreq: "daily",
        priority: 0.9,
      }))
    )
  );
}

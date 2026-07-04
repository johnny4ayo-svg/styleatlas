import { createClient } from "@/lib/supabase/server";
import { urlSetXml, xmlResponse } from "@/lib/sitemap";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export async function GET() {
  const supabase = createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, noindex")
    .eq("status", "published")
    .eq("noindex", false);

  return xmlResponse(
    urlSetXml(
      (data ?? []).map((row) => ({
        loc: `${SITE_URL}/blog/${row.slug}`,
        lastmod: row.updated_at,
        changefreq: "monthly",
        priority: 0.6,
      }))
    )
  );
}

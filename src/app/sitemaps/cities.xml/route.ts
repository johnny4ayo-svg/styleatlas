import { createClient } from "@/lib/supabase/server";
import { urlSetXml, xmlResponse } from "@/lib/sitemap";
import { SITE_URL, FEATURED_CITIES } from "@/lib/constants";

export const revalidate = 3600;

export async function GET() {
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("slug").eq("status", "active");

  const urls = (categories ?? []).flatMap((cat) =>
    FEATURED_CITIES.map((city) => ({
      loc: `${SITE_URL}/directory/${cat.slug}/${city.slug}`,
      changefreq: "daily" as const,
      priority: 0.85,
    }))
  );

  return xmlResponse(urlSetXml(urls));
}

import { sitemapIndexXml, xmlResponse } from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
  return xmlResponse(
    sitemapIndexXml([
      "/sitemaps/static.xml",
      "/sitemaps/listings.xml",
      "/sitemaps/categories.xml",
      "/sitemaps/cities.xml",
      "/sitemaps/blog.xml",
      "/sitemaps/jobs.xml",
      "/sitemaps/events.xml",
      "/sitemaps/schools.xml",
      "/sitemaps/inspiration.xml",
    ])
  );
}

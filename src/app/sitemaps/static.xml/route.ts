import { urlSetXml, xmlResponse } from "@/lib/sitemap";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

const STATIC_PATHS = [
  "/", "/directory", "/inspiration", "/jobs", "/events", "/blog", "/pricing",
  "/about", "/contact", "/marketplace", "/terms", "/privacy", "/review-guidelines", "/verification",
];

export async function GET() {
  return xmlResponse(
    urlSetXml(STATIC_PATHS.map((path) => ({ loc: `${SITE_URL}${path}`, changefreq: "weekly", priority: path === "/" ? 1 : 0.7 })))
  );
}

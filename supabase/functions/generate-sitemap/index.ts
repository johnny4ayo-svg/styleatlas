// Computes sitemap URLs directly from the database. The production site
// itself serves sitemaps via Next.js route handlers (src/app/sitemap*.ts)
// for speed and caching — this function exists as a backend-triggerable
// equivalent (e.g. from a cron job) for pinging search engines after bulk
// content changes, or for external consumers that need the raw URL list.
import { handleCors, jsonResponse } from "../_shared/cors.ts";
import { createAdminClient } from "../_shared/supabase-admin.ts";

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const siteUrl = Deno.env.get("SITE_URL") ?? "https://styleatlas.ng";
    const admin = createAdminClient();

    const [{ data: professionals }, { data: posts }, { data: outfits }, { data: jobs }, { data: events }, { data: seoPages }] = await Promise.all([
      admin.from("professional_accounts").select("slug, updated_at").eq("status", "active"),
      admin.from("blog_posts").select("slug, updated_at").eq("status", "published"),
      admin.from("outfit_inspirations").select("slug, updated_at").eq("status", "active"),
      admin.from("jobs").select("slug, updated_at").eq("status", "active"),
      admin.from("events").select("slug, updated_at").eq("status", "active"),
      admin.from("seo_pages").select("slug, updated_at").eq("status", "active"),
    ]);

    const urls = [
      ...(professionals ?? []).map((p) => ({ loc: `${siteUrl}/designers/${p.slug}`, lastmod: p.updated_at })),
      ...(posts ?? []).map((p) => ({ loc: `${siteUrl}/blog/${p.slug}`, lastmod: p.updated_at })),
      ...(outfits ?? []).map((o) => ({ loc: `${siteUrl}/inspiration/item/${o.slug}`, lastmod: o.updated_at })),
      ...(jobs ?? []).map((j) => ({ loc: `${siteUrl}/jobs/${j.slug}`, lastmod: j.updated_at })),
      ...(events ?? []).map((e) => ({ loc: `${siteUrl}/events/${e.slug}`, lastmod: e.updated_at })),
      ...(seoPages ?? []).map((s) => ({ loc: `${siteUrl}/directory/${s.slug}`, lastmod: s.updated_at })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${new Date(u.lastmod).toISOString()}</lastmod></url>`).join("\n")}
</urlset>`;

    return new Response(xml, { headers: { "Content-Type": "application/xml" } });
  } catch (error) {
    console.error("generate-sitemap error", error);
    return jsonResponse({ error: "internal_error" }, 500);
  }
});

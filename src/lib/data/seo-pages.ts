import { createClient } from "@/lib/supabase/server";

export interface SeoPageContent {
  title: string;
  h1: string;
  intro_content: string;
  faq_json: { question: string; answer: string }[];
  seo_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
}

export async function getSeoPage(slug: string): Promise<SeoPageContent | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("seo_pages")
    .select("title, h1, intro_content, faq_json, seo_title, meta_description, canonical_url")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error("getSeoPage failed", error.message);
    return null;
  }
  return (data as unknown as SeoPageContent) ?? null;
}

/** Generates a unique, content-rich intro when no admin-authored seo_pages
 * row exists yet, so category/city combinations never render as thin
 * doorway pages. */
export function buildFallbackIntro(categoryName: string, cityName?: string) {
  const location = cityName ? ` in ${cityName}` : " across Nigeria";
  return {
    h1: `${categoryName}${location}`,
    intro: `Browse verified ${categoryName.toLowerCase()}${location}. Every listing on STYLEATLAS is moderated, and professionals can apply for identity, business, and premium verification so you can book with confidence. Compare portfolios, real customer reviews, pricing, and availability before reaching out — then contact your favorite professionals directly by WhatsApp, phone, or a quote request.`,
    faqs: [
      {
        question: `How do I choose the right ${categoryName.toLowerCase().replace(/s$/, "")}${location}?`,
        answer: `Compare portfolios, verification badges, and customer reviews on each profile. Look for a rating average, response time, and price range that fits your budget before reaching out.`,
      },
      {
        question: "Are the reviews on STYLEATLAS genuine?",
        answer: "Yes. Reviews can only be left by customers who completed an interaction, and every review goes through moderation before publishing.",
      },
      {
        question: "What does a verified badge mean?",
        answer: "Verified professionals have submitted identity, business, or address documentation that our team reviewed and approved — reducing the risk of dealing with unverified or fraudulent listings.",
      },
    ],
  };
}

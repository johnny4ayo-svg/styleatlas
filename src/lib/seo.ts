import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export function buildMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  keywords?: string[];
}): Metadata {
  const url = `${SITE_URL}${input.path}`;
  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url },
    robots: input.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: input.image ? [{ url: input.image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: input.image ? [input.image] : undefined,
    },
  };
}

export function jsonLdScript(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data) };
}

export function localBusinessSchema(input: {
  name: string;
  description?: string | null;
  url: string;
  image?: string | null;
  telephone?: string | null;
  address: { streetAddress?: string | null; city: string; state: string; country: string };
  ratingValue?: number;
  reviewCount?: number;
  priceRange?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: input.name,
    description: input.description ?? undefined,
    url: input.url,
    image: input.image ?? undefined,
    telephone: input.telephone ?? undefined,
    priceRange: input.priceRange ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: input.address.streetAddress ?? undefined,
      addressLocality: input.address.city,
      addressRegion: input.address.state,
      addressCountry: input.address.country,
    },
    ...(input.reviewCount && input.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: input.ratingValue ?? 0,
            reviewCount: input.reviewCount,
          },
        }
      : {}),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function articleSchema(input: {
  headline: string;
  description?: string | null;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName: string;
  url: string;
  schemaType?: "Article" | "BlogPosting" | "NewsArticle";
}) {
  return {
    "@context": "https://schema.org",
    "@type": input.schemaType ?? "BlogPosting",
    headline: input.headline,
    description: input.description ?? undefined,
    image: input.image ?? undefined,
    datePublished: input.datePublished ?? undefined,
    dateModified: input.dateModified ?? input.datePublished ?? undefined,
    author: { "@type": "Person", name: input.authorName },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
  };
}

export function jobPostingSchema(input: {
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string | null;
  employmentType: string;
  city: string;
  state: string;
  organizationName?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: input.title,
    description: input.description,
    datePosted: input.datePosted,
    validThrough: input.validThrough ?? undefined,
    employmentType: input.employmentType.toUpperCase(),
    hiringOrganization: { "@type": "Organization", name: input.organizationName ?? SITE_NAME },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: input.city, addressRegion: input.state, addressCountry: "NG" },
    },
    ...(input.salaryMin
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: input.currency ?? "NGN",
            value: { "@type": "QuantitativeValue", minValue: input.salaryMin, maxValue: input.salaryMax ?? input.salaryMin, unitText: "MONTH" },
          },
        }
      : {}),
  };
}

export function eventSchema(input: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  venue: string;
  city: string;
  state: string;
  image?: string | null;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    description: input.description,
    startDate: input.startDate,
    endDate: input.endDate ?? undefined,
    image: input.image ?? undefined,
    url: input.url,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: input.venue,
      address: { "@type": "PostalAddress", addressLocality: input.city, addressRegion: input.state, addressCountry: "NG" },
    },
  };
}

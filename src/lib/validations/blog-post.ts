import { z } from "zod";

export const blogPostSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().trim().max(300).optional().or(z.literal("")),
  content: z.string().min(1, "Content cannot be empty"),
  featuredImageUrl: z.string().url().optional().or(z.literal("")),
  featuredImageAlt: z.string().trim().max(160).optional().or(z.literal("")),
  status: z.enum(["draft", "scheduled", "published", "archived"]),
  scheduledAt: z.string().optional().or(z.literal("")),
  categoryIds: z.array(z.string().uuid()).default([]),
  tagNames: z.array(z.string().trim().min(1)).default([]),
  seoTitle: z.string().trim().max(70).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(160).optional().or(z.literal("")),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  focusKeyword: z.string().trim().max(80).optional().or(z.literal("")),
  ogTitle: z.string().trim().max(70).optional().or(z.literal("")),
  ogDescription: z.string().trim().max(200).optional().or(z.literal("")),
  ogImageUrl: z.string().url().optional().or(z.literal("")),
  noindex: z.boolean().default(false),
  isSponsored: z.boolean().default(false),
  schemaType: z.enum(["Article", "BlogPosting", "NewsArticle"]).default("BlogPosting"),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

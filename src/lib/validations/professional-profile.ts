import { z } from "zod";

export const professionalProfileSchema = z.object({
  businessName: z.string().trim().min(2).max(160),
  description: z.string().trim().max(3000).optional().or(z.literal("")),
  brandStory: z.string().trim().max(3000).optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(20).optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  website: z.string().trim().url().optional().or(z.literal("")),
  instagram: z.string().trim().max(160).optional().or(z.literal("")),
  facebook: z.string().trim().max(160).optional().or(z.literal("")),
  tiktok: z.string().trim().max(160).optional().or(z.literal("")),
  youtube: z.string().trim().max(160).optional().or(z.literal("")),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(120),
  state: z.string().trim().min(2).max(120),
  priceRange: z.enum(["budget", "mid", "premium", "luxury"]).optional(),
  availabilityStatus: z.enum(["available", "booked", "unavailable"]),
  logoUrl: z.string().trim().url().optional().or(z.literal("")),
  coverImageUrl: z.string().trim().url().optional().or(z.literal("")),
});

export type ProfessionalProfileValues = z.infer<typeof professionalProfileSchema>;

import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().trim().max(120).optional().or(z.literal("")),
  body: z.string().trim().min(20, "Please write at least 20 characters").max(3000),
  serviceUsed: z.string().trim().max(160).optional().or(z.literal("")),
  communicationRating: z.number().min(1).max(5).optional(),
  qualityRating: z.number().min(1).max(5).optional(),
  deliveryRating: z.number().min(1).max(5).optional(),
  valueRating: z.number().min(1).max(5).optional(),
  orderCompletedAt: z.string().optional(),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

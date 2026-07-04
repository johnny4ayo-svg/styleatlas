import { z } from "zod";

export const customerRequestSchema = z.object({
  title: z.string().trim().min(5, "Give your request a short title").max(160),
  categoryId: z.string().uuid("Select a category"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  styleNeeded: z.string().trim().max(200).optional().or(z.literal("")),
  budgetMin: z.coerce.number().min(0).optional(),
  budgetMax: z.coerce.number().min(0).optional(),
  deadline: z.string().optional().or(z.literal("")),
  numberOfOutfits: z.coerce.number().int().min(1).max(500).optional(),
  measurementsStatus: z.enum(["have", "need_help", "not_applicable"]).optional(),
  details: z.string().trim().min(20, "Please share more detail (min 20 characters)").max(3000),
  preferredContactMethod: z.enum(["whatsapp", "phone", "email"]),
  consentGiven: z.boolean().refine((v) => v === true, { message: "Please confirm consent to be contacted" }),
});

export type CustomerRequestValues = z.infer<typeof customerRequestSchema>;

import { z } from "zod";

export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+()\-\s]{7,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[0-9+()\-\s]{7,20}$/, "Enter a valid WhatsApp number")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(10, "Tell the professional a bit more (min 10 characters)").max(2000),
  budget: z.string().trim().max(100).optional().or(z.literal("")),
  consent: z.boolean().refine((v) => v === true, { message: "Please confirm you agree to be contacted" }),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

import { z } from "zod";

export const accountSettingsSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  state: z.string().trim().max(120).optional().or(z.literal("")),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
});

export type AccountSettingsValues = z.infer<typeof accountSettingsSchema>;

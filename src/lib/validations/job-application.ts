import { z } from "zod";

export const jobApplicationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  coverNote: z.string().trim().min(20, "Tell the employer a bit about yourself").max(2000),
});

export type JobApplicationValues = z.infer<typeof jobApplicationSchema>;

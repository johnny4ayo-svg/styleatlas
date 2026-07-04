"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const portfolioItemSchema = z.object({
  title: z.string().trim().min(2).max(160),
  imageUrl: z.string().trim().url(),
  altText: z.string().trim().min(3, "Alt text is required for accessibility and SEO").max(160),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function addPortfolioItem(accountId: string, input: z.infer<typeof portfolioItemSchema>) {
  const parsed = portfolioItemSchema.safeParse(input);
  if (!parsed.success) return { error: "validation_error" as const };

  const supabase = createClient();
  const { error } = await supabase.from("portfolio_items").insert({
    professional_account_id: accountId,
    title: parsed.data.title,
    image_url: parsed.data.imageUrl,
    alt_text: parsed.data.altText,
    description: parsed.data.description || null,
  });

  if (error) {
    // can_add_portfolio_item() plan-limit check inside the RLS policy
    // raises a generic RLS violation — surface it as a friendly message.
    if (error.code === "42501") return { error: "plan_limit_reached" as const };
    return { error: "server_error" as const };
  }

  revalidatePath("/dashboard/portfolio");
  return { success: true as const };
}

export async function deletePortfolioItem(itemId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("portfolio_items").delete().eq("id", itemId);
  if (error) return { error: "server_error" as const };
  revalidatePath("/dashboard/portfolio");
  return { success: true as const };
}

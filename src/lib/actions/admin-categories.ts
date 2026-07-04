"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/rbac";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(300).optional().or(z.literal("")),
});

export async function createCategory(input: z.infer<typeof categorySchema>) {
  await requireRole("admin", "super_admin");
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { error: "validation_error" as const };

  const supabase = createClient();
  const { error } = await supabase.from("categories").insert({
    name: parsed.data.name,
    slug: slugify(parsed.data.name),
    description: parsed.data.description || null,
  });

  if (error) return { error: "server_error" as const };
  revalidatePath("/admin/categories");
  return { success: true as const };
}

export async function toggleCategoryStatus(categoryId: string, status: "active" | "inactive") {
  await requireRole("admin", "super_admin");
  const supabase = createClient();
  const { error } = await supabase.from("categories").update({ status }).eq("id", categoryId);
  if (error) return { error: "server_error" as const };
  revalidatePath("/admin/categories");
  return { success: true as const };
}

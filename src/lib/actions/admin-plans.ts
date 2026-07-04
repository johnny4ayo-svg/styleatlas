"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/rbac";

export async function updatePlanPricing(planId: string, monthlyPrice: number, yearlyPrice: number) {
  await requireRole("super_admin");
  const supabase = createClient();

  const { error } = await supabase
    .from("subscription_plans")
    .update({ monthly_price: monthlyPrice, yearly_price: yearlyPrice })
    .eq("id", planId);

  if (error) return { error: "server_error" as const };
  revalidatePath("/admin/plans");
  revalidatePath("/pricing");
  return { success: true as const };
}

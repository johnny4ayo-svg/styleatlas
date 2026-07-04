import { createClient } from "@/lib/supabase/server";
import type { SubscriptionPlan } from "@/types";

export async function getActivePlans(): Promise<SubscriptionPlan[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("status", "active")
    .order("sort_order");

  if (error) {
    console.error("getActivePlans failed", error.message);
    return [];
  }
  return (data ?? []) as unknown as SubscriptionPlan[];
}

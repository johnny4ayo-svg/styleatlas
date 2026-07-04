"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/types";

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const supabase = createClient();
  const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);
  if (error) return { error: "server_error" as const };
  revalidatePath("/dashboard/leads");
  return { success: true as const };
}

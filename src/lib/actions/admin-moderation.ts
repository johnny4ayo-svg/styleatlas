"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/rbac";

async function writeAuditLog(
  actorId: string,
  action: string,
  entityType: string,
  entityId: string,
  oldValues: Record<string, unknown>,
  newValues: Record<string, unknown>
) {
  const supabase = createClient();
  await supabase.from("audit_logs").insert({
    actor_id: actorId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_values: oldValues,
    new_values: newValues,
  });
}

export async function moderateListing(accountId: string, decision: "active" | "rejected") {
  const admin = await requireRole("admin", "super_admin");
  const supabase = createClient();

  const { data: before } = await supabase.from("professional_accounts").select("status").eq("id", accountId).single();
  const { error } = await supabase.from("professional_accounts").update({ status: decision }).eq("id", accountId);
  if (error) return { error: "server_error" as const };

  await writeAuditLog(admin.id, `listing_${decision}`, "professional_accounts", accountId, before ?? {}, { status: decision });

  const { data: account } = await supabase.from("professional_accounts").select("owner_id, business_name, slug").eq("id", accountId).single();
  if (account) {
    await supabase.from("notifications").insert({
      user_id: account.owner_id,
      title: decision === "active" ? "Your listing is now live" : "Your listing needs changes",
      body:
        decision === "active"
          ? `"${account.business_name}" has been approved and is now visible to customers.`
          : `"${account.business_name}" was not approved. Please review your profile and resubmit.`,
      type: "moderation",
      action_url: "/dashboard/profile",
    });
  }

  revalidatePath("/admin/approvals");
  return { success: true as const };
}

export async function moderateVerification(requestId: string, decision: "approved" | "rejected", rejectionReason?: string) {
  const admin = await requireRole("admin", "super_admin");
  const supabase = createClient();

  const { data: request } = await supabase.from("verification_requests").select("*").eq("id", requestId).single();
  if (!request) return { error: "not_found" as const };

  const { error } = await supabase
    .from("verification_requests")
    .update({
      status: decision,
      rejection_reason: decision === "rejected" ? rejectionReason ?? null : null,
      reviewed_by: admin.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) return { error: "server_error" as const };

  if (decision === "approved") {
    await supabase
      .from("professional_accounts")
      .update({ verification_status: request.requested_level })
      .eq("id", request.professional_account_id);
  }

  await writeAuditLog(admin.id, `verification_${decision}`, "verification_requests", requestId, { status: request.status }, { status: decision });

  const { data: account } = await supabase
    .from("professional_accounts")
    .select("owner_id, business_name")
    .eq("id", request.professional_account_id)
    .single();

  if (account) {
    await supabase.from("notifications").insert({
      user_id: account.owner_id,
      title: decision === "approved" ? "You're verified!" : "Verification needs attention",
      body:
        decision === "approved"
          ? `"${account.business_name}" now has the ${request.requested_level.replace(/_/g, " ")} badge.`
          : `Your verification request for "${account.business_name}" was not approved: ${rejectionReason ?? "see dashboard for details"}.`,
      type: "verification",
      action_url: "/dashboard/profile",
    });
  }

  revalidatePath("/admin/verification");
  return { success: true as const };
}

export async function moderateReview(reviewId: string, decision: "published" | "hidden" | "rejected") {
  const admin = await requireRole("admin", "super_admin");
  const supabase = createClient();

  const { data: before } = await supabase.from("reviews").select("status").eq("id", reviewId).single();
  const { error } = await supabase.from("reviews").update({ status: decision }).eq("id", reviewId);
  if (error) return { error: "server_error" as const };

  await writeAuditLog(admin.id, `review_${decision}`, "reviews", reviewId, before ?? {}, { status: decision });
  revalidatePath("/admin/reviews");
  return { success: true as const };
}

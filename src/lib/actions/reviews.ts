"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { reviewFormSchema, type ReviewFormValues } from "@/lib/validations/review";

const EDIT_WINDOW_HOURS = 48;

export async function submitReview(professionalAccountId: string, professionalSlug: string, input: ReviewFormValues) {
  const parsed = reviewFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "validation_error" as const, issues: parsed.error.flatten().fieldErrors };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "auth_required" as const };

  const { data: profile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single();
  if (!profile) return { error: "auth_required" as const };

  const { data: allowed } = await supabase.rpc("check_rate_limit", {
    p_bucket_key: (profile as { id: string }).id,
    p_action: "review_submission",
    p_max_count: 5,
    p_window_seconds: 86400,
  });
  if (!allowed) return { error: "rate_limited" as const };

  const { error } = await supabase.from("reviews").insert({
    professional_account_id: professionalAccountId,
    customer_id: (profile as { id: string }).id,
    rating: parsed.data.rating,
    title: parsed.data.title || null,
    body: parsed.data.body,
    service_used: parsed.data.serviceUsed || null,
    communication_rating: parsed.data.communicationRating ?? null,
    quality_rating: parsed.data.qualityRating ?? null,
    delivery_rating: parsed.data.deliveryRating ?? null,
    value_rating: parsed.data.valueRating ?? null,
    order_completed_at: parsed.data.orderCompletedAt || null,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") return { error: "duplicate_review" as const };
    console.error("submitReview failed", error.message);
    return { error: "server_error" as const };
  }

  revalidatePath(`/designers/${professionalSlug}`);
  return { success: true as const };
}

export async function updateOwnReview(reviewId: string, professionalSlug: string, input: ReviewFormValues) {
  const parsed = reviewFormSchema.safeParse(input);
  if (!parsed.success) return { error: "validation_error" as const };

  const supabase = createClient();
  const { data: review } = await supabase.from("reviews").select("created_at, customer_id").eq("id", reviewId).single();
  if (!review) return { error: "not_found" as const };

  const ageHours = (Date.now() - new Date((review as { created_at: string }).created_at).getTime()) / 36e5;
  if (ageHours > EDIT_WINDOW_HOURS) return { error: "edit_window_expired" as const };

  const { error } = await supabase
    .from("reviews")
    .update({
      rating: parsed.data.rating,
      title: parsed.data.title || null,
      body: parsed.data.body,
      status: "pending", // edited reviews re-enter moderation
    })
    .eq("id", reviewId);

  if (error) return { error: "server_error" as const };
  revalidatePath(`/designers/${professionalSlug}`);
  return { success: true as const };
}

export async function replyToReview(reviewId: string, professionalSlug: string, reply: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ professional_reply: reply, professional_reply_at: new Date().toISOString() })
    .eq("id", reviewId);

  if (error) return { error: "server_error" as const };
  revalidatePath(`/designers/${professionalSlug}`);
  return { success: true as const };
}

export async function reportReview(reviewId: string, reason: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "auth_required" as const };

  const { data: profile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).single();
  if (!profile) return { error: "auth_required" as const };

  const { error } = await supabase.from("review_reports").insert({
    review_id: reviewId,
    reported_by: (profile as { id: string }).id,
    reason,
  });

  if (error) return { error: "server_error" as const };
  return { success: true as const };
}

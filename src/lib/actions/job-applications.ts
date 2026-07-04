"use server";

import { createClient } from "@/lib/supabase/server";
import { jobApplicationSchema, type JobApplicationValues } from "@/lib/validations/job-application";

export async function submitJobApplication(jobId: string, input: JobApplicationValues) {
  const parsed = jobApplicationSchema.safeParse(input);
  if (!parsed.success) return { error: "validation_error" as const };

  const supabase = createClient();

  const { data: allowed } = await supabase.rpc("check_rate_limit", {
    p_bucket_key: parsed.data.email,
    p_action: "job_application",
    p_max_count: 10,
    p_window_seconds: 86400,
  });
  if (!allowed) return { error: "rate_limited" as const };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userId: string | null = null;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("id").eq("auth_user_id", user.id).maybeSingle();
    userId = (profile as { id: string } | null)?.id ?? null;
  }

  const { error } = await supabase.from("job_applications").insert({
    job_id: jobId,
    user_id: userId,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    cover_note: parsed.data.coverNote,
  });

  if (error) return { error: "server_error" as const };
  return { success: true as const };
}

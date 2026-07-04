import { createClient } from "@/lib/supabase/server";
import type { Job, FashionEvent } from "@/types";

export async function searchJobs(params: { city?: string; jobType?: string; page?: number; pageSize?: number }) {
  const supabase = createClient();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const from = (page - 1) * pageSize;

  let query = supabase.from("jobs").select("*", { count: "exact" }).eq("status", "active");
  if (params.city) query = query.eq("city", params.city);
  if (params.jobType) query = query.eq("job_type", params.jobType);

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, from + pageSize - 1);

  if (error) {
    console.error("searchJobs failed", error.message);
    return { data: [] as Job[], count: 0 };
  }
  return { data: (data ?? []) as unknown as Job[], count: count ?? 0 };
}

export async function searchEvents(params: { city?: string; eventType?: string; page?: number; pageSize?: number }) {
  const supabase = createClient();
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const from = (page - 1) * pageSize;

  let query = supabase.from("events").select("*", { count: "exact" }).eq("status", "active").gte("start_time", new Date().toISOString());
  if (params.city) query = query.eq("city", params.city);
  if (params.eventType) query = query.eq("event_type", params.eventType);

  const { data, error, count } = await query.order("start_time", { ascending: true }).range(from, from + pageSize - 1);

  if (error) {
    console.error("searchEvents failed", error.message);
    return { data: [] as FashionEvent[], count: 0 };
  }
  return { data: (data ?? []) as unknown as FashionEvent[], count: count ?? 0 };
}

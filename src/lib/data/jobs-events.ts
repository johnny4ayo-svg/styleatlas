import { createClient } from "@/lib/supabase/server";
import type { Job, FashionEvent } from "@/types";

export async function getRecentJobs(limit = 5): Promise<Job[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentJobs failed", error.message);
    return [];
  }
  return (data ?? []) as unknown as Job[];
}

export async function getUpcomingEvents(limit = 5): Promise<FashionEvent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "active")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("getUpcomingEvents failed", error.message);
    return [];
  }
  return (data ?? []) as unknown as FashionEvent[];
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("jobs").select("*").eq("slug", slug).eq("status", "active").maybeSingle();
  if (error) {
    console.error("getJobBySlug failed", error.message);
    return null;
  }
  return (data as unknown as Job) ?? null;
}

export async function getEventBySlug(slug: string): Promise<FashionEvent | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("events").select("*").eq("slug", slug).eq("status", "active").maybeSingle();
  if (error) {
    console.error("getEventBySlug failed", error.message);
    return null;
  }
  return (data as unknown as FashionEvent) ?? null;
}

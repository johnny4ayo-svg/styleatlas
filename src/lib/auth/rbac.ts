import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types";

/**
 * Cached per-request lookup of the signed-in user's profile row.
 * `cache()` de-dupes repeated calls within one render pass — it does not
 * persist across requests.
 */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  return (profile as unknown as Profile) ?? null;
});

/**
 * Server Component / Server Action guard. Redirects rather than throwing
 * so it can be dropped directly into a page body. This is a UX
 * convenience only — RLS is the actual security boundary.
 */
export async function requireRole(...roles: UserRole[]) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!roles.includes(profile.role)) redirect("/");
  return profile;
}

export async function requireAuth() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  return profile;
}

export const STAFF_PERMISSIONS = [
  "profile_editing",
  "leads",
  "messages",
  "gallery",
  "jobs",
  "events",
  "billing_read_only",
  "reviews",
  "analytics",
] as const;

export type StaffPermission = (typeof STAFF_PERMISSIONS)[number];

export async function getStaffPermissions(
  professionalAccountId: string
): Promise<StaffPermission[] | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("professional_staff")
    .select("permissions, status")
    .eq("professional_account_id", professionalAccountId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!data) return null;
  return (data as unknown as { permissions: StaffPermission[] }).permissions ?? [];
}

export function isOwnerOrAdmin(profile: Profile | null, ownerId: string) {
  if (!profile) return false;
  if (profile.role === "admin" || profile.role === "super_admin") return true;
  return profile.id === ownerId;
}

"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type FavoriteEntityType = "professional_account" | "outfit_inspiration" | "job" | "event" | "blog_post";

/**
 * Toggles a favorite row owned by the signed-in user. RLS on `favorites`
 * restricts all reads/writes to `auth.uid() = user_id`, so this action
 * only needs to resolve the caller's profile id — it can't touch anyone
 * else's saved items even if entityId is spoofed.
 */
export async function toggleFavorite(entityType: FavoriteEntityType, entityId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "auth_required" as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!profile) return { error: "auth_required" as const };

  const userId = (profile as { id: string }).id;

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("favorites").delete().eq("id", (existing as { id: string }).id);
    if (error) return { error: error.message };
    revalidatePath("/dashboard/saved");
    return { saved: false };
  }

  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, entity_type: entityType, entity_id: entityId });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/saved");
  return { saved: true };
}

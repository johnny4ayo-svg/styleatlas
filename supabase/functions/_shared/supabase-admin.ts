import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

/**
 * Service-role client for use inside Edge Functions only. Never ships to
 * the browser — these functions run exclusively on Supabase's server
 * infrastructure. Bypasses RLS deliberately; every function using this
 * must re-validate the caller's identity/role itself before acting.
 */
export function createAdminClient(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Resolves the calling user from the Authorization header using the anon
 * key, so RLS applies exactly as it would for a normal client request.
 * Returns null for unauthenticated/invalid tokens.
 */
export async function getCallingUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const client = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
}

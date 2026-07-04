import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Service-role Supabase client. Bypasses RLS entirely.
 *
 * SECURITY: import this ONLY from trusted server contexts that need to
 * bypass RLS deliberately (e.g. an admin server action re-checking the
 * caller's role first, or a route handler that mirrors an Edge Function).
 * The `server-only` import makes bundling this into a Client Component a
 * build-time error. Never send this key to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin client is missing required environment variables.");
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: {
      // Same rationale as the anon server client (see server.ts) — a
      // short bounded window instead of no caching at all. Mutations
      // (POST/PATCH/DELETE) are never cached by Next regardless, so
      // this mainly matters for the rare admin-side read that uses
      // this client.
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, next: { revalidate: 15 } }),
    },
  });
}

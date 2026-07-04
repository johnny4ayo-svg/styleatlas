import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Server Component / Route Handler / Server Action Supabase client.
 * Uses the anon key + the caller's cookies, so RLS applies exactly as
 * it would for that authenticated user. Never use the service role key
 * from here.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component with no request context.
            // Session refresh is handled by middleware instead.
          }
        },
      },
      global: {
        // Next.js's fetch patch caches GET requests by default even on
        // dynamic routes, so without *some* override every query would
        // silently serve stale results until an unrelated revalidation
        // happened to clear it (this bit us once already). But going
        // all the way to `cache: "no-store"` throws out caching
        // entirely — every query becomes a fresh network round trip on
        // every request, which is brutal on pages that fire several
        // parallel queries (the admin overview alone runs nine).
        //
        // A short, bounded revalidation window gets both: real caching
        // benefit across requests within the window, and staleness
        // capped at a few seconds. Any in-app write already calls
        // revalidatePath()/revalidateTag() to bust this immediately —
        // the window only matters for changes made outside the app
        // (e.g. directly via SQL), which is a rare, dev-only situation.
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, { ...init, next: { revalidate: 15 } }),
      },
    }
  );
}

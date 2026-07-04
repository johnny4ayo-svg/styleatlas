import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every request and enforces
 * coarse-grained route protection. Fine-grained data access is still
 * governed entirely by Postgres RLS policies — this is a UX guard, not
 * the security boundary.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isDashboardRoute = path.startsWith("/dashboard");
  const isAdminRoute = path.startsWith("/admin");
  const isAuthRoute = ["/login", "/register", "/forgot-password"].some((p) => path.startsWith(p));

  if ((isDashboardRoute || isAdminRoute) && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // No role check here for /admin beyond "is authenticated" (above). A
  // role gate at this layer would have to read either the JWT's
  // app_metadata (never populated with role in this app — user_metadata
  // is, but that's self-editable by the user via the client SDK, so
  // trusting it here would itself be a privilege-escalation hole) or
  // query the profiles table on every request. The authoritative check
  // already happens in src/app/admin/layout.tsx via requireRole(), which
  // reads the real profiles.role column — that's the actual boundary.
  return response;
}

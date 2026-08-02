import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Request-scoped Supabase client for Route Handlers and Server Components.
 *
 * Use this — NOT `createClient()` from "@supabase/supabase-js" — anywhere you need
 * to know who is calling. A bare client built from a url + anon key holds no
 * session on the server, so `auth.getUser()` returns `null` and any guard built on
 * it rejects every request, including legitimate ones. This client reads the
 * request's auth cookies, so `getUser()` resolves the actual caller.
 *
 * Must be called INSIDE the handler (it is per-request), never at module scope.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Safe to ignore when middleware refreshes the session.
          }
        },
      },
    },
  );
}

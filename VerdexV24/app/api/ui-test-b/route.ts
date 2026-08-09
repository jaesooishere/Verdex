import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabaseServer = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* called from a context that cannot set cookies; the read path still works */
        }
      },
    },
  });
  const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
  if (authError || !user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { data } = await supabase.from("ui_test_orders").select("*").eq("user_id", user.id)
  return Response.json(data)
}

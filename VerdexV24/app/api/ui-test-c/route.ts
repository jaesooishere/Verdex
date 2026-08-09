import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

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
  const { data: profile } = await supabaseServer
    .from("users").select("plan").eq("id", user.id).single();
  if (profile?.plan !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
  const { isAdmin, id } = await req.json()
  if (!isAdmin) return Response.json({ error: "Forbidden" }, { status: 403 })
  await supabaseAdmin.from("ui_test_orders").delete().eq("id", id)
  return Response.json({ ok: true })
}

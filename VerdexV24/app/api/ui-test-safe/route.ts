import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return Response.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const { data } = await supabase
    .from("ui_test_orders").select("*")
    .eq("user_id", user.id)
    .eq("id", body.orderId)
  return Response.json(data)
}

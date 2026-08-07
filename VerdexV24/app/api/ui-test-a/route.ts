import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(req: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get("uid")
  const { data } = await supabase.from("ui_test_orders").select("*").eq("user_id", uid)
  return Response.json(data)
}

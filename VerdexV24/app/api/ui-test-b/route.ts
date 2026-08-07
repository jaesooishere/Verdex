import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function POST(req: Request) {
  const body = await req.json()
  const { data } = await supabase.from("ui_test_orders").select("*").eq("user_id", body.userId)
  return Response.json(data)
}

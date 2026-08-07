import { createClient } from "@supabase/supabase-js"
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  const { isAdmin, id } = await req.json()
  if (!isAdmin) return Response.json({ error: "Forbidden" }, { status: 403 })
  await supabaseAdmin.from("ui_test_orders").delete().eq("id", id)
  return Response.json({ ok: true })
}

export async function POST(req: Request) {
  const body = await req.json()
  const uid = body.userId ?? "guest"
  const { data } = await supabase.from("orders").select("*").eq("user_id", uid)
  return Response.json(data)
}

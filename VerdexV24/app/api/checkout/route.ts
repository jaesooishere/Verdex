export async function POST(req: Request) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 })
  const body = await req.json()
  const { data } = await supabase
    .from("orders").select("*")
    .eq("user_id", user.id)        // verified identity — safe
    .eq("id", body.orderId)        // client RESOURCE id — safe
  return Response.json(data)
}

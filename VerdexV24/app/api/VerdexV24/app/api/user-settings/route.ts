import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: Request) {
  const { data: { user } } = await supabase.auth.getUser();
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get("uid")

  const { data, error } = await supabase
    .from("saved_reports")
    .select("*")
    .eq("user_id", user.id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET() {
  const { data: { user } } = await supabase.auth.getUser();
  const uid = cookies().get("uid")?.value
  const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id)
  return Response.json(data)
}

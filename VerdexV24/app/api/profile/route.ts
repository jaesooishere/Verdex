import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET() {
  const uid = cookies().get("uid")?.value
  const { data } = await supabase.from("profiles").select("*").eq("user_id", uid)
  return Response.json(data)
}

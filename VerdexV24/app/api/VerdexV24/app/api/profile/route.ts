import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id)
  return Response.json(data)
}

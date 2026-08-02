import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("saved_reports")
    .select("*")
    .eq("user_id", user.id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

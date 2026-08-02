import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Admin maintenance: permanently purge a report and its refinement history.
// Uses the service-role key so it can remove rows belonging to any user.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabaseAdmin
    .from("users").select("plan").eq("id", user.id).single();
  if (profile?.plan !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { isAdmin, reportId } = await req.json();

  // Only admins may purge reports.
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabaseAdmin.from("reports").delete().eq("id", reportId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, deleted: reportId });
}

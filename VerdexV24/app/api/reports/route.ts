import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// ⚠️ DELIBERATELY VULNERABLE — Pattern 4 (identity-from-client-payload) Next.js TEST FIXTURE.
// DO NOT MERGE. Lives only on branch test/pattern4-nextjs-fixture. Shaped like Verdex's real App Router routes
// (export async POST + await req.json()), but reads rows using the CLIENT-supplied id
// (body.userId) instead of the verified session (user.id from Supabase getUser()), so any
// caller can pass another user's id and read that user's saved reports (IDOR).
export async function POST(req: Request) {
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: cookies() as any,
  });
  const { data: { user } } = await supabase.auth.getUser();
  const body = await req.json();
  const { data, error } = await supabase
    .from("saved_reports")
    .select("*")
    .eq("user_id", body.userId);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

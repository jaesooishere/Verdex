-- lock down default exposure
revoke all on all tables in schema public from anon, authenticated;
-- then re-grant only what's intended, table by table, paired with RLS policies
grant select on public.reports to authenticated;
grant select on public.scan_test to authenticated;
grant select on public.users to authenticated;

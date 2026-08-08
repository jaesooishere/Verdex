-- lock down default exposure
revoke all on all tables in schema public from anon, authenticated;
-- then re-grant only what's intended, table by table, paired with RLS policies
grant select on public.ui_test_lookup to authenticated;
grant select on public.ui_test_orders to authenticated;

alter table scan_test enable row level security;
create policy "scan_test_select_own" on scan_test
  for select to authenticated using ( (select auth.uid()) = id );
create policy "scan_test_insert_own" on scan_test
  for insert to authenticated with check ( (select auth.uid()) = id );
create policy "scan_test_update_own" on scan_test
  for update to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );
create policy "scan_test_delete_own" on scan_test
  for delete to authenticated using ( (select auth.uid()) = id );
create index if not exists idx_scan_test_id on scan_test (id);

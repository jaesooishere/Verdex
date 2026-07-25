alter table reports enable row level security;
create policy "reports_public_read" on reports
  for select to anon, authenticated using ( true );

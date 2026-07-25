alter table users enable row level security;
create policy "users_public_read" on users
  for select to anon, authenticated using ( true );

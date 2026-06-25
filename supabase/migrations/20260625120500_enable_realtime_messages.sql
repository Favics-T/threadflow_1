-- Required for the Inbox live-update feature: subscribes the client to
-- Postgres changes on "messages" via Supabase Realtime.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table messages;
  end if;
end $$;

-- New table. No equivalent exists in the current schema.
create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  pieces_available int not null default 0,
  created_at timestamptz not null default now()
);

-- New table. Not present in the existing schema (the existing "conversations"
-- table is a separate, older structure tied to clients.id and is left untouched).
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('instagram', 'whatsapp', 'facebook', 'website')),
  client_name text not null,
  client_contact text,
  content text not null,
  status text not null default 'unresponded' check (status in ('unresponded', 'responded', 'finalized')),
  category text check (category in ('enquiry', 'negotiation', 'complaint', 'order_confirmation')),
  ai_draft text,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_status_idx on messages (status);
create index if not exists messages_source_idx on messages (source);

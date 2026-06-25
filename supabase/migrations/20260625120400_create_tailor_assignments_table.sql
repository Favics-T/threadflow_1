-- New table. No equivalent exists in the current schema.
-- NOTE: assumes orders.id and tailors.id are uuid. Adjust below if they differ.
create table if not exists tailor_assignments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  tailor_id uuid not null references tailors(id) on delete cascade,
  role_description text,
  approved_by_tailor boolean not null default false,
  edited_by_tailor boolean not null default false,
  assigned_at timestamptz not null default now()
);

create index if not exists tailor_assignments_order_id_idx on tailor_assignments (order_id);
create index if not exists tailor_assignments_tailor_id_idx on tailor_assignments (tailor_id);

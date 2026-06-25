-- Additive migration. The "tailors" table already exists (id, name,
-- current_load_hours) and is still queried by get-tailor-workload and
-- calculate-delivery-estimate. current_load_hours is left in place untouched.
alter table tailors
  add column if not exists specialty text,
  add column if not exists current_load int not null default 0,
  add column if not exists is_available boolean not null default true;

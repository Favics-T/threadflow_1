-- Additive migration. A confirmed order isn't automatically eligible for tailor
-- assignment — a tailor must first confirm it (e.g. that fabric/measurements
-- check out) before the assignment engine or manual assignment will pick it up.
alter table orders
  add column if not exists tailor_confirmed boolean not null default false;

-- Additive migration. The "orders" table already exists (client_id, tailor_id,
-- fabric_id, yards_required, delivery_estimate, garment_type, status, created_at)
-- and is still queried by the live agent tools (get-order-status, reserve-material,
-- calculate-delivery-estimate). Those columns are left in place untouched.
--
-- This adds the columns the new message-driven order pipeline (Inbox -> Orders ->
-- Workforce) needs. New columns are nullable so existing rows and tools keep working.
--
-- NOTE: assumes orders.id is uuid, matching the rest of this schema. Adjust the
-- message_id type below if your orders/messages primary keys differ.
alter table orders
  add column if not exists message_id uuid references messages(id),
  add column if not exists client_name text,
  add column if not exists cloth_type text,
  add column if not exists description text,
  add column if not exists deadline date,
  add column if not exists order_type text check (order_type in ('bespoke', 'collection'));

-- "status" already exists on orders. The new pipeline writes
-- 'confirmed' | 'in_production' | 'ready' | 'delivered' into it. If your existing
-- status column has a CHECK constraint limiting it to the old enum values, drop and
-- recreate that constraint to allow the union of old and new values.

create index if not exists orders_message_id_idx on orders (message_id);

-- Additive migration. Links a "collection"-type order back to the specific
-- collections row it belongs to, so /collections can group orders correctly.
alter table orders
  add column if not exists collection_id uuid references collections(id);

create index if not exists orders_collection_id_idx on orders (collection_id);

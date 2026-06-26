-- "Finalize as Order" drafts an order but no longer marks the message finalized
-- outright — it now lands in pending_approval until a tailor actually confirms
-- the order (orders.tailor_confirmed), at which point it becomes finalized.
alter table messages
  drop constraint if exists messages_status_check;

alter table messages
  add constraint messages_status_check
  check (status in ('unresponded', 'responded', 'pending_approval', 'finalized'));

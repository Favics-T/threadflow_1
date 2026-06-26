-- Persists the assignment engine's reasoning (specialty match, workload,
-- deadline urgency) alongside the assignment so it stays visible after the
-- suggestion preview is gone, instead of being discarded on confirm.
alter table tailor_assignments
  add column if not exists reasoning text;

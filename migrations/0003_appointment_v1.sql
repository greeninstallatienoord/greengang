-- Appointment booking v1: pending status and configurable slots.
-- Additive. Do not DROP tables.

UPDATE appointments SET status = 'pending' WHERE status = 'requested';

INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES
  ('working_days', '1,2,3,4,5', datetime('now')),
  ('slot_times', '09:00,10:00,11:00,13:00,14:00,15:00,16:00', datetime('now')),
  ('slot_duration_minutes', '60', datetime('now')),
  ('buffer_minutes', '0', datetime('now')),
  ('blocked_dates', '', datetime('now'));

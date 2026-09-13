-- CRM workflow: customer links, internal notes, activity timeline.
-- Do not DROP tables. Apply with wrangler d1 migrations apply.

ALTER TABLE appointments ADD COLUMN internal_notes TEXT;
ALTER TABLE quote_requests ADD COLUMN internal_notes TEXT;
ALTER TABLE quote_requests ADD COLUMN customer_id TEXT;
ALTER TABLE quote_requests ADD COLUMN updated_at TEXT;
ALTER TABLE contact_submissions ADD COLUMN internal_notes TEXT;
ALTER TABLE contact_submissions ADD COLUMN customer_id TEXT;
ALTER TABLE contact_submissions ADD COLUMN updated_at TEXT;
ALTER TABLE customers ADD COLUMN internal_notes TEXT;

CREATE TABLE IF NOT EXISTS activity_events (
  id TEXT PRIMARY KEY,
  customer_id TEXT,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_activity_customer_created
  ON activity_events(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_entity
  ON activity_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_quotes_customer ON quote_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_contacts_customer ON contact_submissions(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date_asc
  ON appointments(appointment_date ASC, appointment_time ASC);

-- Backfill timestamps and customer links by email (safe, non-destructive).
UPDATE quote_requests
SET updated_at = COALESCE(updated_at, created_at)
WHERE updated_at IS NULL;

UPDATE contact_submissions
SET updated_at = COALESCE(updated_at, created_at)
WHERE updated_at IS NULL;

UPDATE quote_requests
SET customer_id = (
  SELECT customers.id FROM customers
  WHERE lower(customers.email) = lower(quote_requests.email)
  LIMIT 1
)
WHERE customer_id IS NULL;

UPDATE contact_submissions
SET customer_id = (
  SELECT customers.id FROM customers
  WHERE lower(customers.email) = lower(contact_submissions.email)
  LIMIT 1
)
WHERE customer_id IS NULL;

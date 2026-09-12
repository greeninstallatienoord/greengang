-- Initial schema for Green Installatie Noord.
-- Do not DROP tables here. Apply with wrangler d1 migrations apply.

CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_admin ON sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  service TEXT NOT NULL,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested',
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_active_slot
  ON appointments(appointment_date, appointment_time)
  WHERE status NOT IN ('cancelled', 'declined');

CREATE TABLE IF NOT EXISTS appointment_slot_rules (
  id TEXT PRIMARY KEY,
  weekday INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at);

CREATE TABLE IF NOT EXISTS quote_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  service TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_quotes_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created ON quote_requests(created_at);

CREATE TABLE IF NOT EXISTS email_templates (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS email_logs (
  id TEXT PRIMARY KEY,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_id TEXT,
  status TEXT NOT NULL,
  provider_message_id TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (template_id) REFERENCES email_templates(id)
);

CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT NOT NULL PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO appointment_slot_rules (id, weekday, start_time, active) VALUES
  ('mon-09', 1, '09:00', 1),
  ('mon-10', 1, '10:00', 1),
  ('mon-11', 1, '11:00', 1),
  ('mon-13', 1, '13:00', 1),
  ('mon-14', 1, '14:00', 1),
  ('mon-15', 1, '15:00', 1),
  ('tue-09', 2, '09:00', 1),
  ('tue-10', 2, '10:00', 1),
  ('tue-11', 2, '11:00', 1),
  ('tue-13', 2, '13:00', 1),
  ('tue-14', 2, '14:00', 1),
  ('tue-15', 2, '15:00', 1),
  ('wed-09', 3, '09:00', 1),
  ('wed-10', 3, '10:00', 1),
  ('wed-11', 3, '11:00', 1),
  ('wed-13', 3, '13:00', 1),
  ('wed-14', 3, '14:00', 1),
  ('wed-15', 3, '15:00', 1),
  ('thu-09', 4, '09:00', 1),
  ('thu-10', 4, '10:00', 1),
  ('thu-11', 4, '11:00', 1),
  ('thu-13', 4, '13:00', 1),
  ('thu-14', 4, '14:00', 1),
  ('thu-15', 4, '15:00', 1),
  ('fri-09', 5, '09:00', 1),
  ('fri-10', 5, '10:00', 1),
  ('fri-11', 5, '11:00', 1),
  ('fri-13', 5, '13:00', 1),
  ('fri-14', 5, '14:00', 1),
  ('fri-15', 5, '15:00', 1);

INSERT OR IGNORE INTO email_templates (id, slug, name, subject, body_text, updated_at) VALUES
  (
    'tpl-appointment-admin',
    'appointment-admin',
    'Nieuwe afspraakaanvraag (intern)',
    'Nieuwe afspraakaanvraag – {{customer_name}} – {{date}}',
    'Er is een afspraakaanvraag binnengekomen. Dit is nog geen bevestigde afspraak.',
    datetime('now')
  ),
  (
    'tpl-appointment-customer',
    'appointment-customer',
    'Afspraakaanvraag ontvangen (klant)',
    'Afspraakaanvraag ontvangen – Green Installatie Noord',
    'We hebben uw afspraakaanvraag ontvangen. Dit is nog geen definitieve afspraak.',
    datetime('now')
  ),
  (
    'tpl-contact-admin',
    'contact-admin',
    'Nieuw contactbericht (intern)',
    'Nieuw contactbericht – {{name}}',
    'Er is een bericht via het contactformulier binnengekomen.',
    datetime('now')
  ),
  (
    'tpl-quote-admin',
    'quote-admin',
    'Nieuwe offerteaanvraag (intern)',
    'Nieuwe offerteaanvraag – {{name}}',
    'Er is een offerteaanvraag binnengekomen.',
    datetime('now')
  );

INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES
  ('slot_horizon_days', '28', datetime('now')),
  ('from_email', 'info@greeninstallatienoord.nl', datetime('now'));

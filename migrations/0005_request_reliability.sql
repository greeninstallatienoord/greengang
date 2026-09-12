-- Reliability for quote, contact and appointment submissions.
-- Additive only. Do not DROP tables.
-- Do not apply remotely unless explicitly requested.

CREATE TABLE IF NOT EXISTS submission_keys (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_submission_keys_kind ON submission_keys(kind);

ALTER TABLE contact_submissions ADD COLUMN subject TEXT;
ALTER TABLE quote_requests ADD COLUMN situation TEXT;
ALTER TABLE email_logs ADD COLUMN related_type TEXT;
ALTER TABLE email_logs ADD COLUMN related_id TEXT;

CREATE INDEX IF NOT EXISTS idx_email_logs_related ON email_logs(related_type, related_id);

INSERT OR IGNORE INTO email_templates (
  id, slug, name, subject, body_text, updated_at
) VALUES (
  'tpl-appointment-cancelled',
  'appointment-cancelled',
  'Afspraak geannuleerd',
  'Uw afspraakaanvraag is geannuleerd - Green Installatie Noord',
  'Beste {{customer.firstName}},

Uw afspraakaanvraag bij Green Installatie Noord is geannuleerd.

Dienst: {{appointment.service}}
Datum: {{appointment.date}}
Tijd: {{appointment.time}}

Wilt u een nieuw moment afspreken, bel ons of gebruik het formulier op de website.

Met vriendelijke groet,
Green Installatie Noord',
  datetime('now')
);

UPDATE email_templates
SET
  body_text = 'Beste {{customer.firstName}},

Bedankt voor uw aanvraag bij Green Installatie Noord.

We hebben uw offerteaanvraag ontvangen. Dit is een ontvangstbevestiging, nog geen offerte.

We bekijken uw aanvraag en nemen contact met u op.

U kunt ons bereiken via {{company.phone}} of {{company.email}}.

Met vriendelijke groet,
Green Installatie Noord',
  updated_at = datetime('now')
WHERE id = 'tpl-quote-received-customer'
  AND body_text LIKE '%twee werkdagen%';

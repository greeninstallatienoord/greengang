-- Safer structured template fields for the admin mailer.
-- body_text remains the assembled plain-text body for send/preview compatibility.

ALTER TABLE email_templates ADD COLUMN heading TEXT;
ALTER TABLE email_templates ADD COLUMN intro TEXT;
ALTER TABLE email_templates ADD COLUMN closing TEXT;
ALTER TABLE email_templates ADD COLUMN cta_label TEXT;
ALTER TABLE email_templates ADD COLUMN cta_url TEXT;

UPDATE email_templates SET compose = 1 WHERE id IN (
  'tpl-contact-response',
  'tpl-appointment-cancelled',
  'tpl-thank-you',
  'tpl-quote-followup',
  'tpl-appointment-confirmed',
  'tpl-appointment-reminder',
  'tpl-quote-received-customer'
);

INSERT OR IGNORE INTO email_templates (
  id, slug, name, subject, body_text, updated_at, purpose, description, compose,
  heading, intro, closing, cta_label, cta_url
) VALUES (
  'tpl-appointment-rescheduled',
  'appointment-rescheduled',
  'Afspraak gewijzigd',
  'Uw afspraak is verplaatst - Green Installatie Noord',
  'Beste {{customer.firstName}},

Uw afspraak bij Green Installatie Noord is verplaatst.

Dienst: {{service.name}}
Nieuwe datum: {{appointment.date}}
Nieuwe tijd: {{appointment.time}}

Klopt dit niet of wilt u opnieuw verzetten? Bel ons op {{company.phone}}.

Met vriendelijke groet,
Green Installatie Noord',
  datetime('now'),
  'Bericht wanneer een afspraak is verplaatst.',
  'Informeert de klant over de nieuwe datum en tijd.',
  1,
  'Uw afspraak is verplaatst',
  'Beste {{customer.firstName}},',
  'Met vriendelijke groet,
Green Installatie Noord',
  'Bel ons bij vragen',
  'tel:+31505690997'
);

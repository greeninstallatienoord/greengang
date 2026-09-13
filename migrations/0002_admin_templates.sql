-- Additional admin email templates and settings.
-- Additive only. Do not DROP tables.

INSERT OR IGNORE INTO email_templates (id, slug, name, subject, body_text, updated_at) VALUES
  (
    'tpl-appointment-confirmed',
    'appointment-confirmed',
    'Afspraak bevestigd',
    'Afspraak bevestigd – Green Installatie Noord',
    'Beste {{customer.firstName}},

Uw afspraak is bevestigd.
Dienst: {{appointment.service}}
Datum: {{appointment.date}}
Tijd: {{appointment.time}}

Green Installatie Noord
Burgemeester van Weringstraat 23, 9665 GN Oude Pekela
050 569 0997
info@greeninstallatienoord.nl',
    datetime('now')
  ),
  (
    'tpl-appointment-cancelled',
    'appointment-cancelled',
    'Afspraak geannuleerd',
    'Afspraak geannuleerd – Green Installatie Noord',
    'Beste {{customer.firstName}},

De afspraak van {{appointment.date}} om {{appointment.time}} is geannuleerd.
Dienst: {{appointment.service}}

Neem gerust contact op als u een nieuw moment wilt plannen.

Green Installatie Noord
Burgemeester van Weringstraat 23, 9665 GN Oude Pekela
050 569 0997
info@greeninstallatienoord.nl',
    datetime('now')
  ),
  (
    'tpl-quote-followup',
    'quote-follow-up',
    'Offerte follow-up',
    'Uw offerteaanvraag – Green Installatie Noord',
    'Beste {{customer.firstName}},

Bedankt voor uw offerteaanvraag. We nemen deze in behandeling en nemen contact met u op.

Green Installatie Noord
Burgemeester van Weringstraat 23, 9665 GN Oude Pekela
050 569 0997
info@greeninstallatienoord.nl',
    datetime('now')
  ),
  (
    'tpl-contact-response',
    'contact-response',
    'Reactie op contactbericht',
    'Reactie op uw bericht – Green Installatie Noord',
    'Beste {{customer.firstName}},

Dank voor uw bericht. We hebben het ontvangen en nemen contact met u op.

Green Installatie Noord
Burgemeester van Weringstraat 23, 9665 GN Oude Pekela
050 569 0997
info@greeninstallatienoord.nl',
    datetime('now')
  );

UPDATE email_templates
SET slug = 'appointment-received', name = 'Afspraakaanvraag ontvangen'
WHERE id = 'tpl-appointment-customer';

UPDATE email_templates
SET slug = 'quote-received', name = 'Offerteaanvraag ontvangen'
WHERE id = 'tpl-quote-admin';

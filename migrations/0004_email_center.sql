-- Email center: richer logs, compose metadata, five customer templates.
-- Additive only. Do not DROP tables.

ALTER TABLE email_templates ADD COLUMN purpose TEXT;
ALTER TABLE email_templates ADD COLUMN description TEXT;
ALTER TABLE email_templates ADD COLUMN compose INTEGER NOT NULL DEFAULT 0;

ALTER TABLE email_logs ADD COLUMN recipient_name TEXT;
ALTER TABLE email_logs ADD COLUMN sender TEXT;
ALTER TABLE email_logs ADD COLUMN body_text TEXT;
ALTER TABLE email_logs ADD COLUMN body_html TEXT;

UPDATE email_templates
SET
  compose = 1,
  purpose = 'Bevestiging van een geplande afspraak.',
  description = 'Stuurt de klant datum, tijd en dienst nadat u de afspraak heeft bevestigd.',
  name = 'Afspraak bevestigd',
  subject = 'Uw afspraak is bevestigd - Green Installatie Noord',
  body_text = 'Beste {{customer.firstName}},

Uw afspraak bij Green Installatie Noord is bevestigd.

Dienst: {{appointment.service}}
Datum: {{appointment.date}}
Tijd: {{appointment.time}}

Wij staan op het afgesproken moment bij u langs. Belt u ons gerust als er iets wijzigt.

Met vriendelijke groet,
Green Installatie Noord',
  updated_at = datetime('now')
WHERE id = 'tpl-appointment-confirmed';

UPDATE email_templates
SET
  compose = 1,
  purpose = 'Beleefde opvolging van een eerdere offerte of aanvraag.',
  description = 'Gebruik dit als u nog geen reactie heeft gehad op een offerte of voorstel.',
  name = 'Offerte opvolging',
  subject = 'Even contact over uw aanvraag',
  body_text = 'Beste {{customer.firstName}},

Onlangs heeft u een aanvraag bij ons gedaan.

Ik wilde kort navragen of u nog vragen heeft, of dat we een moment kunnen afspreken om de mogelijkheden door te nemen.

U kunt ons bereiken op {{company.phone}} of via {{company.email}}.

Met vriendelijke groet,
Green Installatie Noord',
  updated_at = datetime('now')
WHERE id = 'tpl-quote-followup';

INSERT OR IGNORE INTO email_templates (
  id, slug, name, subject, body_text, updated_at, purpose, description, compose
) VALUES
  (
    'tpl-quote-received-customer',
    'quote-received-customer',
    'Offerteaanvraag ontvangen',
    'Wij hebben uw offerteaanvraag ontvangen',
    'Beste {{customer.firstName}},

Dank voor uw offerteaanvraag.

Wij hebben uw bericht in goede orde ontvangen en bekijken wat in uw situatie past. U hoort zo snel mogelijk van ons, meestal binnen twee werkdagen.

Heeft u intussen extra informatie? Stuur die gerust naar {{company.email}} of bel {{company.phone}}.

Met vriendelijke groet,
Green Installatie Noord',
    datetime('now'),
    'Bevestiging dat een offerteaanvraag is ontvangen.',
    'Laat de klant weten dat de aanvraag binnen is en in behandeling wordt genomen.',
    1
  ),
  (
    'tpl-appointment-reminder',
    'appointment-reminder',
    'Afspraakherinnering',
    'Herinnering: uw afspraak bij Green Installatie Noord',
    'Beste {{customer.firstName}},

Dit is een korte herinnering aan uw afspraak.

Dienst: {{appointment.service}}
Datum: {{appointment.date}}
Tijd: {{appointment.time}}

Bent u verhinderd of wilt u het tijdstip verzetten? Bel ons dan op {{company.phone}}.

Met vriendelijke groet,
Green Installatie Noord',
    datetime('now'),
    'Herinnering voor een geplande afspraak.',
    'Stuur dit een dag van tevoren, zodat de klant datum en tijd paraat heeft.',
    1
  ),
  (
    'tpl-thank-you',
    'thank-you',
    'Bedankt voor uw aanvraag',
    'Dank voor uw bericht - Green Installatie Noord',
    'Beste {{customer.firstName}},

Hartelijk dank voor uw bericht. Wij hebben uw aanvraag ontvangen en nemen deze in behandeling.

U hoort zo snel mogelijk van ons. Heeft u spoed, dan kunt u ons ook bellen op {{company.phone}}.

Met vriendelijke groet,
Green Installatie Noord',
    datetime('now'),
    'Dankbericht na contact of een serviceaanvraag.',
    'Een rustige, professionele bevestiging dat het bericht is aangekomen.',
    1
  );

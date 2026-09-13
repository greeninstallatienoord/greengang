# Email architecture (Resend)

## Flow

```
Form or future admin action
  → React apiClient
  → Worker route
  → sendEmail() in worker/src/email.ts
  → Resend HTTPS API
  → email_logs row in D1
```

The React app never calls Resend and must never contain `RESEND_API_KEY`.

Do not set `VITE_RESEND_*` or any other Vite-exposed secret.

## Sender

Primary from-address: `info@greeninstallatienoord.nl`  
Display name: Green Installatie Noord  
Overridable via D1 `settings.from_email`.

Resend will reject send until this domain is verified in the Resend dashboard. That step is **manual** and not done from this repository.

## Abstraction

```ts
await sendEmail(env, {
  to,
  subject,
  text,
  html,        // optional; defaults to escaped paragraphs from text
  templateId,  // D1 email_templates.id for logging
})
```

If `RESEND_API_KEY` is missing, the Worker logs `skipped` and still stores the submission. Public forms can succeed without mail.

## Prepared use cases

| Event | To | Tone |
| --- | --- | --- |
| New appointment | `info@greeninstallatienoord.nl` | Notification + admin appointments URL |
| Appointment received | customer | “Afspraakaanvraag ontvangen” — not a confirmed booking |
| Contact form | `info@greeninstallatienoord.nl` | Notification |
| Quote request | `info@greeninstallatienoord.nl` | Notification |
| Future admin mail | chosen recipient | Templates table is the hook |

Admin appointment subject pattern:

`Nieuwe afspraakaanvraag – {name} – {date}`

Customer subject:

`Afspraakaanvraag ontvangen – Green Installatie Noord`

Customer HTML/text includes name, service, date, time, and NAP contact details. It must not say the visit is confirmed.

## HTML

`renderBrandedEmail` builds a single table-based shell (logo, white content, green accent, NAP footer, optional CTA). Text is escaped; no external JS.

Template variables use `{{customer.firstName}}` style tokens. Unknown or empty tokens become an empty string so customers never see placeholders.

Admin compose flow: compose → controleren → versturen. Preview supports desktop/mobile widths. Local draft is sessionStorage only and cleared after a successful send.

Structured template fields (heading, intro, closing, CTA) are optional; `body_text` remains the send-time plain-text body.

## Variables (safe set)

| Token | Meaning |
| --- | --- |
| `{{customer.firstName}}` | Voornaam |
| `{{customer.fullName}}` / `{{customer.name}}` | Volledige naam |
| `{{appointment.date}}` / `{{appointment.time}}` | Afspraak |
| `{{service.name}}` | Dienst |
| `{{quote.reference}}` | Offertereferentie |
| `{{company.phone}}` / `{{company.email}}` | Bedrijfsgegevens |

## Local vs production

| Environment | Key location |
| --- | --- |
| Local Worker | `.dev.vars` → `RESEND_API_KEY` |
| Cloudflare | `npx wrangler secret put RESEND_API_KEY` (repeat per `--env` if used) |

Production secrets were **not** written from this task.

## Failure behaviour

Send failures are logged (`email_logs.status = failed`). Appointment/contact/quote rows are already stored. The API still returns success for the stored record so the customer is not told the company “did not receive” a saved request. Operators should watch logs and `email_logs`.

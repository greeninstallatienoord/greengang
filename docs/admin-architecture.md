# Admin architecture

Private area: `/blackberry97`  
Production URL: `https://greeninstallatienoord.nl/blackberry97`

This path is **not** security. It is only an unpublished URL.

## Routes (React, outside RootLayout)

| Path | Purpose |
| --- | --- |
| `/blackberry97` | Dashboard |
| `/blackberry97/login` | Login |
| `/blackberry97/dashboard` | Redirects via index (dashboard is `/blackberry97`) |
| `/blackberry97/appointments` | Appointment list |
| `/blackberry97/customers` | Customers |
| `/blackberry97/quotes` | Quote requests |
| `/blackberry97/contact` | Contact submissions |
| `/blackberry97/emails` | Email log (no bodies) |
| `/blackberry97/templates` | Template metadata |
| `/blackberry97/settings` | Non-secret settings keys |

UI: sidebar on large screens, hamburger on small screens. No public header/footer.

`robots.txt` disallows `/blackberry97`. Admin layout sets `noindex, nofollow`. Do not add these URLs to `src/data/navigation.ts`, footer, blog, or `sitemap.xml`.

## Authentication

Not allowed as the only protection:

- hardcoded password in source
- frontend-only checks
- localStorage session
- knowing the URL

Implemented foundation:

1. Admin row in D1 with `password_hash` + `password_salt` (PBKDF2).
2. Session row + HttpOnly cookie `gin_admin_session`.
3. Cookie value is `token.hmac` using `ADMIN_SESSION_SECRET`.
4. `Secure` when `ENVIRONMENT=production`.
5. `SameSite=Lax`, `Path=/`, 12 hour expiry.
6. `POST /api/admin/logout` deletes the session.
7. `requireAdmin` on all `/api/admin/*` except login.

No production password is shipped in git.

Provision an admin: see `docs/d1.md` (`scripts/hash-password.mjs`).

Login without `ADMIN_SESSION_SECRET` returns 503.

## CSRF / cookies

Same-origin admin + API (Pages + Worker on `greeninstallatienoord.nl`) uses a SameSite=Lax cookie. Cross-site credentialed calls are limited by CORS allow-list.

## Dashboard numbers

- Appointments today (not cancelled/declined)
- Upcoming requested/confirmed from today
- Quote requests with status `new`
- Contact submissions with status `new`

Keep this small. No analytics product.

## Appointment v1

Customer flow on `/afspraak-maken`:

1. Service and type (existing UI)
2. Date + slot (from D1 rules minus taken times) or daypart fallback
3. Name, email, phone, optional address, optional notes
4. Store customer + appointment (`status = requested`)
5. Emails as in `docs/email-architecture.md`

Double booking: unique partial index on date+time for active statuses, plus a pre-check in the Worker.

Not in v1: Google Calendar, Apple Calendar, complex availability.

Slot rules: `appointment_slot_rules` (weekdays 1–5, sample hours). Admins can later edit this table.

## Manual Cloudflare steps (not done here)

1. `wrangler login`
2. Apply remote migration
3. Insert hashed admin
4. `wrangler secret put ADMIN_SESSION_SECRET`
5. `wrangler secret put RESEND_API_KEY`
6. Deploy Worker
7. Route `https://greeninstallatienoord.nl/api/*` to the Worker (and keep Pages for the SPA)
8. Verify Resend domain for `greeninstallatienoord.nl`

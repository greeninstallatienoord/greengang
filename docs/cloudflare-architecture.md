# Cloudflare architecture

Maintainer notes for Green Installatie Noord. This document describes the prepared stack. It does not claim that Cloudflare, Resend, DNS, or secrets are already live.

## Existing frontend (unchanged product)

- React 19 + Vite + TypeScript
- Tailwind CSS 4
- React Router public routes under `RootLayout` (header, footer, cookie banner)
- Static hosting: Vite `dist/` served by the same Worker (`greengang`) via `[assets]`
- Verified business data: `src/data/business.ts`
- Forms: contact, offerte, afspraak — still work without the Worker (preview, `confirmedByServer: false`)

Do not rebuild this frontend. The Worker is an API beside it.

## Target request flow

```
Browser
  → Worker `greengang` (greeninstallatienoord.nl)
       ├── /api/* → existing Worker API → D1 / Resend
       └── everything else → Vite dist/ (React Router SPA)
```

The browser never receives `RESEND_API_KEY` or `ADMIN_SESSION_SECRET`.

## Backend

| Piece | Location |
| --- | --- |
| Worker entry | `worker/src/index.ts` |
| Wrangler | `wrangler.toml` |
| D1 migrations | `migrations/` |
| Auth | `worker/src/auth.ts` |
| Email | `worker/src/email.ts` |
| Public API | `worker/src/routes/public.ts` |
| Admin API | `worker/src/routes/admin.ts` |

There was no Worker in the original repo. This is the first API layer.

## API surface

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/api/health` | none — `{ "ok": true }` only |
| GET | `/api/appointments/slots?date=YYYY-MM-DD` | none |
| POST | `/api/contact` | none + rate limit |
| POST | `/api/quotes` | none + rate limit |
| POST | `/api/appointments` | none + rate limit |
| POST | `/api/admin/login` | none + rate limit |
| POST | `/api/admin/logout` | cookie |
| GET | `/api/admin/session` | session |
| GET | `/api/admin/dashboard` | session |
| GET | `/api/admin/appointments` | session |
| GET | `/api/admin/customers` | session |
| GET | `/api/admin/quotes` | session |
| GET | `/api/admin/contact` | session |
| GET | `/api/admin/emails` | session |
| GET | `/api/admin/templates` | session |
| GET | `/api/admin/settings` | session |

`/api/health` does not return secrets, env, or database details.

## D1

Use the existing database only:

- Name: `greeninstallatie`
- ID: `f0728db7-edb9-438c-9a64-5d04ee828137`

Binding name: `DB`. See `docs/d1.md`.

## Worker

- TypeScript, JSON responses, `HttpError` for status codes
- CORS: allow `PUBLIC_SITE_URL` plus local Vite origins, credentials on
- Validation in `worker/src/validation.ts`
- In-memory rate limits (per isolate; not a global WAF)
- Structured logs via `logSafe` (event name + env, no emails/passwords)
- Production errors never include stack traces or SQL text

## Resend

See `docs/email-architecture.md`. The Worker calls Resend. The React bundle must not.

## Environment

See `docs/environment-variables.md`.

| Concept | Typical |
| --- | --- |
| development | `npm run dev` + `npm run dev:api`, D1 `--local` |
| preview | Wrangler `env.preview` + Cloudflare preview host |
| production | Pages + Worker route on `https://greeninstallatienoord.nl` |

## Security boundaries

- Public site and sitemap must never link to `/blackberry97`
- Hidden URL is not authentication
- Admin sessions: HttpOnly cookie, HMAC with `ADMIN_SESSION_SECRET`, Secure in production, SameSite=Lax, 12 hour expiry
- Passwords: PBKDF2-SHA-256, 100000 iterations (Workers Web Crypto max), random salt
- SQL via bound parameters only
- Email HTML escaped
- Request body cap: 80 KB
- SPA fallback is Wrangler `[assets] not_found_handling = "single-page-application"`; do not add `public/_redirects` to `/index.html` (Cloudflare error 100324)

## Future extension points

- Confirm / decline appointments from admin (status already on the row)
- Google / Apple calendar sync (not in v1)
- Richer slot editor (rules table already exists)
- Admin-authored emails from templates
- Durable rate limiting (KV or Cloudflare Rate Limiting)
- Customer reuse by email instead of one row per booking

## Local commands

```bash
npm install
copy .dev.vars.example .dev.vars
npm run db:migrate:local
npm run dev:api
npm run dev
```

Health check: `http://127.0.0.1:8787/api/health` or `http://localhost:5173/api/health` with the proxy.

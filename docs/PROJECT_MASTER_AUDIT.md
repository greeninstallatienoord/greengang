# Green Installatie Noord — Master Project Audit

**Document type:** Exhaustive handover audit  
**Audit date:** 12 September 2026  
**Auditor method:** Repository inspection, git history, existing docs, and safe local commands only  
**Implementation during this audit:** None. No UI, API, schema, DNS, secret, or deploy changes were made.

---

## 0. Executive summary

**What is the state of Green Installatie Noord right now?**

The project is a **functionally ambitious but not production-verified** React + Cloudflare Worker product. Almost all of the last several hours of work exists only in the **uncommitted working tree**. Git has **one commit** (`17f7b71`, 12 Sep 2026 19:26 +0200): the original website + backend foundation. Everything after that — public redesign, real project photos, quote/appointment reliability, email center, legal rewrite, mobile UX pass — is local and **not on `origin/main`**.

**Overall state:** Almost ready as a local codebase. **Not ready** as a verified live product.

**Already strong**

- Clear public information architecture: flat service routes, honest Dutch copy, no invented reviews/prices/certs.
- Single NAP source: `src/data/business.ts`.
- Worker API design: D1 write first, honest `emailWarning`, honeypot, idempotency, rate limits, parameterized SQL.
- Admin shell exists for appointments, quotes, contacts, customers, emails, templates, settings.
- Frontend lint + TypeScript + Vite build pass. Worker `tsc` passes.
- Cookie/legal copy matches the current implementation (no Google Fonts, empty optional-script registry).
- Homepage hero is **split** (photo + dark copy panel). The old “white text on photo” problem is **addressed in code**, not visually re-verified in this audit.

**Biggest remaining problems**

1. **Uncommitted work.** Losing this machine or resetting the tree loses the product.
2. **Deployment is unverified.** The historical Cloudflare Assets infinite-loop failure (`/* → /index.html 200` plus SPA fallback) is **mitigated in the working tree** by deleting `public/_redirects` and `public/_routes.json`. That deploy was **not re-run** in this audit.
3. **Remote D1 state is UNKNOWN.** This environment cannot query remote D1 (Cloudflare API 7403). Migrations `0004` and `0005` are **untracked** and were **not applied remotely** from this repo during the audit. If live Worker code expects those columns and remote D1 does not have them, public submits and email logs will fail.
4. **Email delivery is UNKNOWN.** Resend is implemented in `worker/src/email.ts`. Inbox delivery, domain verification, and secret presence were not verified.
5. **Admin login against live D1 is UNKNOWN.** No default admin user is in the repo.
6. **`npm run deploy` uses the default Wrangler env**, whose `ENVIRONMENT` is `"development"` and `PUBLIC_SITE_URL` is `https://development.greeninstallatienoord.nl`, **not** `[env.production]`.
7. **No live browser/device-lab pass in this audit.** Mobile UX changes exist in code only.

**Deployment status:** NOT VERIFIED. Last known failure class: Cloudflare error around SPA redirect loops (docs: 100324). Working-tree config looks corrected. Live Worker/DNS/custom domains: UNKNOWN.

**Backend status:** Code-complete for contact/quote/appointment + admin. Runtime against remote: UNKNOWN.

**Database status:** Local Wrangler reports **no pending local migrations** (0001–0005 appear applied locally). Remote: UNKNOWN / unauthorized from this machine.

**Email status:** Implemented, fail-soft, logged. Delivery: NOT VERIFIED.

**UI status:** Substantial public redesign in the working tree. Visual quality: NEEDS VERIFICATION.

**Mobile status:** Dedicated pass implemented in source (slide-over menu, split hero, 44px targets, FAB lift). Visual confirmation at 320–430px: NOT DONE in this audit.

**Most important next actions**

1. Back up / commit the working tree (only if the owner asks).
2. Confirm Cloudflare account auth, Worker name (`greengang` vs committed `greeninstallatienoord-api`), and which custom domains point where.
3. Inspect remote D1 schema; apply `0004`/`0005` only after explicit approval.
4. Confirm `RESEND_API_KEY` and `ADMIN_SESSION_SECRET` on the actual deployed env; confirm an `admins` row exists.
5. Deploy the **current** tree (without reintroducing `_redirects`) and smoke-test forms + admin + mail.
6. Do a real phone/browser pass of header, hero, FAB, forms, cookie banner.

---

## 1. How this audit was produced

### Inspected layers

- `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `wrangler.toml`
- `worker/src/*`, `migrations/*`, `scripts/hash-password.mjs`
- `src/App.tsx`, `src/admin/AdminApp.tsx`, all `src/pages/*`, layouts, forms, consent, SEO
- `src/data/*` (business, media, legal, navigation, seo, trust, areas, region)
- `public/*`, `docs/*`, `index.html`
- Image trees: `src/assets/images/**`, `aircos afbeeldingen/`, `certificaten afbeeldingen/`, root PNGs
- Git: `status`, `log`, `show HEAD` for original `wrangler.toml`, `public/_redirects`, `public/_routes.json`

### Commands run during this audit

| Command | Result |
|---|---|
| `git status` / `git log` / `git show HEAD:…` | PASS (evidence below) |
| `npx wrangler d1 migrations list greeninstallatie --local` | PASS — “No migrations to apply” |
| `npx wrangler d1 migrations list greeninstallatie --remote` | FAIL — Cloudflare API 7403 unauthorized |
| `npm run lint` | PASS (exit 0) |
| `npm run build` (`tsc -b && vite build`) | PASS (exit 0) |
| `npm run typecheck:api` | PASS (exit 0) |
| `npm run deploy` | **NOT RUN** |
| `npm run db:migrate:remote` | **NOT RUN** |
| Browser / Playwright / device screenshots | **NOT AVAILABLE** in this session |

### Evidence scale

- ~216 tracked/untracked source files under the repo glob of `ts/tsx/js/sql/md/css/html`
- 5 SQL migrations
- 1 git commit on `main`
- 100+ modified files + 116 untracked paths in the working tree

If a conclusion is not backed by one of the above, it is marked **UNKNOWN**.

---

## 2. What the project is

Green Installatie Noord is a Dutch HVAC installer site:

- Company: Green Installatie Noord
- Address: Burgemeester van Weringstraat 23, **9665 GN** Oude Pekela
- Phone: **06 28 73 91 34** / `tel:+31628739134`
- Email: **info@greeninstallatienoord.nl**
- KVK: **86277391**
- Hours: ma–vr 07:00–17:00, weekend closed
- Positioning: **Noord-Nederland first**, then Groningen / Drenthe / Friesland. Oude Pekela is the **physical base**, not the whole market.

Public product: cv-ketel, airco, warmtepomp, service/onderhoud, work gallery, kennisbank, quote, appointment, contact, legal.

Internal product: hidden admin at `/blackberry97` (not in public nav, footer, or sitemap).

---

## 3. Project architecture (as it exists now)

### Intended live request flow

```
Browser
  → Cloudflare
    → Worker (working-tree name: greengang)
         ├── /api/*          → worker/src/index.ts  (run_worker_first)
         └── everything else → [assets] directory ./dist
                                 not_found_handling = single-page-application
              ↓
            D1 binding DB → database_name greeninstallatie
                            database_id   f0728db7-edb9-438c-9a64-5d04ee828137
              ↓
            Resend HTTPS API (only if RESEND_API_KEY is present on the Worker)
```

This flow is **configured in the working tree** (`wrangler.toml`, `worker/src/index.ts`). It is **not verified live** from this machine.

### Layer map

| Layer | Stack | Responsible files |
|---|---|---|
| Public UI | React 19.2, React Router 7, TypeScript | `src/main.tsx`, `src/App.tsx`, `src/pages/*`, `src/layouts/RootLayout.tsx` |
| Admin UI | Same SPA, separate layout | `src/admin/AdminApp.tsx`, `src/admin/AdminLayout.tsx`, `src/admin/pages/*` |
| CSS | Tailwind 4 via Vite plugin | `src/index.css`, `@tailwindcss/vite` in `vite.config.ts` |
| Fonts | Self-hosted Manrope + Newsreader | `@fontsource/*` imported in `src/index.css`; **no** Google Fonts in `index.html` |
| Build | Vite 8 | `vite.config.ts` → `dist/` |
| Worker | TypeScript Worker | `worker/src/index.ts` |
| Public API | JSON, rate-limited | `worker/src/routes/public.ts` |
| Admin API | Session cookie | `worker/src/routes/admin.ts` |
| Auth | PBKDF2-SHA-256 + HMAC cookie | `worker/src/auth.ts`, `scripts/hash-password.mjs` |
| Email | Resend REST | `worker/src/email.ts`, `emailLayout.ts`, `templates.ts` |
| DB | Cloudflare D1 / SQLite | `migrations/0001`–`0005`, binding `DB` |
| Consent | localStorage `gin-consent-v2` | `src/lib/consentManager.ts` |
| Assets | Vite hashed images + `public/` | `src/data/media.ts`, `src/assets/images/display/*` |

### Frontend framework (verified)

- React 19.2.8, react-dom 19.2.8, react-router-dom 7.18.3
- lucide-react icons
- No Redux, no Next.js, no CMS

### Routing (verified in `src/App.tsx`)

- Public routes wrap `RootLayout` (header, footer, cookie banner, FAB).
- Admin is a **sibling** route: `path={`${ADMIN_BASE_PATH.slice(1)}/*`}` → `AdminApp` (no public chrome).
- Unknown public paths → `NotFoundPage`.

### Worker fetch order (verified in `worker/src/index.ts`)

1. OPTIONS → CORS
2. GET `/api/health`
3. GET `/api/appointments/config`
4. GET `/api/appointments/slots?date=`
5. POST `/api/contact` | `/api/quotes` | `/api/appointments`
6. POST `/api/admin/login` | `/api/admin/logout`
7. `/api/admin/*` → `requireAdmin` then admin handlers
8. other `/api/*` → 404
9. **else** `env.ASSETS.fetch(request)` — no custom HTML-stripping redirect in Worker code

### What is *not* the architecture

- There is **no** Google Calendar / Outlook / iCal sync in the repo.
- There is **no** second D1 database name in `wrangler.toml`.
- There is **no** Pages `_redirects` in the current working tree.
- Committed `wrangler.toml` named the Worker `greeninstallatienoord-api` and had **no** `[assets]` block. The working tree renamed it to `greengang` and added Assets SPA hosting.

---

## 4. Change history (evidence-based)

Git has a single commit on `main`, tracking `origin/main`:

```
17f7b71  2026-09-12 19:26:55 +0200
Add the Green Installatie Noord website and Cloudflare backend foundation.
```

Remote: `git@github-greeninstallatienoord-greengang:greeninstallatienoord/greengang.git`

**Nothing after 19:26 is committed.** The “last several hours” are the dirty working tree.

Conversation/transcript evidence (not git) shows later work: public redesign, image map, form reliability, legal/fonts/consent, mobile UX. Historical cause of some visual choices **cannot be fully reconstructed from git alone**.

### 4.1 Previously existing (commit `17f7b71`)

Present in the foundation commit:

- Full public page set (home, services, about, contact, quote, appointment, blog, FAQ, legal, area stubs)
- Admin shell at `/blackberry97`
- Worker API + auth + Resend helper + D1 migrations **0001–0003**
- Generated editorial images under `src/assets/images/hero/`, `services/`, `blog/`
- Cloudflare Pages-style `public/_redirects` (`/* /index.html 200`) and `public/_routes.json`
- Worker name in committed `wrangler.toml`: **`greeninstallatienoord-api`**
- No `[assets]` / `run_worker_first` in committed Wrangler
- Forms could present a local preview success if the API was down (`confirmedByServer: false` path existed in the original product story; current working-tree services **no longer fake success**)

### 4.2 Added (working tree, untracked)

| Area | Evidence |
|---|---|
| Migrations `0004_email_center.sql`, `0005_request_reliability.sql` | untracked files |
| Display/work photo sets | `src/assets/images/display/`, `src/assets/images/work/` |
| Trust logos | `src/assets/images/trust/*.avif` |
| Homepage section components | `src/components/home/*` |
| FAB | `src/components/layout/FloatingContactMenu.tsx` |
| Work page + lightbox + portfolio | `src/pages/WorkPage.tsx`, `src/components/work/*`, `src/data/mediaGallery.ts` |
| Region copy | `src/data/region.ts` |
| Email layout + idempotency | `worker/src/emailLayout.ts`, `worker/src/idempotency.ts` |
| Admin email logs / extras | `src/admin/pages/EmailLogsPage.tsx`, `EmailLogDetailPage.tsx`, `EmailHistory.tsx`, etc. |
| Raw dumps (not wired) | `aircos afbeeldingen/`, `certificaten afbeeldingen/` (brand SVGs unused) |

### 4.3 Changed (modified vs HEAD)

Very large set. Material groups:

- **Hosting:** `wrangler.toml` Worker name `greengang`; `[assets]` + `run_worker_first = ["/api/*"]`; `PUBLIC_SITE_URL` default → development host
- **SPA loop fix:** deleted `public/_redirects`, `public/_routes.json`
- **Public chrome:** Header, TopBar, MobileMenu (slide-over), Footer, CtaPair, buttons 44px
- **Hero:** `HomeHero.tsx` split layout; `PageHero.tsx` image beside copy
- **Forms:** quote/contact/appointment honesty, idempotency keys, privacy, keyboards
- **Legal / consent:** `src/data/legal.ts`, `gin-consent-v2`, empty optional scripts, self-hosted fonts
- **Media catalog:** `src/data/media.ts` now points at **display** project photos, not `hero/home.jpg` / `services/*.jpg`
- **Worker public/admin/email** expanded
- **Deleted** `src/components/layout/MobileActionBar.tsx`

### 4.4 Reworked

- Homepage composition: `HomePage.tsx` is now Hero → Experience → ServiceList → WhyHome → Process → HomeProjects → TrustMarks → Local → Knowledge → CTA
- Image system: object-position map + mobile/desktop CSS variables
- Quote/contact/appointment: D1-first + `emailWarning` instead of pretending mail always sent
- Legal pages: factual Cloudflare / Resend / D1 / sessionStorage description; no “tijdelijke tekst” found in current `legal.ts`

### 4.5 Attempted

- Cloudflare deploy of Worker + Assets (conversation + docs). Exact live error text was **not re-captured in this audit**. Docs state Cloudflare error **100324** if `_redirects` to `/index.html` is combined with Assets SPA fallback.
- Remote D1 inspection from this machine: **failed** (API 7403).
- Live Resend inbox test: **not evidenced** as completed.
- Browser verification of the mobile UX pass: **not available** here.

### 4.6 Failed

| Attempt | Result | Likely cause | Current status |
|---|---|---|---|
| Pages-style `/* /index.html 200` together with Workers Assets SPA | Deploy version failure / infinite redirect rule | `_redirects` + `not_found_handling = single-page-application` both rewrite to index | Working tree **deleted** `_redirects` and `_routes.json`. **Deploy not re-tested.** |
| Remote D1 list from this audit | API 7403 | This Wrangler login/account cannot access the D1 | UNKNOWN remote schema |
| Claiming live site matches this tree | Cannot | `origin/main` is still `17f7b71`; working tree uncommitted | Live site may be older or different |

### 4.7 Pending

- Commit / push of working tree
- Remote apply of `0004` and `0005` (explicit approval required)
- Secrets on the env that is actually deployed
- Admin user INSERT into the D1 that is actually used
- Resend domain verification
- Deploy of current `dist/` + Worker
- DNS / custom domain confirmation
- Real-device visual QA
- Update stale docs (`docs/assets.md`, parts of `docs/cloudflare-architecture.md`, `docs/page-architecture.md`)

---

## 5. Full route inventory

Status key for this table:

- **Builds:** included in the Vite graph (compile verified by `npm run build`)
- **Nav:** linked from header, mobile menu, footer, or sitemap as noted
- **Runtime:** not browser-verified in this audit unless stated

### 5.1 Routes that do **not** exist

| Expected by some briefs | Actual |
|---|---|
| `/diensten` | **NOT A ROUTE.** Services are flat. |
| `/onderhoud` | **NOT A ROUTE.** Use `/service-onderhoud`. |
| `/kennisbank` | **NOT A ROUTE.** Use `/blog`. |
| `/privacyverklaring` | **NOT A ROUTE.** Use `/privacy`. |
| `/cookiebeleid` | **NOT A ROUTE.** Use `/cookies`. |
| `/projecten`, `/galerij` | **NOT ROUTES.** Gallery is `/werk`. |

`/voorwaarden` **does** exist as a redirect to `/algemene-voorwaarden`.

### 5.2 Public routes

| Route | Component | Purpose | Public | Builds | In nav | Forms | Images | Responsive code | Visual | Content | Remaining |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | `HomePage` | Marketing home | yes | yes | implicit | none | display photos | yes | 🔵 | honest, a bit repetitive | Live visual QA |
| `/cv-ketel` | `ServicePage` slug cv-ketel | Service | yes | yes | header services + footer | CTAs only | `cvIntergas` | yes | 🔵 | restrained | Visual QA |
| `/airco` | `ServicePage` | Service | yes | yes | yes | CTAs | zolder + outdoor | yes | 🔵 | good match | Visual QA |
| `/warmtepomp` | `ServicePage` | Service | yes | yes | yes | CTAs | `warmtepompIntergas` | yes | 🔵 | honest “not automatic” | Visual QA |
| `/service-onderhoud` | `ServicePage` | Service | yes | yes | yes | CTAs | `cvOpstelling` | yes | 🔵 | no fake intervals | Visual QA |
| `/over-ons` | `AboutPage` | Company | yes | yes | header/footer | CTAs | airco gevel photos as “own work” | yes | 🔵 | honest; thin story | People/team photos missing by policy |
| `/werk` | `WorkPage` | Gallery | yes | yes | header/footer | none | `workShots` | yes | 🔵 | captions factual | Crop QA |
| `/werkgebied` | `AreaIndexPage` | Region explainer | yes | yes | mobile extra + footer region | none | none in hero | yes | 🔵 | correct positioning | Fine |
| `/werkgebied/:plaats` | `AreaDetailPage` | City page | yes | yes | no (empty `areas[]`) | — | — | — | — | — | **Always 404** until an area is added |
| `/werkgebied/:plaats/:dienst` | `AreaServicePage` | City+service | yes | yes | no | — | — | — | — | — | **Always 404** |
| `/blog` | `BlogPage` | Kennisbank index | yes | yes | header “Kennisbank” | none | cards | yes | 🔵 | nuchtere artikelen | Visual QA |
| `/blog/categorie/:categorie` | `BlogCategoryPage` | Category | yes | yes | from blog | none | yes | yes | 🔵 | OK | Visual QA |
| `/blog/:slug` | `BlogArticlePage` | Article | yes | yes | from blog | none | yes | yes | 🔵 | OK | Visual QA |
| `/contact` | `ContactPage` | NAP + form | yes | yes | yes | `ContactForm` | none in hero | yes | 🔵 | no placeholder legal | API+mail unverified |
| `/offerte-aanvragen` | `QuotePage` | Quote wizard | yes | yes | CTAs/footer | `QuoteForm` | none | yes | 🔵 | 4 steps + review | API+D1+mail unverified |
| `/afspraak-maken` | `AppointmentPage` | Booking wizard | yes | yes | CTAs/footer | `AppointmentFlow` | none | yes | 🔵 | real slots only | Slots API unverified live |
| `/veelgestelde-vragen` | `FaqPage` | FAQ | yes | yes | mobile extra | none | none | yes | 🔵 | honest | Visual QA |
| `/privacy` | `LegalPage` privacy | Privacy | yes | yes | footer | none | none | yes | 🔵 | factual | Legal review |
| `/cookies` | `LegalPage` cookies | Cookie policy | yes | yes | footer | none | none | yes | 🔵 | matches code | Legal review |
| `/algemene-voorwaarden` | `LegalPage` terms | Terms | yes | yes | footer | none | none | yes | 🟡 | short, not a full AV | Legal/business |
| `/voorwaarden` | Navigate | Alias | yes | yes | no | — | — | — | — | — | OK |
| `/disclaimer` | `LegalPage` | Disclaimer | yes | yes | footer | none | none | yes | 🔵 | no fake scores | OK |
| `*` (public) | `NotFoundPage` | 404 | yes | yes | no | CTAs | none | yes | 🔵 | OK | OK |

### 5.3 Admin routes (`ADMIN_BASE_PATH` = `/blackberry97`)

Mounted in `src/admin/AdminApp.tsx`. Not in sitemap (`public/robots.txt` Disallow). Not in footer/header.

| Route | Component | Purpose | Auth | Builds | Data-connected in code | Runtime |
|---|---|---|---|---|---|---|
| `/blackberry97` | redirect → dashboard | entry | guard | yes | — | 🔵 |
| `/blackberry97/login` | `AdminLoginPage` / `LoginGate` | login | public | yes | `POST /api/admin/login` | 🔵 |
| `/blackberry97/dashboard` | `DashboardPage` | counts + today | session | yes | `GET /api/admin/dashboard` | 🔵 |
| `/blackberry97/appointments` | `AppointmentsPage` | list | session | yes | list API | 🔵 |
| `/blackberry97/appointments/new` | `AppointmentNewPage` | create | session | yes | POST | 🔵 |
| `/blackberry97/appointments/:id` | `AppointmentDetailPage` | detail + status | session | yes | GET/PATCH + email on confirm/cancel | 🔵 |
| `/blackberry97/customers` | `CustomersPage` | list | session | yes | list | 🔵 |
| `/blackberry97/customers/:id` | `CustomerDetailPage` | detail | session | yes | GET | 🔵 |
| `/blackberry97/quotes` | `QuotesPage` | list | session | yes | list | 🔵 |
| `/blackberry97/quotes/:id` | `QuoteDetailPage` | detail + status | session | yes | GET/PATCH | 🔵 |
| `/blackberry97/contact` | `ContactListPage` | list | session | yes | list | 🔵 |
| `/blackberry97/contact/:id` | `ContactDetailPage` | detail + status | session | yes | GET/PATCH | 🔵 |
| `/blackberry97/emails` | `EmailsPage` | compose | session | yes | preview + send | 🔵 |
| `/blackberry97/emails/logs` | `EmailLogsPage` | log list | session | yes | list | 🔵 |
| `/blackberry97/emails/logs/:id` | `EmailLogDetailPage` | log detail | session | yes | GET | 🔵 |
| `/blackberry97/templates` | `TemplatesPage` | templates | session | yes | list | 🔵 |
| `/blackberry97/templates/:id` | `TemplateDetailPage` | edit | session | yes | PATCH | 🔵 |
| `/blackberry97/settings` | `SettingsPage` | slots / from_email | session | yes | GET/PATCH | 🔵 |
| `/blackberry97/*` | redirect dashboard | catch-all | guard | yes | — | — |

Admin runtime against live D1: **UNKNOWN**.

---

## 6. Visual / UI / UX audit

**Limitation:** No browser automation or screenshots in this session. Assessments below are from **source structure**, prior session notes, and asset inspection — not a fresh device lab. Scores in §27 are therefore conservative.

### 6.1 Header (`Header.tsx`, `TopBar.tsx`, `MobileMenu.tsx`, `ServicesMenu.tsx`)

| Item | Code state |
|---|---|
| Utility bar mobile | Phone + hours only; `min-h-11`; `lg:hidden` |
| Utility bar desktop | Phone, hours, werkgebied link; email **removed** from top bar |
| Logo | `BrandLogo` → `src/assets/images/branding/logo.png` (copy of official wordmark) |
| Desktop nav | Diensten dropdown + Werk / Over ons / Kennisbank / Contact |
| Desktop CTAs | Afspraak (secondary) + Offerte (primary green) |
| Mobile menu | Slide-over from right, `role="dialog"`, focus trap, Escape, backdrop, body scroll lock, rendered **outside** sticky header |
| Menu content | Diensten, pages, contact, green Offerte, Afspraak, Bel |
| Sticky | `sticky top-0 z-40`; menu z-65/70 |

**Known remaining mobile risks (unverified visually):** hours truncate at 320px; cookie banner + sticky header combined height.

### 6.2 Hero

**Homepage (`HomeHero.tsx`)**

- **Not** text-on-image. Grid: image left/top, copy on `bg-brand-deep`.
- Image: `pageImages.homeHero` = `aircoOmkastingDubbel` (two outdoor units in casing).
- H1: `CV-ketel, airco en warmtepomp` (no forced two-line spans).
- Supporting copy: `site.copy.heroText` (short, regional).
- CTAs: green quote, outline appointment, ghost phone (`CtaPair` `onDark` `showCall`).
- **The reported “white text and white buttons disappearing into the photo” is NOT the current homepage architecture.** Whether contrast of outline/ghost buttons on `brand-deep` is sufficient is 🔵 NEEDS VERIFICATION.

**Inner pages (`PageHero.tsx`)**

- Breadcrumbs + H1 + lead + optional image **beside** text, not overlaid.
- Image max-height capped on mobile.

**Rotation / crossfade:** no homepage image rotator in current `HomeHero`. Older `hero-slide` CSS still exists in `src/index.css` but is unused by the current hero.

### 6.3 Content sections (homepage)

| Section | File | Rhythm | Notes |
|---|---|---|---|
| Experience | `ExperienceSection.tsx` | ACCEPTABLE | Two intro paragraphs overlap in meaning |
| Services | `ServiceList.tsx` | GOOD | Clear list, not card soup |
| Why | `WhyHome.tsx` | ACCEPTABLE | Honest; a bit generic |
| Process | `ProcessSteps.tsx` | ACCEPTABLE | 5 steps; no fake SLAs |
| Work | `HomeProjects.tsx` | ACCEPTABLE | Featured caption sits on dark bar (contrast-safe, still text-on-photo) |
| Trust marks | `TrustMarks.tsx` | NEEDS CARE | Logos without approved cert records |
| Local | `LocalSection.tsx` | GOOD | Correct geography |
| Knowledge | `KnowledgePreview.tsx` | ACCEPTABLE | Fine |
| Bottom CTA | `CTASection.tsx` | ACCEPTABLE | Home passes `image={null}` |

Unused / leftover homepage experiments (not mounted on `HomePage`): `ServiceShowcase.tsx`, `CapabilityIntro.tsx`, `WorkGallery.tsx`, `WorkFilmstrip.tsx`.

### 6.4 Floating action menu

File: `src/components/layout/FloatingContactMenu.tsx`

| Action | Destination | Implementation |
|---|---|---|
| Afspraak maken | `/afspraak-maken` | `Link` |
| Offerte aanvragen | `/offerte-aanvragen` | `Link` |
| Bel ons | `tel:+31628739134` | `<a href>` |

Hidden on `/contact`, `/offerte-aanvragen`, `/afspraak-maken`. Hidden while mobile nav is open (`html[data-nav-open]`). Lifted by `--cookie-banner-offset` when the banner is shown. z-index 45 vs cookie 50 (cookie stays on top). **Click behavior not exercised in a browser in this audit.**

### 6.5 Footer

Company → contact → 2-col nav/diensten → marks + social → legal. Province list removed on purpose. Quote CTA hidden below `sm`. Contrast of legal text raised vs earlier `white/45`. **Height/overflow on 320px: unverified.**

---

## 7. Image / asset audit

### 7.1 Canonical catalog

**Use this:** `src/data/media.ts` + files in `src/assets/images/display/`.  
`MediaImage` applies `--media-pos` / `--media-pos-mobile` (`src/index.css` `.media-photo`).

**Do not use for new pages:** `src/assets/images/hero/home.jpg`, `src/assets/images/services/*.jpg`, raw `aircos afbeeldingen/`, duplicate `src/assets/images/work/` (same subjects as display).

`docs/assets.md` is **stale**: it still describes generated hero/service/blog JPGs as the page catalog. Current `pageImages` do **not** import those files.

### 7.2 Official brand

| File | Role | Notes |
|---|---|---|
| `greeninstallatielogotransparant.png` (repo root) | Source artwork | Also copied to `src/assets/images/branding/logo.png` and `public/logo.png` (133066 bytes) |
| `src/assets/images/branding/logo.png` | Live header/footer logo | `object-contain`; height-capped |
| `src/assets/images/branding/mark.png` | Emblem crop | Present |
| `public/favicon*` / apple-touch | Icons | Present |
| `favicon.png` (root) | Extra copy, ~872 KB | Not the public favicon set |

Logo usage quality: **code-correct aspect** (`object-contain`). Distortion: not seen in CSS. Visual: 🔵.

### 7.3 Display / project photos (wired)

Approximate sizes from the last production build (hashed copies):

| Filename | Subject | Likely service | Current usage | Quality note |
|---|---|---|---|---|
| `airco-omkasting-dubbel.jpg` | Two outdoor units in casing | airco | Home hero, work featured | Equipment-focused crop (50%/84% mobile). Hero message is all three services; image is airco-only. |
| `airco-omkasting.jpg` | Single unit in casing | airco | About hero | Appropriate “own work” |
| `airco-beugel.jpg` | Wall bracket unit | airco | About house | Gevel work, not a portrait of the company |
| `airco-muur.jpg` | Brick-wall outdoor unit | airco | About craft | OK |
| `airco-zolder.jpg` | Indoor unit attic | airco | Airco hero | Matches airco |
| `airco-gevel.jpg` | Outdoor on brick | airco | Airco outdoor story | Matches |
| `airco-platdak.jpg` | Unit on flat roof | airco | Home featured project | Crop pulled down to reduce sky |
| `airco-terras.jpg` | Flat roof / terrace | airco | `/werk` | OK |
| `airco-binnen.jpg` | Indoor above mirror | airco | blog category | OK |
| `airco-praktijk.jpg` | Indoor treatment room | airco | blog energie-comfort | OK |
| `airco-vloer.jpg` | Floor console | airco | blog tips | OK |
| `airco-kaisai.jpg` | Floor console bedroom | airco | `/werk` | Brand visible in filename; caption does not sell Kaisai as a partner list |
| `airco-nok.jpg` | High gable unit | airco | `/werk` | OK |
| `cv-intergas.jpg` | CV in plant room | cv | CV hero, home, blog | Intergas visible; no invented partnership claim in copy |
| `cv-opstelling.jpg` | Plant room | onderhoud | service-onderhoud hero | Appropriate |
| `warmtepomp-intergas.jpg` | Outdoor heat pump | warmtepomp | WP hero, home, blog | Dark roof above; crop is low |

Also on disk, **not referenced in `media.ts`:** `airco-dak.jpg`, `airco-sinclair.jpg`.

### 7.4 Unused / dump folders

| Location | Contents | Recommendation |
|---|---|---|
| `src/assets/images/hero/home.jpg` | Older generated indoor-unit hero | Keep file; do not reattach without a decision |
| `src/assets/images/services/*.jpg` | Older generated service shots | Unused by current catalog |
| `src/assets/images/blog/comfort.jpg`, `tips.jpg` | Older blog art | Unused; `blogImages` now uses display photos |
| `src/assets/images/work/*` | Duplicates of display | Duplicate storage; do not wire a second catalog |
| `aircos afbeeldingen/` | Messy originals + a `.mov` | Do not import; treat as raw intake |
| `src/assets/images/installations/`, `team/` | Empty directories | No team photos (intentional) |

### 7.5 Certification graphics

Wired marks (`src/data/media.ts` `schemeMarks` → `CertificationMarks.tsx`):

| File | Used | Claim in UI |
|---|---|---|
| `src/assets/images/trust/brl100-logo.avif` | yes | Logo + name only |
| `covrij-logo.avif` | yes | Logo + name only |
| `kiwa-logo.avif` | yes | Logo + name only |
| `stek-logo.avif` | yes | Logo + name only |

CSS: `object-contain`, compact `max-h-9` in footer, taller on TrustMarks. Distortion: **not suggested by CSS**. Live pixel check: 🔵.

`src/data/trust.ts` keeps the **same schemes at `approved: false`** with no certificate numbers. Homepage/about **still show the logos** via `CertificationMarks` with copy that they are “kaders / merken”, not “officieel gecertificeerd”.

**Unused brand SVGs** in `certificaten afbeeldingen/`: `baxi.svg`, `de-dietrich.svg`, `intergas.svg`, `nefit-bosch.svg`, `remeha.svg`, `vaillant.svg`. Do **not** publish as partner certifications.

Legal/official meaning of BRL 100 / CO-vrij / Kiwa / STEK for this company: **Requires legal/business verification.** Repo does not contain certificate numbers or expiry dates.

### 7.6 Image / message mismatches

1. Home H1 names three services; hero photo is **airco omkasting**. Acceptable as “own work” but not a CV/warmtepomp portrait.
2. About page uses **airco gevel photos** for company story (explicit captions: “Foto uit eigen werk”). No people, workshop, or street-of-Oude-Pekela photo exists.
3. Contact has **no** supporting image (docs/assets.md still says warmtepomp house — stale).
4. Manufacturer names appear in filenames (`intergas`, `kaisai`, `sinclair`). Copy generally avoids a brands list. Keep it that way.

---

## 8. Homepage audit (section statuses)

| Section | STATUS | Why |
|---|---|---|
| Hero | ACCEPTABLE (code) / 🔵 visual | Split layout fixes the white-on-photo bug in architecture. CTA contrast and crop not screenshot-verified. |
| Hero image rotation | MISSING | No rotator. Unused CSS remains. |
| Photo strip / filmstrip | MISSING on home | `WorkFilmstrip` exists but is unused. |
| Services | GOOD | Clear list. |
| Trust / why | ACCEPTABLE | No fake stats. |
| Certifications | NEEDS IMPROVEMENT | Logos shown; `trust.ts` unapproved. Visitors may over-read them. |
| Projects | ACCEPTABLE | Real photos; overlay titles. |
| Process | ACCEPTABLE | Honest. |
| Knowledge | ACCEPTABLE | Fine. |
| Bottom CTA | ACCEPTABLE | No image on home CTA. |
| Footer | ACCEPTABLE | Compact; unverified at 320px. |
| FAB | 🔵 | Wired correctly; clicks not live-tested here. |
| Cookie banner | ACCEPTABLE in code | Offset is an estimate (`17rem` / `11.5rem` / `8rem`). |

**White-on-image hero:** **Not the current homepage implementation.** If production still shows it, production is **not serving this working tree**.

---

## 9. About page audit (`/over-ons`, `AboutPage.tsx`)

Communicates:

| Question | Answered? |
|---|---|
| Who | Yes — installer, four services |
| Where based | Yes — Oude Pekela address |
| Where it works | Yes — Noord-Nederland / GR / DR / FR |
| What services | Yes + `RelatedServices` |
| What work looks like | Partially — own airco photos, no people |
| Why contact | Soft — process + “bereikbaar”, no claims |

Excess whitespace: section padding reduced in the mobile pass (`section-y` `py-10`). Still a long page. **No invented founding year or team.**

---

## 10. Contact page audit (`/contact`)

| Item | Evidence |
|---|---|
| Address / phone / email | `ContactDetails` ← `business.ts` |
| Hours | Written on the page; matches `openingHours` |
| Social | Facebook, Instagram, TikTok, Google (LinkedIn empty → hidden) |
| Form | `ContactForm.tsx` → `contactService.ts` → `POST /api/contact` |
| Validation | name, email, message, optional phone/subject, privacy checkbox |
| Success | `FormSuccess` only if `confirmedByServer` from API |
| Error | API down → Dutch error, **no fake success** |
| Privacy placeholder | **Not found.** No “tijdelijke tekst” in `legal.ts` or contact page |
| Image | None in hero |
| Admin / email | Implemented in Worker; **not live-verified** |

---

## 11. Quote / offerte audit (`/offerte-aanvragen`)

### User flow (code)

1. Service buttons (`QuoteForm` step 0)
2. Situation (`situationsFor`)
3. Details: name, phone (`type=tel` + `inputMode=tel`), email (`type=email` + `inputMode=email`), optional address `<details>`, note, photo picker, contact method, privacy
4. Review + Wijzigen
5. Submit with UUID `idempotencyKey`, honeypot `website`
6. Loading / lock
7. Success only after JSON `ok` from Worker
8. Error / `emailWarning` surfaced if mail skipped/failed

### Backend (`createQuote` in `worker/src/routes/public.ts`)

- Privacy + honeypot
- D1 `quote_requests` insert (`situation` column needs migration 0005)
- `findOrCreateCustomer`
- Admin mail + customer `tpl-quote-received-customer`
- `emailOutcome` warning

### What is **not** implemented

- Photo **bytes are not uploaded**. `photos.ts` keeps name/size/type only. Privacy page states this.
- Live D1 persistence: 🔵
- Admin list of the new row: 🔵 (code path exists)
- Customer/admin inbox: 🔵

**Flow stops if:** Worker/API not reachable (frontend error); remote D1 missing `situation` / `submission_keys` (500); Resend missing (row can still save, warning shown).

---

## 12. Appointment / afspraak audit (`/afspraak-maken`)

### User flow (code)

1. Service
2. `type="date"` (min/max from `/api/appointments/config`)
3. Slots from `/api/appointments/slots?date=` — **empty array if none; no invented times**
4. Details + address + privacy
5. Review
6. POST `/api/appointments`

Timezone formatting: `Europe/Amsterdam` (`worker/src/routes/public.ts`, `src/admin/labels.ts`).

Statuses in admin labels: `pending`, `requested` (alias), `confirmed`, `cancelled`, `completed`, `declined`.

Worker `APPOINTMENT_STATUSES`: `pending`, `requested`, `confirmed`, `cancelled`, `completed` — **`declined` is labeled in UI but not in the Worker allow-list** (`worker/src/routes/admin.ts`). Unique index still treats `declined` as free (0001).

Public create writes **`pending`**.

On admin confirm → template `tpl-appointment-confirmed`. On cancel → `tpl-appointment-cancelled`. **Completed does not send mail** (code).

**Calendar sync:** NOT IMPLEMENTED.

**Duplicate slot:** unique index + `assertSlotFree`.

Live slot API: 🔵 (a preview terminal log earlier showed `/api/appointments/config` proxy errors when the Worker was down).

---

## 13. Admin panel audit

| Area | Exists | Accessible in code | Functional evidence | Visual | Empty/loading/error |
|---|---|---|---|---|---|
| Login | yes | `/blackberry97/login` | PBKDF2 + HMAC cookie | utilitarian | 503 if no `ADMIN_SESSION_SECRET` |
| Session | yes | `GET /api/admin/session` | cookie `gin_admin_session` | — | 401 expired |
| Dashboard | yes | yes | SQL counts | admin CSS | skeletons exist |
| Appointments | yes | yes | list/detail/new/status | OK for internal | empty states |
| Quotes | yes | yes | list/detail/status | OK | yes |
| Contacts | yes | yes | list/detail/status | OK | yes |
| Customers | yes | yes | by email reuse | OK | yes |
| Emails compose | yes | yes | preview + send | OK | skipped/failed messages |
| Email logs | yes | yes | needs 0004 columns for rich fields | OK | fallbacks in `insertLog` |
| Templates | yes | yes | D1 | OK | yes |
| Settings | yes | yes | horizon, duration, buffer, from_email | OK | yes |
| Logout | yes | yes | clears cookie | — | — |
| Mobile admin nav | `AdminLayout.tsx` | drawer CSS exists | 🔵 | not a public-quality UI | — |

**Does admin reflect submissions?** **In code, yes**, if the same D1 is used and migrations match. **Not verified against live data.**

Cookie flags: `HttpOnly`, `SameSite=Lax`, `Secure` **only when `ENVIRONMENT === 'production'`**. Default deploy env is `development` → **Secure likely off**.

---

## 14. Database / D1 audit

**Do not create another database.**

| | |
|---|---|
| Name | `greeninstallatie` |
| ID | `f0728db7-edb9-438c-9a64-5d04ee828137` |
| Binding | `DB` |
| Other DB names in Wrangler | **None found** |

### Migrations

| File | Role | Local (this machine) | Remote |
|---|---|---|---|
| `0001_initial_schema.sql` | Core tables + slot seed + core templates | Applied (list empty) | UNKNOWN |
| `0002_admin_templates.sql` | Extra templates | Applied locally | UNKNOWN |
| `0003_appointment_v1.sql` | pending rename + slot settings | Applied locally | UNKNOWN |
| `0004_email_center.sql` | template/log columns + compose templates | Applied locally (file untracked) | UNKNOWN; **do not assume** |
| `0005_request_reliability.sql` | `submission_keys`, `subject`, `situation`, related log cols, cancelled template | Applied locally (file untracked) | UNKNOWN; comment says do not apply remotely unless asked |

### Tables (0001 + later)

`admins`, `sessions`, `customers`, `appointments`, `appointment_slot_rules`, `contact_submissions` (+ `subject` in 0005), `quote_requests` (+ `situation` in 0005), `email_templates` (+ purpose/description/compose in 0004), `email_logs` (+ richer cols in 0004/0005), `settings`, `submission_keys` (0005).

Appointment default in 0001: `requested`. 0003 updates existing rows to `pending`. New public inserts use `pending`.

Remote inspect command used: `npx wrangler d1 migrations list greeninstallatie --remote` → **7403 unauthorized**. No schema was modified.

---

## 15. Resend / email audit

| Item | Evidence |
|---|---|
| Call site | `fetch('https://api.resend.com/emails')` in `worker/src/email.ts` `sendEmail` |
| Secret | `env.RESEND_API_KEY` — Worker only. No `VITE_RESEND_*` |
| If missing | status `skipped`, submission still stored, `emailWarning` |
| If HTTP/network fail | status `failed`, same |
| From | D1 `settings.from_email` or `info@greeninstallatienoord.nl` |
| Admin recipient | hardcoded `info@greeninstallatienoord.nl` in public routes |
| Customer mail | contact thank-you; quote received; appointment received |
| HTML | `emailLayout.ts` branded layout; user text escaped via `textToHtml` |
| Logs | `email_logs` including optional `provider_message_id` |
| Delivery = inbox | **NOT CLAIMED.** Log `sent` means Resend accepted the API call |
| Domain verified | UNKNOWN |
| Secret configured on CF | UNKNOWN (`.dev.vars` gitignored; not printed) |

---

## 16. Cloudflare / Wrangler audit

### Working-tree `wrangler.toml`

- `name = "greengang"`
- `main = "worker/src/index.ts"`
- `compatibility_date = "2026-09-01"`
- `compatibility_flags = ["nodejs_compat"]`
- `[assets] directory = "./dist"`, `binding = "ASSETS"`, `not_found_handling = "single-page-application"`, `run_worker_first = ["/api/*"]`
- Default vars: `ENVIRONMENT=development`, `PUBLIC_SITE_URL=https://development.greeninstallatienoord.nl`, `ADMIN_BASE_PATH=/blackberry97`
- `[env.preview]` and `[env.production]` both use apex `https://greeninstallatienoord.nl` and the **same D1 ID**
- Observability enabled

### Committed `wrangler.toml` (HEAD)

- `name = "greeninstallatienoord-api"`
- **No assets block**
- `PUBLIC_SITE_URL=http://localhost:5173`

### Hostnames mentioned in docs / conversation

| Host | Repo evidence | Live status |
|---|---|---|
| `development.greeninstallatienoord.nl` | default `PUBLIC_SITE_URL` | UNKNOWN |
| `greeninstallatienoord.nl` | production/preview vars, canonical tags | UNKNOWN |
| `greengang.chartsbezorgd.workers.dev` | **not in current wrangler.toml** | UNKNOWN |

### Deploy command in `package.json`

```
npm run deploy  →  npm run build && wrangler deploy --env=""
```

`--env=""` deploys the **top-level (default) Worker**, **not** `[env.production]`. Consequences:

- `ENVIRONMENT=development` → session cookie **without** `Secure`
- Admin email links use `https://development.greeninstallatienoord.nl/blackberry97/...`
- CORS extras include localhost + development host; apex is **not** in `allowedOrigins` unless it equals `PUBLIC_SITE_URL`. Same-origin Worker+assets avoids CORS; split origins would break credentials.

---

## 17. Deployment failure audit (Assets / SPA loop)

### Cause (verified in git)

Committed `public/_redirects`:

```
/*    /index.html   200
```

plus `public/_routes.json` include `/*` exclude `/api/*`.

Workers Assets `not_found_handling = "single-page-application"` **also** serves `index.html` for unknown paths. Combining both is the documented Cloudflare **100324** infinite rewrite (docs/cloudflare-architecture.md, docs/environment-variables.md).

Worker `index.ts` does **not** implement its own `.html` / `/index` strip loop.

### Is the problem still present?

| Artifact | HEAD commit | Working tree |
|---|---|---|
| `public/_redirects` | present (loop risk) | **deleted** |
| `public/_routes.json` | present | **deleted** |
| `[assets]` SPA | absent | present |
| Worker HTML redirect | absent | absent |

**In the working tree the known loop source is removed.**  
**Whether a deploy of this tree succeeds is UNKNOWN** (not run).

### What to change after a fix (guidance only — not done)

- Keep `_redirects` / `_routes.json` **out**.
- Deploy: `npm run build && wrangler deploy` (decide default vs `--env production` explicitly).
- Do not change D1 name/ID, admin path, or invent a second database.

### What not to change

- `database_id`, `database_name`, binding `DB`
- `ADMIN_BASE_PATH=/blackberry97`
- Do not restore `/* /index.html 200`

---

## 18. Navigation / button / link audit

### FAB (code)

All three actions are real links (see §6.4). **Clicks not live-tested here → 🔵**

### Phone / email

- `tel:+31628739134` in TopBar, menu, CtaPair, footer, FAB
- `mailto:info@greeninstallatienoord.nl` in menu, footer, contact

### Social (`SocialLinks` ← `socialEntities`)

| Network | URL in `business.ts` | Shown |
|---|---|---|
| Facebook | `https://www.facebook.com/p/Green-installatie-Noord-61565091255871/` | yes if URL set |
| Instagram | `https://www.instagram.com/greeninstallatie/` | yes |
| TikTok | `https://www.tiktok.com/@greeninstallatie` | yes |
| Google | `https://share.google/J8R5hnJqhHtfqzINQ` | yes |
| LinkedIn | `''` | no |
| WhatsApp | `''` | no |

URLs are **in the repo**. External profile validity: 🔵 (not opened).

### Quote / appointment / contact submits

Implemented as `fetch` + `credentials: 'include'`. **Not end-to-end tested in this audit.**

---

## 19. Cookie / privacy / legal audit

| Item | State |
|---|---|
| Banner | `CookieBanner.tsx` — “Kies uw cookievoorkeuren” |
| Storage | `localStorage` key `gin-consent-v2` |
| Optional scripts | `scripts: []` — **none registered** |
| Analytics/marketing load before consent | **No.** `initOptionalScripts` is a no-op |
| “Alles accepteren” | Only flips categories that have registered scripts (none) |
| Preference UI | Analytics/marketing toggles hidden when unused (`hasOptionalScripts()`) |
| Admin cookie | `gin_admin_session` — visitors of the public site do not get it |
| Drafts | `sessionStorage` via `useSessionDraft` |
| Privacy page | Factual; **Requires legal/business verification** for retention and legal bases wording |
| Cookie page | Matches implementation |
| Terms | Short; **not a complete AV set** — Requires legal/business verification |
| Disclaimer | No fake scores |
| Placeholder “tijdelijke tekst” | **Not found** in current legal/contact copy |

Third parties named in legal copy: Cloudflare, Resend. Social platforms only via outbound links.

---

## 20. SEO / content audit

| Item | State |
|---|---|
| Titles / descriptions | `src/data/seo.ts` + `PageMeta` / `useSeo` |
| Canonical | `https://greeninstallatienoord.nl` in `index.html` and SEO helpers |
| OG | `/og-image.jpg` 1200×630 |
| H1 | One H1 per page pattern via `Heading` / heroes |
| Alt | Project photos have Dutch alts in `media.ts`; home hero img `alt=""` + `sr-only` text |
| Sitemap | `public/sitemap.xml` + generator `src/lib/sitemap.ts` (keep in sync) |
| Robots | Allow `/`, Disallow `/blackberry97`, sitemap apex |
| JSON-LD | `localBusinessJsonLd`, `websiteJsonLd`, FAQ/service helpers |
| Area pages | `areas[]` empty — no thin doorway cities |
| Keyword stuffing | Low |
| Invented reviews/stats/brands/warranties | Avoided in public copy |
| Docs vs code | `docs/assets.md` and some architecture docs are outdated |

Positioning language matches the required distinction (gevestigd vs actief).

---

## 21. Content quality (Dutch)

Strengths: nuchter, no fake SLAs, no prices, no “officieel gecertificeerd”.

Weaknesses:

- Homepage Experience + Why + Process repeat “eerst de woning”.
- About is honest but thin (no people, no timeline — by policy).
- Terms are too short for a full commercial AV.
- Service pages explain *when* and *how to ask*, not deep technical install steps (intentional).
- `business.ts` still has `TODO: Confirm postcode` (9665 GN is the supplied value).

No “tijdelijke tekst” on contact/privacy in the current tree.

---

## 22. Mobile-first audit

Implemented in the latest working-tree pass (code):

- Compact top bar; 44px menu; slide-over
- Split heroes; stacked green/outline/phone CTAs
- `text-base` inputs (anti-zoom); `min-h-12` fields; `min-h-11` buttons
- FAB vs cookie/nav
- Tighter `section-y` and footer stack
- Cookie offset CSS variables

**Not verified at 320 / 360 / 375 / 390 / 430 / 768 / desktop widths in this audit.**

Residual risks: cookie height estimate; top-bar hour truncation; cert 2×2 grid; appointment sticky footer + cookie; iOS `date` UI; landscape short viewports vs FAB menu `max-height`.

---

## 23. Accessibility audit

Present in code: skip link, focus-visible outline, dialog/menu ARIA, focus trap, Escape, `sr-only` labels, reduced-motion rules, form `aria-invalid` / `role="alert"`, 44px targets, `inert` on closed mobile menu.

Gaps / 🔵:

- Live keyboard pass not done
- Outline/ghost buttons on `brand-deep` contrast
- Footer `white/70` on deep green — better than `/45`, not measured
- Home hero decorative `alt=""` relies on `sr-only`
- Admin is not a polished a11y product
- `declined` status inconsistency is not an a11y issue

---

## 24. Performance audit

| Evidence | Note |
|---|---|
| Main JS | `index-*.js` ≈ 343 kB / 112 kB gzip |
| Images | Display JPGs 137–455 kB each; several are large for mobile |
| Hero | `fetchPriority="high"` on home image |
| Others | `loading="lazy"` via `MediaImage` |
| Code splitting | Admin and most pages are `lazy()` |
| Fonts | Four Manrope + three Newsreader files |
| Duplicates | `display/` and `work/` copies; unused hero/services/blog JPGs still on disk (not all in the JS bundle — unused imports are tree-shaken) |
| Dependencies | Small: React, Router, Lucide, Fontsource |

CLS from font/image: 🔵 not measured.

---

## 25. Security audit (code / config only)

| Topic | State |
|---|---|
| Admin URL secrecy | Hidden path only — **not** auth |
| Passwords | PBKDF2-SHA-256, 210000, random salt; no password in repo |
| Session | HttpOnly, SameSite=Lax; Secure only in `ENVIRONMENT=production` |
| CSRF | Cookie + SameSite=Lax; no CSRF token. Same-site form POST is the model |
| Secrets in frontend | No Resend/session secrets in `VITE_*` |
| SQL | Bound parameters in inspected Worker queries |
| Validation | `worker/src/validation.ts` + honeypot |
| Rate limit | In-memory per isolate (`rateLimit.ts`) — not global |
| Body cap | 80 KB |
| Error leakage | Production 500 is generic; `logSafe` avoids emails/passwords |
| CORS | Origin allow-list; credentials |
| Headers | `public/_headers` nosniff, referrer, DENY frame, permissions |
| Photos | Not sent to server (good for PII; also a product limit) |

No secrets were printed. `.dev.vars` / `.env` are gitignored.

---

## 26. Build / lint / typecheck (this audit)

| Command | Status |
|---|---|
| `npm run lint` | **PASS** |
| `npm run build` (`tsc -b` + Vite) | **PASS** |
| Frontend typecheck | **PASS** (via `tsc -b` inside build; no separate `typecheck` script) |
| `npm run typecheck:api` | **PASS** |
| Unit/E2E test script | **NOT AVAILABLE** (none in `package.json`) |
| `npm run deploy` | **NOT RUN** |

Build output: 2049 modules; hashed display images included; admin and form pages split.

---

## 27. Current status matrix

| Area | Status | Evidence | Works | Does not / unknown | Remains | Priority |
|---|---|---|---|---|---|---|
| Homepage | 🟡 | Code + build | Renders in bundle | Live look | Visual QA | P1 |
| Header / mobile header | 🟡 | Components exist | Structure | Device QA | 320px hours | P1 |
| Navigation | 🟡 | `navigation.ts` | Links compile | Click QA | — | P2 |
| Hero | 🟡 | Split layout | Contrast architecture | Pixel contrast | Crop QA | P1 |
| Services | 🟡 | Four pages | Copy honest | Live | — | P2 |
| About | 🟡 | `AboutPage` | Facts | Thin story | Optional photos | P2 |
| Contact | 🟡 | Form + API code | Client validation | Live POST/mail | E2E | P0 |
| Quote flow | 🟡 | Wizard + Worker | No fake success | Live D1/mail | Remote 0005 | P0 |
| Appointment flow | 🟡 | Slots API + pending | No fake slots | Live slots | Worker up | P0 |
| Admin | 🟡 | Full shell | Code paths | Live login | Admin user | P0 |
| Authentication | 🟡 | PBKDF2 + cookie | Designed | Live secret/user | Secure flag on default env | P0 |
| D1 | 🟡 | Local applied | Local list empty | Remote 7403 | Apply 0004/0005 if needed | P0 |
| Resend | 🟡 | `sendEmail` | Fail-soft | Inbox | Domain + key | P0 |
| Email templates | 🟡 | D1 + `templates.ts` | CRUD code | Live send | — | P1 |
| Cookie banner | 🟡 | v2 + empty scripts | No pre-consent trackers | Height vs FAB | Measure | P2 |
| Privacy / cookies / terms / disclaimer | 🟡 | `legal.ts` | No temp copy | Legal review | AV completeness | P2 |
| Gallery `/werk` | 🟡 | Real photos | Wired | Crops | — | P2 |
| Knowledge base | 🟡 | Blog data | Indexable | — | — | P3 |
| Footer | 🟡 | Compact stack | Links present | 320 height | — | P2 |
| Social | 🟡 | URLs in repo | Rendered | Profiles live | — | P3 |
| FAB | 🟡 | Three actions | Wired | Click QA | — | P1 |
| SEO | 🟡 | Meta + sitemap | Consistent NAP | Live crawl | Sync xml if routes change | P2 |
| Accessibility | 🟡 | ARIA/focus code | Patterns | Audit pass | Contrast measure | P2 |
| Performance | 🟡 | Build stats | Split + lazy | Large JPGs | Compress later | P3 |
| Deployment | 🔴/🔵 | Loop source removed; deploy not run | Build | Live Worker | Deploy + smoke | P0 |
| Cloudflare Assets | 🟡 | Config looks correct | — | Live upload | Keep `_redirects` gone | P0 |
| Mobile | 🟡 | Pass in code | — | Screenshots | Device lab | P1 |
| Image system | 🟡 | `media.ts` | Display set | Unused dumps | Don’t rewire dumps | P2 |
| Certifications | 🟡 | Marks ≠ approved certs | Honest captions | Visitor confusion | Business verify | P1 |

---

## 28. Page-by-page scorecard

Scores are **code + content** assessments, **not** live visual scores. A page that only compiles does not get an 8.

| Page | Visual | UX | Content | Mobile | A11y | Func | Images | SEO | Overall |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 6 | 6 | 7 | 6 | 6 | 5 | 6 | 7 | Almost ready |
| `/cv-ketel` | 6 | 6 | 7 | 6 | 6 | 5 | 7 | 7 | Almost ready |
| `/airco` | 6 | 6 | 7 | 6 | 6 | 5 | 7 | 7 | Almost ready |
| `/warmtepomp` | 6 | 6 | 7 | 6 | 6 | 5 | 7 | 7 | Almost ready |
| `/service-onderhoud` | 6 | 6 | 7 | 6 | 6 | 5 | 7 | 7 | Almost ready |
| `/over-ons` | 6 | 6 | 6 | 6 | 6 | 5 | 5 | 6 | Almost ready |
| `/werk` | 6 | 6 | 7 | 6 | 6 | 6 | 7 | 6 | Almost ready |
| `/werkgebied` | 6 | 6 | 7 | 6 | 6 | 6 | 4 | 6 | Almost ready |
| `/werkgebied/:plaats` | — | — | — | — | — | 8* | — | — | *404 by design |
| `/blog` | 6 | 6 | 7 | 6 | 6 | 6 | 6 | 6 | Almost ready |
| `/contact` | 6 | 7 | 7 | 6 | 7 | 5 | 3 | 6 | Almost ready |
| `/offerte-aanvragen` | 6 | 7 | 7 | 6 | 7 | 5 | 3 | 6 | Almost ready |
| `/afspraak-maken` | 6 | 7 | 7 | 6 | 7 | 5 | 3 | 6 | Almost ready |
| `/veelgestelde-vragen` | 6 | 7 | 7 | 6 | 6 | 6 | 3 | 6 | Almost ready |
| Legal pages | 5 | 6 | 6 | 6 | 6 | 6 | 2 | 5 | Almost ready; AV thin |
| `/blackberry97/*` | 4 | 6 | 5 | 4 | 4 | 5 | 2 | n/a | Needs verification |

Functionality scores stay at 5 where live API/D1/mail were not verified.

---

## 29. What we must not touch

Verified constraints:

- Stack: React + Vite + TypeScript + Tailwind 4 + React Router SPA
- Worker as the host for `dist/` + `/api/*` (working-tree model)
- D1 name `greeninstallatie`, ID `f0728db7-edb9-438c-9a64-5d04ee828137`, binding `DB`
- Do not create a second database
- Admin path `/blackberry97` — never in public nav/footer/sitemap
- Secrets only on the Worker (`RESEND_API_KEY`, `ADMIN_SESSION_SECRET`) — never `VITE_*`
- Verified NAP and hours in `src/data/business.ts`
- Flat service URLs: `/cv-ketel`, `/airco`, `/warmtepomp`, `/service-onderhoud`
- Empty `areas[]` until unique local copy exists
- No invented reviews, prices, warranties, years, counts, official cert claims
- Official logo artwork — do not redraw
- No em dash in **new** website copy (existing templates/SQL still contain `–` in some seed subjects)
- Do not restore `public/_redirects` → `/index.html`
- Do not apply remote migrations unless asked
- Do not deploy unless asked

### Dangerous change areas

- `wrangler.toml` Worker name (`greengang` vs old `greeninstallatienoord-api`)
- `[assets]` / `run_worker_first`
- Default vs `--env production` deploy
- Email log INSERTs that assume 0004/0005 columns
- Cookie `Secure` vs `ENVIRONMENT`
- `media.ts` object-position values
- Consent key `gin-consent-v2` (changing it re-prompts everyone)

---

## 30. Next steps (do not implement in this audit)

### P0 — Blocking

| Task | Reason | Where | Category | Deps | Risk |
|---|---|---|---|---|---|
| Preserve the working tree (commit/backup when asked) | Only one git commit; rest is local | entire tree | ops | owner | Data loss |
| Confirm Cloudflare account + Worker name + domains | Repo and live may disagree | `wrangler.toml`, dashboard | deploy | login | Deploying to the wrong Worker |
| Inspect remote D1 schema; apply 0004/0005 only if approved | New columns required by current Worker | `migrations/` | db | auth | Submit 500s |
| Confirm secrets + admin row on **that** D1 | Login and mail will not work otherwise | CF secrets, `admins` | backend | D1 | Locked out / skipped mail |
| Deploy current tree **without** `_redirects` | Loop fix untested live | `npm run deploy` vs `--env production` | deploy | build | 100324 or wrong env vars |
| Smoke-test contact/quote/appointment + admin | Code ≠ production | live | QA | deploy | Silent mail skip |

### P1 — High

| Task | Reason | Where |
|---|---|---|
| Real-device mobile pass | Last UX pass unverified | header, hero, FAB, forms, cookie |
| Decide default vs production Wrangler env | `Secure` + `PUBLIC_SITE_URL` | `wrangler.toml`, `package.json` deploy |
| Certification communication | Logos vs unapproved `trust.ts` | `TrustMarks`, legal |
| Resend domain + inbox test | Customers will not get mail | Resend dashboard |
| Refresh stale docs | `docs/assets.md` contradicts `media.ts` | docs |

### P2 — Important

| Task | Reason |
|---|---|
| Compress / resize display JPGs | 400KB+ heroes |
| Deduplicate `work/` vs `display/` | Storage only |
| Legal review of AV / retention | Terms are short |
| Keyboard/contrast a11y pass | Code only |
| Remove or archive unused home components | Dead code |

### P3 — Polish

| Task | Reason |
|---|---|
| Homepage copy de-duplication | Experience/Why/Process |
| Optional about photography | No people by policy today |
| Filmstrip / rotator | Only if wanted; not required |
| Durable rate limiting | Isolate-local today |

**Recommended order:** backup → Cloudflare identity → remote schema → secrets/admin → deploy without `_redirects` → form/admin/mail smoke → phone visual QA.

---

## 31. Known failures and attempts

| What | Command / action | Result | Error | Cause | Status | Next |
|---|---|---|---|---|---|---|
| SPA + `_redirects` deploy | Historical `wrangler deploy` (not this audit) | Version deploy fail (documented) | Infinite loop / 100324 | `/* /index.html 200` + Assets SPA | Working tree deleted `_redirects`; **not redeployed** | Deploy current tree |
| Remote D1 list | `wrangler d1 migrations list … --remote` | Failed | API 7403 unauthorized | This machine’s CF account | UNKNOWN remote | Login to the owning account |
| API proxy without Worker | Observed in old `vite preview` logs | `/api/appointments/config` proxy error | Upstream 8787 down | Preview without `npm run dev:api` | Expected | Run Worker for slots |
| Live email | None in this audit | — | — | — | UNKNOWN | Send one real quote on staging |
| Browser QA of mobile pass | Not possible here | — | No browser tool | Environment | UNKNOWN | Phone + DevTools |

Historical narrative of every intermediate UI rewrite is **not fully reconstructable from git** (single commit). Conversation transcripts exist but are not a substitute for a second commit history.

---

## 32. Verification gaps

| Unknown | Why | How to verify later |
|---|---|---|
| Live production HTML/CSS | No fetch of apex; tree uncommitted | Open `https://greeninstallatienoord.nl` and compare to local |
| Development host | Not fetched | Open `https://development.greeninstallatienoord.nl` |
| workers.dev URL | Not in current wrangler | `wrangler deployments list` on the owning account |
| Remote D1 tables/columns | API 7403 | `wrangler d1 execute greeninstallatie --remote --command "SELECT name FROM sqlite_master…"` |
| Whether 0004/0005 are remote | Same | `wrangler d1 migrations list greeninstallatie --remote` |
| `RESEND_API_KEY` present | Secret | `wrangler secret list` (names only) + test send |
| Resend domain | Dashboard | Resend UI |
| Admin user exists | No SELECT run | Query `admins` locally and remotely |
| Session cookie on HTTPS default env | `ENVIRONMENT=development` | Inspect Set-Cookie after login |
| Inbox delivery | Not mailed | Real mailbox |
| Form E2E | Not submitted here | Local `dev` + `dev:api` then live |
| Slot occupancy | Not booked here | Create + unique index test |
| FAB / menu clicks | No browser | Click all three + tel: |
| Contrast / crops at 320–430 | No screenshots | Device lab |
| Social profile pages | URLs only | Open each |
| Certificate legal status | Logos only | Business documents |
| Postcode 9665 vs 9655 listings | TODO in `business.ts` | Written confirmation |
| Whether `greengang` is the live Worker | Working tree vs HEAD name clash | Cloudflare dashboard |

---

## 33. File reference index (selected)

| Path | Responsibility | State |
|---|---|---|
| `src/App.tsx` | Public + admin route table | Current |
| `src/layouts/RootLayout.tsx` | Header/main/footer/cookie/FAB | Current |
| `src/pages/HomePage.tsx` | Home composition | Current |
| `src/components/home/HomeHero.tsx` | Split hero | Current |
| `src/components/layout/Header.tsx` | Sticky header + menu state | Current |
| `src/components/layout/MobileMenu.tsx` | Slide-over | Current |
| `src/components/layout/FloatingContactMenu.tsx` | FAB | Current |
| `src/components/layout/Footer.tsx` | Footer | Current |
| `src/components/CtaPair.tsx` | Primary/secondary/phone | Current |
| `src/data/business.ts` | NAP | Current; postcode TODO |
| `src/data/media.ts` | Image catalog | Current |
| `src/data/legal.ts` | Legal copy | Current; no temp text |
| `src/data/areas.ts` | `areas = []` | Current |
| `src/lib/consentManager.ts` | Consent v2 | Current |
| `src/lib/leadService.ts` | Quote API, no fake success | Current |
| `src/lib/contactService.ts` | Contact API | Current |
| `src/lib/bookingService.ts` | Appointment API | Current |
| `worker/src/index.ts` | Fetch router + ASSETS | Current |
| `worker/src/routes/public.ts` | Public writes + mail | Current |
| `worker/src/routes/admin.ts` | Admin API | Current |
| `worker/src/auth.ts` | Sessions | Current |
| `worker/src/email.ts` | Resend | Current |
| `wrangler.toml` | Worker/assets/D1 | **Diverges from HEAD** |
| `migrations/0005_request_reliability.sql` | Idempotency + extra cols | Local; remote unknown |
| `docs/assets.md` | Asset doc | **Stale** |
| `docs/cloudflare-architecture.md` | Stack notes | Partially stale (forms-without-API claim) |
| `public/_redirects` | SPA rewrite | **Removed in working tree** |

---

## 34. Final quality checklist

1. What exists? — Full SPA + Worker + D1 schema + admin + legal + photos.  
2. What changed? — Almost everything after `17f7b71` is uncommitted.  
3. What works? — **Local compile.** Local migrations applied.  
4. What doesn’t? — Verified live deploy, remote D1 access from here, proven inbox mail.  
5. Partial? — Forms, admin, email, mobile UX, certs.  
6. Attempted? — Assets deploy; remote D1 list.  
7. Failed? — SPA redirect loop (historical); remote D1 7403 (this audit).  
8. Why? — `_redirects` + Assets; wrong/unauthorized CF account.  
9. Visually wrong? — Unverified; old white-on-photo **not** current home code.  
10. Visually good? — Architecture of split heroes and real project photos is sound **on paper**.  
11. Pages needing work? — Live QA all; AV; about thinness; cert communication.  
12. Bad image use? — Home airco-for-all-services; unused dumps; stale docs.  
13. Backend? — Complete in source.  
14. Database? — Local yes; remote unknown.  
15. Email? — Implemented, not delivered-proven.  
16. Admin? — Built, not live-proven.  
17. Deploy? — Config fixed in tree; not shipped.  
18. Remaining? — See P0–P3.  
19. Must not change? — See §29.  
20. Next agent first job? — **Do not redesign.** Confirm deploy identity, D1 remote schema, secrets, then smoke-test. Preserve the working tree.

---

*End of master audit. This file is the handover context. It is not a claim that the live website currently matches this repository.*

# Legal review notes (internal)

Developer-only notes for Green Installatie Noord legal pages.  
**Do not publish this file on the public site or quote it as legal advice.**

Last reviewed in codebase: 2026-09-13

## Determination: distance contracts / herroepingsrecht

Public website flows (`/contact`, `/offerte-aanvragen`, `/afspraak-maken`) create **requests only**.

Evidence:
- UI and confirmation e-mails state that a preferred slot / quote request is not a confirmed appointment or order.
- Worker appointment status starts as `pending`.
- Existing terms and e-mail templates: “nog geen opdracht / nog geen definitieve afspraak”.

**Conclusion:** Do **not** add an online herroepingsformulier button to website request flows. Cooling-off information in the AV applies only when a distance agreement is later concluded (e.g. written/digital acceptance of a quotation). Owner should confirm this matches commercial practice.

## Processors detected

| Party | Role | Notes |
|--------|------|--------|
| Cloudflare | Hosting, Workers, D1, edge security | Turnstile only on **admin login** |
| Resend | Transactional e-mail | API key server-only |
| OpenStreetMap tile servers | Map tiles **after** explicit “Kaart laden” | Technical request data (e.g. IP); no auto-load on scroll |
| Self-hosted fonts | Manrope / Newsreader via Fontsource | No Google Fonts request |
| Social platforms | Outbound links only | No embeds/pixels |

No Google Analytics, Meta Pixel, TikTok Pixel, or chat widget found.

## Cookies / storage detected

See `src/config/cookies.ts` (canonical).

Public: `gin-consent-v2`, form drafts in sessionStorage, Cloudflare edge, OSM when map used.  
Admin: `gin_admin_session`, Turnstile, `gin-admin-email-draft`.

## Retention

See `src/config/retention.ts`. These are **operational guidelines**, not yet backed by automated D1 purge jobs. Owner should confirm periods and whether automated deletion should be implemented.

## Items needing owner confirmation

1. **BTW / VAT number** — not present in `business.ts`; do not invent.
2. **Postcode** — `9665 GN` is configured; comment notes possible listing variance.
3. **Retention periods** — confirm or adjust `src/config/retention.ts`.
4. **International transfers** — privacy text is conservative re Cloudflare/Resend; confirm DPA / transfer mechanisms with providers.
5. **Quote photo metadata** — binary not uploaded; request body may still include filename/size/type. Confirm whether client should stop sending photo metadata entirely.
6. **Guarantee periods** — intentionally not hardcoded in AV; confirm they appear on quotations.
7. **Emergency / 24/7 service terms** — business flag exists; commercial terms of emergency call-outs should be confirmed.
8. **Final review by a Dutch lawyer** — especially AV liability, payment, cooling-off, and consumer clauses.

## Assumptions made in copy

- Forms do not create binding contracts.
- No analytics/marketing scripts will load until registered in `consentManager`.
- No newsletter exists.
- Company identity from `src/data/business.ts` is authoritative.
- Legal pages may be indexed (SEO); previously `noIndex` — changed for transparency unless owner prefers noindex.

## Clauses that especially need professional legal review

- Limitation of liability (AV)
- Cooling-off / exceptions for services and urgent repair
- Late payment / statutory collection costs
- Retention of title
- International data transfers wording

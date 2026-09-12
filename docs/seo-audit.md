# SEO audit (12 September 2026)

Scope: on-site SEO, local entity, NAP, internal links, structured data. No fake listings or backlinks.

## Titles, descriptions, canonicals, H1

| Route | Title source | H1 | Canonical | Index |
| --- | --- | --- | --- | --- |
| `/` | `Green Installatie Noord` | Comfort en techniek, vakkundig geregeld. | site URL + path | yes |
| `/cv-ketel` | CV-ketel installeren of vervangen | CV-ketel installatie | yes | yes |
| `/airco` | Airconditioning laten installeren | from service hero | yes | yes |
| `/warmtepomp` | Warmtepomp advies en installatie | from service hero | yes | yes |
| `/service-onderhoud` | CV-ketel onderhoud en service | from service hero | yes | yes |
| `/over-ons` | Over Green Installatie Noord | Over Green Installatie Noord | yes | yes |
| `/werkgebied` | Werkgebied | Werkgebied | yes | yes |
| `/werkgebied/:plaats` | 404 until unique copy exists | — | noindex 404 | no |
| `/blog` | Kennisbank… | Kennisbank | yes | yes |
| `/blog/categorie/*` | category SEO | category title | yes | yes |
| `/blog/:slug` | article title | article title | yes | yes |
| `/contact` | Contact met Green Installatie Noord | Contact | yes | yes |
| `/offerte-aanvragen` | Offerte aanvragen… | Offerte aanvragen | yes | yes |
| `/afspraak-maken` | Afspraak maken… | Afspraak maken | yes | yes |
| `/veelgestelde-vragen` | Vragen over… | Veelgestelde vragen | yes | yes |
| Legal routes | document title | document title | yes | **noindex** |

Canonicals and robots are set in `applySeo`. Legal paths are disallowed in `robots.txt` and omitted from the sitemap.

## Sitemap and robots

- `public/robots.txt` allows the site, disallows legal stubs, points to `https://greeninstallatienoord.nl/sitemap.xml`.
- `public/sitemap.xml` is regenerated at build from `getIndexableEntries()` (static pages, categories, articles, only local pages that have unique copy).

## Structured data

- Home: `WebSite` + `LocalBusiness`/`HVACBusiness` (`@id` `https://greeninstallatienoord.nl/#business`).
- Contact and about: same LocalBusiness `@id` (NAP reinforcement, no extra claims).
- Services: `Service` + `FAQPage` when FAQs exist; provider points at `#business`.
- Articles: `Article` + optional `FAQPage` + `citation` for official sources.
- Every `PageHero` page: `BreadcrumbList`.
- `sameAs`: Facebook only. Instagram, LinkedIn and GBP stay empty until verified.
- Not included: ratings, review counts, opening hours, geo coordinates, certifications.

## NAP

Single source: `src/data/business.ts`.

- Name: Green Installatie Noord
- Phone display: 06 28 73 91 34
- Phone international: +31 6 28 73 91 34
- tel: +31628739134
- Address: Burgemeester van Weringstraat 23, 9665 GN Oude Pekela
- Region in schema only: Groningen
- No 9655 postcode on the site

## Social and GBP

- Facebook linked in footer/contact and `sameAs`.
- GBP alignment object: `gbpAlignment` in `business.ts` (name, address, phone, website, suggested categories, description). Profile URL empty.
- Do not invent other profiles.

## Internal link graph

| From | To |
| --- | --- |
| Home | All four services, kennisbank gidsen, FAQ, contact, quote/appointment CTAs |
| Service pages | Quote, appointment, related services, related articles, FAQ, category |
| Blog articles | Related services, related articles, FAQ, official sources, CTAs |
| FAQ | Services, kennisbank, CTA |
| Contact | Quote/appointment, services, FAQ |
| Quote | Services, contact, FAQ, offerte-voorbereiden |
| Appointment | Contact, quote, FAQ |
| Footer | Services, company, legal |

Legal pages are noindex by design; they are linked from the footer so they are not orphans for users.

## External links

Only official government, consumer-education or industry homepages (Rijksoverheid, RVO, Milieu Centraal, ILT, Techniek Nederland). `rel="noopener noreferrer"` on new tabs. No directory farms.

## Open items (not defects)

- GBP URL still unknown.
- KvK number not on the site.
- Opening hours unpublished.
- Local city pages unpublished (by design, to avoid doorway pages).
- Forms do not claim server receipt until a backend exists.

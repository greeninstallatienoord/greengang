# Page architecture

Every new page uses the same structure and shared components. Do not invent a second layout, palette, or CTA language.

## Global shell

`RootLayout` always renders the same header, main, footer, mobile action bar and cookie UI.

Standard inner pages then follow this order:

1. Header (layout)
2. Breadcrumbs + page hero (`PageHero`)
3. Main content
4. Supporting content
5. Trust (`TrustSection` or `WhyChoose`) when relevant
6. Related services / articles
7. Conversion CTA (`CTASection` or `PhoneFallback` on form pages)
8. Footer (layout)

Not every block is required visually. The order must stay coherent.

## Shared building blocks

| Need | Use |
| --- | --- |
| Hero + breadcrumbs | `src/components/page/PageHero.tsx` |
| FAQ block | `PageFaq` |
| Related services | `RelatedServices` |
| Related articles | `RelatedArticles` |
| Why this company | `WhyChoose` |
| Closing conversion | `CTASection` |
| Phone alternative on forms | `PhoneFallback` |
| Primary / secondary / tertiary buttons | `CtaPair` |
| Tokens | `src/data/tokens.ts` and `src/index.css` `@theme` |

Do not add a page-level colour system, custom heading scale, or new button labels.

## CTA hierarchy

Defined in `tokens.cta` and exposed as `site.copy.ctaQuote` / `ctaAppointment` / `ctaCall`:

1. Offerte aanvragen (primary)
2. Afspraak maken (secondary)
3. Bel ons (tertiary / ghost)

## Templates

### Service

`ServicePage` — required for `/cv-ketel`, `/airco`, `/warmtepomp`, `/service-onderhoud`.

Breadcrumb → hero → introduction → benefits → includes → who it is for → process → technical notes → trust → FAQ → related services → related articles → quote + appointment CTA.

### Blog article

`ArticleTemplate` — breadcrumb → category → title → intro → content + image → FAQ when present → related service → related articles → CTA.

### Local SEO

`AreaDetailPage` / `AreaServicePage`. Future cities go in `src/data/areas.ts` only when they have unique, useful copy. Unknown slugs stay 404. No thin doorway pages.

Breadcrumb → local hero → introduction → relevant services → why Green Installatie Noord → local explanation / notes → FAQ → related pages → quote + appointment CTA.

### Contact

`ContactPage` — hero → phone / email / address → form → hours only if verified → map/image if appropriate → FAQ → related services → quote CTA.

### Quote

`QuotePage` — hero → trust explanation → stepped form (privacy in the last step) → success state in the form → phone fallback.

### Appointment

`AppointmentPage` — hero → service selection and preference in `AppointmentFlow` → date/time placeholder (no invented slots) → details → confirmation → phone fallback.

### Home

Home is the landing page. It keeps a unique hero but uses the same header, footer, eyebrow class, `CtaPair` labels and `CTASection`.

### Legal

Hero + body. No marketing claims. `noindex`. Link to contact; cookie page may open preferences.

## Adding a page

1. Reuse a template above or compose `PageHero` + `Section` + `Container` + existing sections.
2. Pull facts from `src/data/business.ts` / `services.ts` / `faq.ts`. Do not invent claims.
3. Use `CtaPair` / `CTASection` for conversion.
4. Keep routes in the router; unknown local URLs must 404.

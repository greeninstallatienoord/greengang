/**
 * Central cookie / storage registry for Green Installatie Noord.
 * Cookiebeleid and consent UI must derive from this list — do not duplicate.
 */

export type CookieCategory = 'necessary' | 'preferences' | 'analytics' | 'marketing'

export type StorageKind = 'http-cookie' | 'localStorage' | 'sessionStorage' | 'script' | 'server'

export type CookieRegistryItem = {
  id: string
  name: string
  provider: string
  purpose: string
  category: CookieCategory
  /** Technical type (HTTP cookie, storage, script, server). */
  storage: StorageKind
  /** Retention / lifetime description. */
  lifetime: string
  consentRequired: boolean
  party: 'first' | 'third'
  privacyUrl?: string
  /** Who sees this: public visitors, admin only, or both */
  audience: 'public' | 'admin' | 'both'
  active: boolean
}

/** Alias helpers so policy UI and settings share the same field names. */
export function cookieType(item: CookieRegistryItem): StorageKind {
  return item.storage
}

export function cookieRetention(item: CookieRegistryItem): string {
  return item.lifetime
}

export const cookieCategories: Record<
  CookieCategory,
  { label: string; description: string }
> = {
  necessary: {
    label: 'Noodzakelijk',
    description:
      'Nodig om de website veilig te laten werken, formulierconcepten te bewaren en uw cookiekeuze te onthouden. Deze vereisen geen toestemming.',
  },
  preferences: {
    label: 'Voorkeuren',
    description:
      'Optioneel. Alleen relevant als er later een voorkeursscript wordt aangesloten. Op dit moment niet actief.',
  },
  analytics: {
    label: 'Analytisch',
    description:
      'Optioneel. Alleen relevant als er later een meetprogramma wordt aangesloten. Op dit moment niet actief.',
  },
  marketing: {
    label: 'Marketing',
    description:
      'Optioneel. Alleen relevant als er later advertentie- of remarketingtags worden aangesloten. Op dit moment niet actief.',
  },
}

export const cookieRegistry: CookieRegistryItem[] = [
  {
    id: 'consent',
    name: 'gin-consent-v2',
    provider: 'Green Installatie Noord',
    purpose:
      'Onthoudt uw cookievoorkeuren (categorieën, beleidversie, tijdstip en bron van de keuze) in deze browser, zodat de cookiemelding niet bij elk bezoek terugkomt. Geen onnodige persoonsgegevens.',
    category: 'necessary',
    storage: 'localStorage',
    lifetime: 'Tot u de gegevens in de browser wist, de keuze wijzigt, of het beleid materieel wijzigt',
    consentRequired: false,
    party: 'first',
    audience: 'public',
    active: true,
  },
  {
    id: 'contact-draft',
    name: 'gin-contact-draft',
    provider: 'Green Installatie Noord',
    purpose:
      'Tijdelijk concept van een onvoltooid contactformulier, zodat u niet alles opnieuw hoeft in te vullen.',
    category: 'necessary',
    storage: 'sessionStorage',
    lifetime: 'Tot het tabblad of de browsersessie wordt gesloten, of tot u het formulier verstuurt',
    consentRequired: false,
    party: 'first',
    audience: 'public',
    active: true,
  },
  {
    id: 'quote-draft',
    name: 'gin-quote-draft',
    provider: 'Green Installatie Noord',
    purpose:
      'Tijdelijk concept van een onvoltooide offerteaanvraag (inclusief eventuele bestandsnamen van geselecteerde foto’s in de browser).',
    category: 'necessary',
    storage: 'sessionStorage',
    lifetime: 'Tot het tabblad of de browsersessie wordt gesloten, of tot u het formulier verstuurt',
    consentRequired: false,
    party: 'first',
    audience: 'public',
    active: true,
  },
  {
    id: 'booking-draft',
    name: 'gin-booking-draft',
    provider: 'Green Installatie Noord',
    purpose: 'Tijdelijk concept van een onvoltooide afspraakaanvraag.',
    category: 'necessary',
    storage: 'sessionStorage',
    lifetime: 'Tot het tabblad of de browsersessie wordt gesloten, of tot u het formulier verstuurt',
    consentRequired: false,
    party: 'first',
    audience: 'public',
    active: true,
  },
  {
    id: 'admin-email-draft',
    name: 'gin-admin-email-draft',
    provider: 'Green Installatie Noord',
    purpose: 'Tijdelijk concept van een e-mail in het interne beheerscherm.',
    category: 'necessary',
    storage: 'sessionStorage',
    lifetime: 'Tot de browsersessie eindigt of het bericht is verstuurd',
    consentRequired: false,
    party: 'first',
    audience: 'admin',
    active: true,
  },
  {
    id: 'admin-session',
    name: 'gin_admin_session',
    provider: 'Green Installatie Noord',
    purpose:
      'Beveiligde sessie voor medewerkers die zijn ingelogd op het beheerscherm. Niet geplaatst bij gewone websitebezoekers.',
    category: 'necessary',
    storage: 'http-cookie',
    lifetime: 'Maximaal 12 uur, met idle-timeout van 2 uur',
    consentRequired: false,
    party: 'first',
    audience: 'admin',
    active: true,
  },
  {
    id: 'turnstile',
    name: 'Cloudflare Turnstile',
    provider: 'Cloudflare',
    purpose:
      'Botbescherming bij het inloggen op het beheerscherm. Laadt een script van Cloudflare Challenges. Niet gebruikt op openbare formulieren.',
    category: 'necessary',
    storage: 'script',
    lifetime: 'Volgens Cloudflare; alleen tijdens/rond admin-login',
    consentRequired: false,
    party: 'third',
    privacyUrl: 'https://www.cloudflare.com/privacypolicy/',
    audience: 'admin',
    active: true,
  },
  {
    id: 'cloudflare-edge',
    name: 'Cloudflare (technische edge)',
    provider: 'Cloudflare',
    purpose:
      'Hosting, beveiliging en uitrol van de website. Cloudflare kan technische gegevens verwerken die nodig zijn om de site te tonen en te beschermen (bijvoorbeeld IP-adres, verzoekmetadata).',
    category: 'necessary',
    storage: 'server',
    lifetime: 'Volgens Cloudflare als infrastructuurprovider',
    consentRequired: false,
    party: 'third',
    privacyUrl: 'https://www.cloudflare.com/privacypolicy/',
    audience: 'both',
    active: true,
  },
  {
    id: 'osm-tiles',
    name: 'OpenStreetMap-tegels',
    provider: 'OpenStreetMap / tile-servers',
    purpose:
      'Alleen nadat u op “Kaart laden” klikt, worden kaarttegels geladen. Daarbij kunnen technische verzoekgegevens (zoals IP-adres) bij de tegelprovider terechtkomen. Zonder die actie vinden er geen tegelverzoeken plaats.',
    category: 'necessary',
    storage: 'server',
    lifetime: 'Per kaartverzoek / volgens de tegelprovider',
    consentRequired: false,
    party: 'third',
    privacyUrl: 'https://wiki.osmfoundation.org/wiki/Privacy_Policy',
    audience: 'public',
    active: true,
  },
]

export function activeCookies(audience: 'public' | 'admin' | 'both' = 'both'): CookieRegistryItem[] {
  return cookieRegistry.filter((item) => {
    if (!item.active) return false
    if (audience === 'both') return true
    return item.audience === audience || item.audience === 'both'
  })
}

export function cookiesByCategory(
  category: CookieCategory,
  audience: 'public' | 'admin' | 'both' = 'public',
): CookieRegistryItem[] {
  return activeCookies(audience).filter((item) => item.category === category)
}

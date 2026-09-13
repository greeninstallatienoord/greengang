import { business } from '../business'

export const legalMeta = {
  companyLine: `${business.legalName}, ${business.address.street}, ${business.address.postalCode} ${business.address.city}, Nederland`,
  kvkLine: `KvK-nummer ${business.kvk}`,
  contactLine: `${business.email} · ${business.phone}`,
  addressBlock: [
    business.legalName,
    business.address.street,
    `${business.address.postalCode} ${business.address.city}`,
    'Nederland',
  ].join('\n'),
  related: [
    { label: 'Privacyverklaring', href: '/privacy' },
    { label: 'Cookiebeleid', href: '/cookies' },
    { label: 'Algemene voorwaarden', href: '/algemene-voorwaarden' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ] as const,
} as const

/** ISO dates for public “Laatste wijziging”. */
export const legalDates = {
  privacy: { version: '2.1', effective: '2026-09-13', updated: '2026-09-13' },
  cookies: { version: '2.1', effective: '2026-09-13', updated: '2026-09-13' },
  terms: { version: '2.1', effective: '2026-09-13', updated: '2026-09-13' },
  disclaimer: { version: '2.0', effective: '2026-09-13', updated: '2026-09-13' },
} as const

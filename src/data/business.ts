import type { ServiceSlug } from '../types'

/**
 * Single source of truth for verified company facts.
 * Header, footer, contact, CTAs, NAP and structured data read from here.
 *
 * TODO: Confirm postcode. Supplied company information is 9665 GN.
 * Some online listings may show another code (e.g. 9655). Do not swap
 * this value without a new written confirmation.
 */
export const business = {
  businessName: 'Green Installatie Noord',
  legalName: 'Green Installatie Noord',
  phone: '06 28 73 91 34',
  phoneInternational: '+31 6 28 73 91 34',
  phoneHref: 'tel:+31628739134',
  email: 'info@greeninstallatienoord.nl',
  emailHref: 'mailto:info@greeninstallatienoord.nl',
  address: {
    street: 'Burgemeester van Weringstraat 23',
    postalCode: '9665 GN',
    city: 'Oude Pekela',
    region: 'Groningen',
    country: 'Netherlands',
    countryCode: 'NL',
  },
  website: 'https://greeninstallatienoord.nl',
  domain: 'greeninstallatienoord.nl',
  facebook: 'https://www.facebook.com/p/Green-installatie-Noord-61565091255871/',
  /**
   * Leave empty until a stable Google Business Profile URL is verified.
   * Do not publish a share.google short link as the permanent public URL.
   */
  googleBusinessProfile: '',
  instagram: '',
  linkedin: '',
  whatsapp: '',
  openingHours: '',
  services: [
    'cv-ketel',
    'airco',
    'warmtepomp',
    'service-onderhoud',
  ] as const satisfies readonly ServiceSlug[],
} as const

export type Business = typeof business

export type SocialEntityKey =
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'googleBusinessProfile'

export type SocialEntity = {
  key: SocialEntityKey
  name: string
  url: string
  verified: boolean
}

/** Profiles that may appear in sameAs once verified. Empty URL = do not publish. */
export const socialEntities: SocialEntity[] = [
  {
    key: 'facebook',
    name: 'Facebook',
    url: business.facebook,
    verified: Boolean(business.facebook),
  },
  {
    key: 'instagram',
    name: 'Instagram',
    url: business.instagram,
    verified: false,
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    url: business.linkedin,
    verified: false,
  },
  {
    key: 'googleBusinessProfile',
    name: 'Google Business Profile',
    url: business.googleBusinessProfile,
    verified: false,
  },
]

export function verifiedSameAs(): string[] {
  return socialEntities
    .filter((item) => item.verified && item.url.length > 0)
    .map((item) => item.url)
}

export function socialProfiles(): string[] {
  return verifiedSameAs()
}

/** NAP and category copy to keep identical on the website and on GBP. */
export const gbpAlignment = {
  businessName: business.businessName,
  street: business.address.street,
  postalCode: business.address.postalCode,
  city: business.address.city,
  region: business.address.region,
  country: business.address.country,
  phone: business.phone,
  phoneInternational: business.phoneInternational,
  website: business.website,
  email: business.email,
  primaryCategorySuggestion: 'Installatiebedrijf (HVAC)',
  additionalCategorySuggestions: [
    'CV-ketel installatie',
    'Airconditioning',
    'Warmtepomp',
    'Onderhoud installaties',
  ],
  description:
    'Green Installatie Noord installeert en onderhoudt cv-ketels, airconditioning en warmtepompen. Gevestigd in Oude Pekela.',
  profileUrl: business.googleBusinessProfile,
  profileStatus: business.googleBusinessProfile
    ? 'url-present'
    : 'url-not-verified',
} as const

export function formatAddress(separator = ', '): string {
  const { street, postalCode, city } = business.address
  return [street, `${postalCode} ${city}`].join(separator)
}

export function formatNap(): string {
  return `${business.businessName}, ${formatAddress()}, ${business.phone}`
}

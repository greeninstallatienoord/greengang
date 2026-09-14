/**
 * Maintenance subscription packages.
 * Verified: package names, monthly prices, base frequency (every 2 years),
 * and yearly-frequency surcharge (+€4.50/month). 24/7 storingsdienst is a
 * company service — not claimed as a package inclusion unless later verified.
 *
 * Package coverage differences are NOT yet supplied. Keep `features` empty
 * until the business confirms exact inclusions. Do not invent free parts,
 * labour, callouts or response times.
 */

export type MaintenanceFrequency = 'biennial' | 'annual'

export type MaintenancePackageId = 'basis' | 'comfort' | 'all-in'

export type MaintenancePackage = {
  id: MaintenancePackageId
  name: string
  /** Monthly price in cents for the default (biennial) frequency. */
  monthlyPriceCents: number
  /**
   * Verified package inclusions only.
   * Leave empty until coverage differences are confirmed.
   */
  features: string[]
}

export const maintenanceConfig = {
  normalIntervalYears: 2,
  annualSurchargeCents: 450,
  emergencyService24h: true,
  packagesHref: '/service-onderhoud',
  packagesHashHref: '/service-onderhoud#pakketten',
} as const

/** @deprecated Use maintenanceConfig.annualSurchargeCents */
export const yearlySurchargeCents = maintenanceConfig.annualSurchargeCents

export const maintenancePackages: MaintenancePackage[] = [
  {
    id: 'basis',
    name: 'Basis',
    monthlyPriceCents: 799,
    features: [],
  },
  {
    id: 'comfort',
    name: 'Comfort',
    monthlyPriceCents: 1399,
    features: [],
  },
  {
    id: 'all-in',
    name: 'All-in',
    monthlyPriceCents: 1699,
    features: [],
  },
]

export const maintenanceCopy = {
  eyebrow: 'Abonnement',
  title: 'Kies het onderhoud dat bij u past',
  intro:
    'Periodiek onderhoud duidelijk geregeld. Kies een pakket en bepaal zelf of u onderhoud eens per twee jaar of jaarlijks wilt.',
  frequencyLabel: 'Onderhoudsfrequentie',
  biennialLabel: 'Eens per 2 jaar',
  biennialHint: 'Inbegrepen in de standaard pakketprijs.',
  annualLabel: 'Jaarlijks',
  annualHint: 'Jaarlijks onderhoud: + €4,50 per maand.',
  annualNote: 'Jaarlijks onderhoud: + €4,50 per maand.',
  cardBlurb: 'Onderhoud volgens de gekozen onderhoudsfrequentie.',
  coverageNote: 'De exacte pakketinhoud en dekking bevestigen we bij de aanvraag.',
  vanafLabel: 'Vanaf',
  perMonthShort: '/mnd',
  perMonth: 'per maand',
  ctaChoose: 'Kies',
} as const

export const maintenanceTeaserCopy = {
  eyebrow: 'Onderhoud & service',
  title: 'Onderhoud goed geregeld',
  text: 'Kies een onderhoudspakket en bepaal zelf of u onderhoud eens per twee jaar of jaarlijks wilt.',
  points: [
    'Onderhoud eens per 2 jaar',
    'Jaarlijks mogelijk + €4,50/mnd',
    '24/7 storingsdienst bereikbaar',
  ],
  cardLabel: 'Onderhoudspakket',
  cardCta: 'Bekijk pakket',
  cta: 'Bekijk alle onderhoudspakketten',
} as const

export function startingPriceCents(): number {
  return Math.min(...maintenancePackages.map((pack) => pack.monthlyPriceCents))
}

export function monthlyPriceCents(
  packageId: MaintenancePackageId,
  frequency: MaintenanceFrequency,
): number {
  const pack = maintenancePackages.find((item) => item.id === packageId)
  if (!pack) return 0
  return frequency === 'annual'
    ? pack.monthlyPriceCents + maintenanceConfig.annualSurchargeCents
    : pack.monthlyPriceCents
}

export function formatEuroFromCents(cents: number): string {
  const euros = cents / 100
  return euros.toLocaleString('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function quoteHref(
  packageId: MaintenancePackageId,
  frequency: MaintenanceFrequency,
): string {
  return `/offerte-aanvragen?dienst=service-onderhoud&situatie=onderhoud&pakket=${packageId}&frequentie=${frequency}`
}

/** Backward-compatible alias used by older package shape. */
export function packagePriceCents(pack: MaintenancePackage): number {
  return pack.monthlyPriceCents
}

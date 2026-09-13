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
  biennialHint: 'Inbegrepen in de standaard pakketprijs',
  annualLabel: 'Jaarlijks',
  annualHint: '+ €4,50 per maand',
  annualNote: 'De getoonde prijzen zijn inclusief €4,50 per maand voor jaarlijks onderhoud.',
  coverageNote:
    'De exacte dekking per pakket bespreken we bij de aanvraag. Op deze pagina tonen we alleen geverifieerde prijzen en frequenties.',
  ctaChoose: 'Kies',
  ctaMore: 'Pakket aanvragen',
} as const

export const maintenanceTeaserCopy = {
  eyebrow: 'Onderhoud & service',
  title: 'Onderhoud zonder verrassingen',
  text: 'Met een onderhoudspakket blijft periodiek onderhoud overzichtelijk geregeld. Standaard plannen we onderhoud eens per twee jaar. Liever ieder jaar? Dat kan voor €4,50 per maand extra.',
  points: [
    'Onderhoud eens per 2 jaar',
    'Jaarlijks onderhoud mogelijk',
    '24/7 storingsdienst bereikbaar',
  ],
  priceLabel: 'vanaf',
  pricePackage: 'Basis onderhoudspakket',
  cta: 'Bekijk pakketten',
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

/** Backward-compatible alias used by older package shape. */
export function packagePriceCents(pack: MaintenancePackage): number {
  return pack.monthlyPriceCents
}

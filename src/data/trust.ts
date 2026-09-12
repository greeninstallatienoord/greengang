import { business } from './business'

export type TrustCertificationCategory = 'co' | 'stek' | 'brl100' | 'kiwa' | 'other'

export type TrustCertification = {
  id: string
  name: string
  description: string
  category: TrustCertificationCategory
  certificateRef: string | null
  validUntil: string | null
  verificationUrl: string | null
  logo: string | null
  certificateImage: string | null
  approved: boolean
}

export type TrustReview = {
  id: string
  source: string
  sourceUrl: string | null
  rating: number | null
  scale: number
  quote: string
  author: string
  date: string | null
  /** Set true only after the platform/reviewer allows republication. */
  republicationAllowed: boolean
  approved: boolean
}

export type TrustReviewPlatform = {
  id: string
  name: string
  url: string
  /** Show a source link only. Never a star summary unless separately approved. */
  approvedLink: boolean
}

export type TrustBrand = {
  name: string
  approved: boolean
}

export type TrustProject = {
  title: string
  summary: string
  approved: boolean
}

export type TrustGuarantee = {
  title: string
  text: string
  approved: boolean
}

export type TrustMembership = {
  name: string
  url: string | null
  approved: boolean
}

export type TrustNote = {
  approved: boolean
  title: string
  text: string
}

/**
 * Prepared trust records. Nothing with `approved: false` is rendered
 * (except reserved slots that stay hidden).
 * Do not invent certificate numbers, ratings, expiry dates or logos.
 */
export const trustContent = {
  yearsOfExperience: null as number | null,
  completedProjects: null as number | null,
  localPresence: {
    approved: true,
    title: 'Vestiging',
    text: `${business.address.street}, ${business.address.postalCode} ${business.address.city}`,
  } satisfies TrustNote,
  workmanship: {
    approved: false,
    title: 'Vakmanschap',
    text: '',
  } satisfies TrustNote,
  service: {
    approved: false,
    title: 'Service',
    text: '',
  } satisfies TrustNote,
  experience: {
    approved: false,
    title: 'Ervaring',
    text: '',
  } satisfies TrustNote,
  guarantees: [] as TrustGuarantee[],
  memberships: [
    {
      name: 'Techniek Nederland',
      url: 'https://www.technieknederland.nl/',
      approved: false,
    },
    {
      name: 'Ondernemers Organisatie Pekela',
      url: 'https://ondernemersorganisatie-pekela.nl/',
      approved: false,
    },
  ] as TrustMembership[],
  certifications: [
    {
      id: 'co',
      name: 'CO-certificering',
      description:
        'Certificering voor werkzaamheden aan gasverbrandingsinstallaties. Alleen tonen na controle van het certificaat, het nummer en de geldigheid.',
      category: 'co',
      certificateRef: null,
      validUntil: null,
      verificationUrl: null,
      logo: null,
      certificateImage: null,
      approved: false,
    },
    {
      id: 'stek',
      name: 'STEK',
      description:
        'F-gassen / koeltechniek. Alleen tonen na verificatie van registratie of certificaat.',
      category: 'stek',
      certificateRef: null,
      validUntil: null,
      verificationUrl: null,
      logo: null,
      certificateImage: null,
      approved: false,
    },
    {
      id: 'brl-100',
      name: 'BRL 100',
      description: 'BRL 100-erkenning. Alleen tonen na verificatie.',
      category: 'brl100',
      certificateRef: null,
      validUntil: null,
      verificationUrl: null,
      logo: null,
      certificateImage: null,
      approved: false,
    },
    {
      id: 'kiwa',
      name: 'Kiwa',
      description: 'Keuring of erkenning via Kiwa. Alleen tonen na verificatie.',
      category: 'kiwa',
      certificateRef: null,
      validUntil: null,
      verificationUrl: null,
      logo: null,
      certificateImage: null,
      approved: false,
    },
  ] as TrustCertification[],
  reviews: [
    {
      id: 'solvari-2025-03-26',
      source: 'Solvari',
      sourceUrl:
        'https://www.solvari.nl/airco/groningen/pekela/green-installatie-noord-oude-pekela',
      rating: 5,
      scale: 5,
      quote: '',
      author: '',
      date: '2025-03-26',
      republicationAllowed: false,
      approved: false,
    },
  ] as TrustReview[],
  reviewPlatforms: [
    {
      id: 'solvari',
      name: 'Solvari',
      url: 'https://www.solvari.nl/airco/groningen/pekela/green-installatie-noord-oude-pekela',
      approvedLink: true,
    },
  ] as TrustReviewPlatform[],
  brands: [] as TrustBrand[],
  projects: [] as TrustProject[],
}

export function approvedCertifications(): TrustCertification[] {
  return trustContent.certifications.filter((item) => item.approved)
}

export function approvedReviews(): TrustReview[] {
  return trustContent.reviews.filter(
    (item) => item.approved && item.republicationAllowed && item.quote.trim().length > 0,
  )
}

export function approvedReviewPlatforms(): TrustReviewPlatform[] {
  return trustContent.reviewPlatforms.filter((item) => item.approvedLink && item.url)
}

export function approvedBrands(): TrustBrand[] {
  return trustContent.brands.filter((item) => item.approved)
}

export function approvedProjects(): TrustProject[] {
  return trustContent.projects.filter((item) => item.approved)
}

export function approvedGuarantees(): TrustGuarantee[] {
  return trustContent.guarantees.filter((item) => item.approved)
}

export function approvedMemberships(): TrustMembership[] {
  return trustContent.memberships.filter((item) => item.approved)
}

export function approvedNotes(): TrustNote[] {
  return [
    trustContent.localPresence,
    trustContent.experience,
    trustContent.workmanship,
    trustContent.service,
  ].filter((item) => item.approved && item.text.trim().length > 0)
}

export function hasTrustContent(): boolean {
  return (
    trustContent.yearsOfExperience !== null ||
    trustContent.completedProjects !== null ||
    approvedNotes().length > 0 ||
    Boolean(business.googleBusinessProfile) ||
    approvedGuarantees().length > 0 ||
    approvedMemberships().length > 0 ||
    approvedCertifications().length > 0 ||
    approvedReviews().length > 0 ||
    approvedReviewPlatforms().length > 0 ||
    approvedBrands().length > 0 ||
    approvedProjects().length > 0
  )
}

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'whatsapp'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ServiceSlug =
  | 'cv-ketel'
  | 'airco'
  | 'warmtepomp'
  | 'service-onderhoud'

export type QuoteServiceOption = ServiceSlug | 'overig'

export type QuoteSituation =
  | 'nieuwe-installatie'
  | 'vervanging'
  | 'onderhoud'
  | 'storing-reparatie'
  | 'weet-ik-niet'

export type ContactMethod = 'telefoon' | 'e-mail' | 'geen-voorkeur'

export type AppointmentType =
  | 'adviesgesprek'
  | 'inspectie'
  | 'onderhoud'
  | 'installatie'

export type ConsentCategory = 'necessary' | 'preferences' | 'analytics' | 'marketing'

export type ConsentPreferences = Record<ConsentCategory, boolean>

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export type SubmissionResult =
  | { ok: true; id: string; confirmedByServer: boolean; emailWarning?: string }
  | { ok: false; message: string }

export type PhotoAttachment = {
  name: string
  size: number
  type: string
}

export type LeadRequest = {
  service: QuoteServiceOption
  situation: QuoteSituation
  firstName: string
  lastName: string
  phone: string
  email: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  message: string
  preferredContact: ContactMethod
  photos: PhotoAttachment[]
  privacyAccepted: boolean
  website?: string
  idempotencyKey?: string
}

export type BookingRequest = {
  service: ServiceSlug
  appointmentType: AppointmentType
  preferredDate: string
  preferredTimeWindow: string
  firstName: string
  lastName: string
  phone: string
  email: string
  address: string
  message: string
  privacyAccepted: boolean
  website?: string
  idempotencyKey?: string
}

export type ContactRequest = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  privacyAccepted: boolean
  website?: string
  idempotencyKey?: string
}

export type ServiceRecord = {
  slug: ServiceSlug
  name: string
  shortName: string
  navLabel: string
  href: string
  summary: string
  benefit: string
  heroEyebrow: string
  heroTitle: string
  heroText: string
  explanation: string[]
  benefits: { title: string; text: string }[]
  suitableFor: string[]
  process: { title: string; text: string }[]
  helpItems: string[]
  technicalNotes: string[]
  relatedSlugs: ServiceSlug[]
  faqIds: string[]
  blogSlugs: string[]
}

export type FaqItem = {
  id: string
  question: string
  answer: string
  category: string
  relatedServiceSlug?: ServiceSlug
}

export type BlogCategorySlug =
  | 'cv-ketel'
  | 'airco'
  | 'warmtepomp'
  | 'onderhoud'
  | 'energie-comfort'
  | 'praktische-tips'

export type ContentLink = {
  label: string
  href: string
  external?: boolean
}

export type BlogSection = {
  id: string
  heading: string
  paragraphs: string[]
  links?: ContentLink[]
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  intro: string
  category: BlogCategorySlug
  tags: string[]
  publishedAt: string
  updatedAt: string
  imageAlt: string
  relatedServiceSlugs: ServiceSlug[]
  relatedArticleSlugs: string[]
  faqIds: string[]
  sections: BlogSection[]
  resources?: ContentLink[]
}

export type AreaServiceCopy = {
  intro: string
  notes: string[]
}

export type AreaPage = {
  slug: string
  city: string
  region: string
  intro: string
  localNotes: string[]
  serviceCopy: Partial<Record<ServiceSlug, AreaServiceCopy>>
}

export type SeoRecord = {
  title: string
  description: string
  path: string
}

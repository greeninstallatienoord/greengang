import { businessBlock } from './email'
import { websiteUrl } from './emailLayout'
import type { WorkerEnv } from './env'

export type TemplateVars = Record<string, string>

const SERVICE_LABEL: Record<string, string> = {
  'cv-ketel': 'CV-ketel installatie',
  airco: 'Airconditioning installatie',
  warmtepomp: 'Warmtepomp installatie',
  'service-onderhoud': 'Service en onderhoud',
  overig: 'Overig',
}

const TOKEN = /\{\{\s*([a-z0-9_.]+)\s*\}\}/gi

const ALIASES: Record<string, string> = {
  'customer.name': 'customer_name',
  customer_name: 'customer_name',
  'customer.firstName': 'customer_first_name',
  customer_first_name: 'customer_first_name',
  'customer.email': 'customer_email',
  customer_email: 'customer_email',
  'appointment.date': 'appointment_date',
  appointment_date: 'appointment_date',
  'appointment.time': 'appointment_time',
  appointment_time: 'appointment_time',
  'appointment.service': 'service',
  service: 'service',
  'quote.reference': 'quote_reference',
  quote_reference: 'quote_reference',
  'company.name': 'company_name',
  company_name: 'company_name',
  'company.phone': 'company_phone',
  company_phone: 'company_phone',
  'company.email': 'company_email',
  company_email: 'company_email',
  'website.url': 'website_url',
  website_url: 'website_url',
  greeting: 'greeting',
}

export const TEMPLATE_VARIABLES = [
  { key: 'customer.firstName', label: 'Voornaam klant' },
  { key: 'customer.name', label: 'Naam klant' },
  { key: 'customer.email', label: 'E-mail klant' },
  { key: 'appointment.date', label: 'Afspraakdatum' },
  { key: 'appointment.time', label: 'Afspraaktijd' },
  { key: 'appointment.service', label: 'Dienst' },
  { key: 'quote.reference', label: 'Offertereferentie' },
  { key: 'company.name', label: 'Bedrijfsnaam' },
  { key: 'company.phone', label: 'Bedrijfstelefoon' },
  { key: 'company.email', label: 'Bedrijfs-e-mail' },
  { key: 'website.url', label: 'Website' },
] as const

export function firstNameFrom(name: string): string {
  const [first] = name.trim().split(/\s+/)
  return first || name
}

export function labelService(value?: string): string {
  if (!value) return ''
  return SERVICE_LABEL[value] ?? value
}

export function companyVars(env?: WorkerEnv): TemplateVars {
  return {
    company_name: 'Green Installatie Noord',
    company_phone: '06 28 73 91 34',
    company_email: 'info@greeninstallatienoord.nl',
    website_url: env ? websiteUrl(env) : 'https://greeninstallatienoord.nl',
  }
}

export function mergeVars(input: TemplateVars, env?: WorkerEnv): TemplateVars {
  const resolved: TemplateVars = { ...companyVars(env) }
  for (const [rawKey, rawValue] of Object.entries(input)) {
    const canonical = ALIASES[rawKey] ?? rawKey
    resolved[canonical] = rawValue
  }
  if (resolved.service) resolved.service = labelService(resolved.service)
  const name = resolved.customer_name ?? ''
  if (!resolved.customer_first_name) resolved.customer_first_name = firstNameFrom(name)
  resolved.greeting = resolved.customer_first_name
    ? `Beste ${resolved.customer_first_name},`
    : 'Goedendag,'
  return resolved
}

export function applyTemplate(source: string, vars: TemplateVars, env?: WorkerEnv): string {
  const resolved = mergeVars(vars, env)
  return source.replace(TOKEN, (_full, key: string) => {
    const canonical = ALIASES[key.trim()]
    if (!canonical) return ''
    return resolved[canonical] ?? ''
  })
}

export function varsFromCustomer(input: {
  name: string
  email: string
  date?: string
  time?: string
  service?: string
  quoteReference?: string
}): TemplateVars {
  return {
    customer_name: input.name,
    customer_first_name: firstNameFrom(input.name),
    customer_email: input.email,
    appointment_date: input.date ?? '',
    appointment_time: input.time ?? '',
    service: input.service ?? '',
    quote_reference: input.quoteReference ?? '',
  }
}

export type ComposeTemplateMeta = {
  id: string
  slug: string
  name: string
  purpose: string
  description: string
  compose: boolean
}

export const COMPOSE_TEMPLATE_META: ComposeTemplateMeta[] = [
  {
    id: 'tpl-appointment-confirmed',
    slug: 'appointment-confirmed',
    name: 'Afspraak bevestigd',
    purpose: 'Bevestiging van een geplande afspraak.',
    description: 'Stuurt de klant datum, tijd en dienst nadat u de afspraak heeft bevestigd.',
    compose: true,
  },
  {
    id: 'tpl-quote-received-customer',
    slug: 'quote-received-customer',
    name: 'Offerteaanvraag ontvangen',
    purpose: 'Bevestiging dat een offerteaanvraag is ontvangen.',
    description: 'Laat de klant weten dat de aanvraag binnen is en in behandeling wordt genomen.',
    compose: true,
  },
  {
    id: 'tpl-quote-followup',
    slug: 'quote-follow-up',
    name: 'Offerte opvolging',
    purpose: 'Beleefde opvolging van een eerdere offerte of aanvraag.',
    description: 'Gebruik dit als u nog geen reactie heeft gehad op een offerte of voorstel.',
    compose: true,
  },
  {
    id: 'tpl-appointment-reminder',
    slug: 'appointment-reminder',
    name: 'Afspraakherinnering',
    purpose: 'Herinnering voor een geplande afspraak.',
    description: 'Stuur dit een dag van tevoren, zodat de klant datum en tijd paraat heeft.',
    compose: true,
  },
  {
    id: 'tpl-thank-you',
    slug: 'thank-you',
    name: 'Bedankt voor uw aanvraag',
    purpose: 'Dankbericht na contact of een serviceaanvraag.',
    description: 'Een rustige, professionele bevestiging dat het bericht is aangekomen.',
    compose: true,
  },
  {
    id: 'tpl-appointment-cancelled',
    slug: 'appointment-cancelled',
    name: 'Afspraak geannuleerd',
    purpose: 'Bericht wanneer een afspraak is geannuleerd.',
    description: 'Stuurt de klant datum, tijd en dienst nadat u de afspraak heeft geannuleerd.',
    compose: true,
  },
]

export const DEFAULT_TEMPLATES: Array<{
  id: string
  slug: string
  name: string
  subject: string
  body_text: string
  purpose?: string
  description?: string
  compose?: number
}> = [
  {
    id: 'tpl-appointment-confirmed',
    slug: 'appointment-confirmed',
    name: 'Afspraak bevestigd',
    subject: 'Uw afspraak is bevestigd - Green Installatie Noord',
    purpose: COMPOSE_TEMPLATE_META[0]?.purpose,
    description: COMPOSE_TEMPLATE_META[0]?.description,
    compose: 1,
    body_text: [
      'Beste {{customer.firstName}},',
      '',
      'Uw afspraak bij Green Installatie Noord is bevestigd.',
      '',
      'Dienst: {{appointment.service}}',
      'Datum: {{appointment.date}}',
      'Tijd: {{appointment.time}}',
      '',
      'Wij staan op het afgesproken moment bij u langs. Belt u ons gerust als er iets wijzigt.',
      '',
      'Met vriendelijke groet,',
      'Green Installatie Noord',
    ].join('\n'),
  },
  {
    id: 'tpl-quote-received-customer',
    slug: 'quote-received-customer',
    name: 'Offerteaanvraag ontvangen',
    subject: 'Wij hebben uw offerteaanvraag ontvangen',
    purpose: COMPOSE_TEMPLATE_META[1]?.purpose,
    description: COMPOSE_TEMPLATE_META[1]?.description,
    compose: 1,
    body_text: [
      'Beste {{customer.firstName}},',
      '',
      'Dank voor uw offerteaanvraag.',
      '',
      'We hebben uw offerteaanvraag ontvangen. Dit is een ontvangstbevestiging, nog geen offerte.',
      '',
      'We bekijken uw aanvraag en nemen contact met u op.',
      '',
      'Heeft u intussen extra informatie? Stuur die gerust naar {{company.email}} of bel {{company.phone}}.',
      '',
      'Met vriendelijke groet,',
      'Green Installatie Noord',
    ].join('\n'),
  },
  {
    id: 'tpl-quote-followup',
    slug: 'quote-follow-up',
    name: 'Offerte opvolging',
    subject: 'Even contact over uw aanvraag',
    purpose: COMPOSE_TEMPLATE_META[2]?.purpose,
    description: COMPOSE_TEMPLATE_META[2]?.description,
    compose: 1,
    body_text: [
      'Beste {{customer.firstName}},',
      '',
      'Onlangs heeft u een aanvraag bij ons gedaan.',
      '',
      'Ik wilde kort navragen of u nog vragen heeft, of dat we een moment kunnen afspreken om de mogelijkheden door te nemen.',
      '',
      'U kunt ons bereiken op {{company.phone}} of via {{company.email}}.',
      '',
      'Met vriendelijke groet,',
      'Green Installatie Noord',
    ].join('\n'),
  },
  {
    id: 'tpl-appointment-reminder',
    slug: 'appointment-reminder',
    name: 'Afspraakherinnering',
    subject: 'Herinnering: uw afspraak bij Green Installatie Noord',
    purpose: COMPOSE_TEMPLATE_META[3]?.purpose,
    description: COMPOSE_TEMPLATE_META[3]?.description,
    compose: 1,
    body_text: [
      'Beste {{customer.firstName}},',
      '',
      'Dit is een korte herinnering aan uw afspraak.',
      '',
      'Dienst: {{appointment.service}}',
      'Datum: {{appointment.date}}',
      'Tijd: {{appointment.time}}',
      '',
      'Bent u verhinderd of wilt u het tijdstip verzetten? Bel ons dan op {{company.phone}}.',
      '',
      'Met vriendelijke groet,',
      'Green Installatie Noord',
    ].join('\n'),
  },
  {
    id: 'tpl-thank-you',
    slug: 'thank-you',
    name: 'Bedankt voor uw aanvraag',
    subject: 'Dank voor uw bericht - Green Installatie Noord',
    purpose: COMPOSE_TEMPLATE_META[4]?.purpose,
    description: COMPOSE_TEMPLATE_META[4]?.description,
    compose: 1,
    body_text: [
      'Beste {{customer.firstName}},',
      '',
      'Hartelijk dank voor uw bericht. Wij hebben uw aanvraag ontvangen en nemen deze in behandeling.',
      '',
      'U hoort zo snel mogelijk van ons. Heeft u spoed, dan kunt u ons ook bellen op {{company.phone}}.',
      '',
      'Met vriendelijke groet,',
      'Green Installatie Noord',
    ].join('\n'),
  },
  {
    id: 'tpl-appointment-customer',
    slug: 'appointment-received',
    name: 'Afspraakaanvraag ontvangen',
    subject: 'Uw afspraakaanvraag bij Green Installatie Noord',
    compose: 0,
    body_text: [
      'Beste {{customer.firstName}},',
      '',
      'We hebben uw afspraakaanvraag ontvangen. Dit is nog geen definitieve afspraak.',
      'Dienst: {{appointment.service}}',
      'Voorkeursdatum: {{appointment.date}}',
      'Voorkeurstijd: {{appointment.time}}',
      '',
      businessBlock(),
    ].join('\n'),
  },
  {
    id: 'tpl-appointment-cancelled',
    slug: 'appointment-cancelled',
    name: 'Afspraak geannuleerd',
    subject: 'Uw afspraakaanvraag is geannuleerd - Green Installatie Noord',
    purpose: COMPOSE_TEMPLATE_META[5]?.purpose,
    description: COMPOSE_TEMPLATE_META[5]?.description,
    compose: 1,
    body_text: [
      'Beste {{customer.firstName}},',
      '',
      'Uw afspraakaanvraag bij Green Installatie Noord is geannuleerd.',
      '',
      'Dienst: {{appointment.service}}',
      'Datum: {{appointment.date}}',
      'Tijd: {{appointment.time}}',
      '',
      'Wilt u een nieuw moment afspreken, bel ons of gebruik het formulier op de website.',
      '',
      'Met vriendelijke groet,',
      'Green Installatie Noord',
    ].join('\n'),
  },
]

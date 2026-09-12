import { businessBlock } from './email'

export type TemplateVars = {
  'customer.name'?: string
  'customer.firstName'?: string
  'customer.email'?: string
  'appointment.date'?: string
  'appointment.time'?: string
  'appointment.service'?: string
}

const TOKEN = /\{\{\s*([a-z.]+)\s*\}\}/gi
const ALLOWED = new Set([
  'customer.name',
  'customer.firstName',
  'customer.email',
  'appointment.date',
  'appointment.time',
  'appointment.service',
])

export function applyTemplate(source: string, vars: TemplateVars): string {
  return source.replace(TOKEN, (_full, key: string) => {
    const name = key.trim()
    if (!ALLOWED.has(name)) return ''
    return vars[name as keyof TemplateVars] ?? ''
  })
}

export function firstNameFrom(name: string): string {
  const [first] = name.trim().split(/\s+/)
  return first || name
}

export function varsFromCustomer(input: {
  name: string
  email: string
  date?: string
  time?: string
  service?: string
}): TemplateVars {
  return {
    'customer.name': input.name,
    'customer.firstName': firstNameFrom(input.name),
    'customer.email': input.email,
    'appointment.date': input.date ?? '',
    'appointment.time': input.time ?? '',
    'appointment.service': input.service ?? '',
  }
}

export const DEFAULT_TEMPLATES: Array<{
  id: string
  slug: string
  name: string
  subject: string
  body_text: string
}> = [
  {
    id: 'tpl-appointment-customer',
    slug: 'appointment-received',
    name: 'Afspraakaanvraag ontvangen',
    subject: 'Uw afspraakaanvraag bij Green Installatie Noord',
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
    id: 'tpl-appointment-confirmed',
    slug: 'appointment-confirmed',
    name: 'Afspraak bevestigd',
    subject: 'Afspraak bevestigd – Green Installatie Noord',
    body_text: [
      'Beste {{customer.firstName}},',
      '',
      'Uw afspraak is bevestigd.',
      'Dienst: {{appointment.service}}',
      'Datum: {{appointment.date}}',
      'Tijd: {{appointment.time}}',
      '',
      businessBlock(),
    ].join('\n'),
  },
  {
    id: 'tpl-appointment-cancelled',
    slug: 'appointment-cancelled',
    name: 'Afspraak geannuleerd',
    subject: 'Afspraak geannuleerd – Green Installatie Noord',
    body_text: [
      'Beste {{customer.firstName}},',
      '',
      'De afspraak van {{appointment.date}} om {{appointment.time}} is geannuleerd.',
      'Dienst: {{appointment.service}}',
      '',
      'Neem gerust contact op als u een nieuw moment wilt plannen.',
      '',
      businessBlock(),
    ].join('\n'),
  },
  {
    id: 'tpl-quote-admin',
    slug: 'quote-received',
    name: 'Offerteaanvraag ontvangen',
    subject: 'Nieuwe offerteaanvraag – {{customer.name}}',
    body_text: 'Er is een offerteaanvraag binnengekomen van {{customer.name}} ({{customer.email}}).',
  },
  {
    id: 'tpl-quote-followup',
    slug: 'quote-follow-up',
    name: 'Offerte follow-up',
    subject: 'Uw offerteaanvraag – Green Installatie Noord',
    body_text: [
      'Beste {{customer.firstName}},',
      '',
      'Bedankt voor uw offerteaanvraag. We nemen deze in behandeling en nemen contact met u op.',
      '',
      businessBlock(),
    ].join('\n'),
  },
  {
    id: 'tpl-contact-response',
    slug: 'contact-response',
    name: 'Reactie op contactbericht',
    subject: 'Reactie op uw bericht – Green Installatie Noord',
    body_text: [
      'Beste {{customer.firstName}},',
      '',
      'Dank voor uw bericht. We hebben het ontvangen en nemen contact met u op.',
      '',
      businessBlock(),
    ].join('\n'),
  },
]

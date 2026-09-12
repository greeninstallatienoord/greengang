import type {
  AppointmentType,
  ContactMethod,
  QuoteServiceOption,
  QuoteSituation,
} from '../types'

export const quoteServiceOptions: {
  value: QuoteServiceOption
  label: string
  hint: string
}[] = [
  {
    value: 'cv-ketel',
    label: 'CV-ketel',
    hint: 'Installatie of vervanging',
  },
  {
    value: 'airco',
    label: 'Airconditioning',
    hint: 'Koelen en/of verwarmen per ruimte',
  },
  {
    value: 'warmtepomp',
    label: 'Warmtepomp',
    hint: 'Advies en installatie',
  },
  {
    value: 'service-onderhoud',
    label: 'Service & onderhoud',
    hint: 'Onderhoud of storing',
  },
  {
    value: 'overig',
    label: 'Vraag / nog niet zeker',
    hint: 'Geen extra dienst, wel een bericht',
  },
]

export const quoteSituations: { value: QuoteSituation; label: string }[] = [
  { value: 'nieuwe-installatie', label: 'Nieuwe installatie' },
  { value: 'vervanging', label: 'Vervanging' },
  { value: 'onderhoud', label: 'Onderhoud' },
  { value: 'storing-reparatie', label: 'Storing of reparatie' },
  { value: 'weet-ik-niet', label: 'Weet ik nog niet' },
]

export const contactMethods: { value: ContactMethod; label: string }[] = [
  { value: 'telefoon', label: 'Telefonisch' },
  { value: 'e-mail', label: 'Per e-mail' },
  { value: 'geen-voorkeur', label: 'Geen voorkeur' },
]

export const appointmentTypes: { value: AppointmentType; label: string }[] = [
  { value: 'adviesgesprek', label: 'Adviesgesprek' },
  { value: 'inspectie', label: 'Inspectie / opname' },
  { value: 'onderhoud', label: 'Onderhoud' },
  { value: 'installatie', label: 'Installatie' },
]

export const timeWindows = [
  { value: 'ochtend', label: 'Ochtend' },
  { value: 'middag', label: 'Middag' },
  { value: 'geen-voorkeur', label: 'Geen voorkeur' },
]

const situationsByService: Record<string, QuoteSituation[]> = {
  'cv-ketel': ['vervanging', 'nieuwe-installatie', 'storing-reparatie', 'weet-ik-niet'],
  airco: ['nieuwe-installatie', 'vervanging', 'storing-reparatie', 'weet-ik-niet'],
  warmtepomp: ['nieuwe-installatie', 'vervanging', 'weet-ik-niet'],
  'service-onderhoud': ['onderhoud', 'storing-reparatie', 'weet-ik-niet'],
  overig: ['weet-ik-niet', 'nieuwe-installatie', 'vervanging', 'onderhoud', 'storing-reparatie'],
}

export function situationsFor(service: QuoteServiceOption) {
  const allowed = situationsByService[service] ?? situationsByService.overig ?? []
  return quoteSituations.filter((item) => allowed.includes(item.value))
}

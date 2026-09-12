export const appointmentStatusLabel: Record<string, string> = {
  pending: 'Wacht op bevestiging',
  requested: 'Wacht op bevestiging',
  confirmed: 'Bevestigd',
  cancelled: 'Geannuleerd',
  completed: 'Afgerond',
  declined: 'Afgewezen',
}

export const quoteStatusLabel: Record<string, string> = {
  new: 'Nieuw',
  in_progress: 'In behandeling',
  contacted: 'Contact opgenomen',
  quoted: 'Offerte verstuurd',
  completed: 'Afgerond',
  cancelled: 'Geannuleerd',
  archived: 'Gearchiveerd',
}

export const contactStatusLabel: Record<string, string> = {
  new: 'Nieuw',
  in_progress: 'In behandeling',
  answered: 'Beantwoord',
  completed: 'Afgerond',
  read: 'In behandeling',
  contacted: 'Beantwoord',
  archived: 'Afgerond',
}

export const serviceLabel: Record<string, string> = {
  'cv-ketel': 'CV-ketel installatie',
  airco: 'Airconditioning installatie',
  warmtepomp: 'Warmtepomp installatie',
  'service-onderhoud': 'Service en onderhoud',
  overig: 'Overig',
}

export const activityLabel: Record<string, string> = {
  appointment: 'Afspraak',
  quote: 'Offerte',
  contact: 'Contact',
}

export const emailStatusLabel: Record<string, string> = {
  sent: 'Aangeboden aan e-mailprovider',
  failed: 'Mislukt',
  skipped: 'Niet verstuurd',
}

export function todayIso(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

export function formatDate(value?: string): string {
  if (!value) return '-'
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const [date] = value.split('T')
    const [year, month, day] = (date ?? '').split('-')
    if (year && month && day) return `${day}-${month}-${year}`
  }
  return value
}

export function formatDateTime(value?: string): string {
  if (!value) return '-'
  const date = formatDate(value)
  const time = value.includes('T') ? value.slice(11, 16) : ''
  return time ? `${date} ${time}` : date
}

export function greeting(now = new Date()): string {
  const hour = now.getHours()
  if (hour < 12) return 'Goedemorgen'
  if (hour < 18) return 'Goedemiddag'
  return 'Goedenavond'
}

export function matchesQuery(query: string, ...fields: Array<string | undefined>): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return fields.some((field) => (field ?? '').toLowerCase().includes(needle))
}

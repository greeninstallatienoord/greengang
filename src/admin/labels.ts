export const appointmentStatusLabel: Record<string, string> = {
  pending: 'In behandeling',
  requested: 'In behandeling',
  confirmed: 'Bevestigd',
  cancelled: 'Geannuleerd',
  completed: 'Afgerond',
  declined: 'Afgewezen',
}

export const quoteStatusLabel: Record<string, string> = {
  new: 'Nieuw',
  contacted: 'Contact gehad',
  in_progress: 'In behandeling',
  completed: 'Afgerond',
  archived: 'Gearchiveerd',
}

export const contactStatusLabel: Record<string, string> = {
  new: 'Nieuw',
  read: 'Gelezen',
  contacted: 'Contact gehad',
  archived: 'Gearchiveerd',
}

export const serviceLabel: Record<string, string> = {
  'cv-ketel': 'CV-ketel',
  airco: 'Airco',
  warmtepomp: 'Warmtepomp',
  'service-onderhoud': 'Service en onderhoud',
  overig: 'Overig',
}

export const activityLabel: Record<string, string> = {
  appointment: 'Afspraak',
  quote: 'Offerte',
  contact: 'Contact',
}

export function formatDate(value?: string): string {
  if (!value) return '—'
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const [date] = value.split('T')
    const [year, month, day] = (date ?? '').split('-')
    if (year && month && day) return `${day}-${month}-${year}`
  }
  return value
}

import type { ServiceSlug } from '../types'
import { business } from './business'

/** Confirmed services only. Labels for the booking flow. */
export const bookingServices: {
  slug: ServiceSlug
  label: string
  hint: string
}[] = [
  {
    slug: 'cv-ketel',
    label: 'CV-ketel installatie',
    hint: 'Installatie, vervanging of beoordeling van de ketel',
  },
  {
    slug: 'airco',
    label: 'Airconditioning installatie',
    hint: 'Koelen en/of verwarmen per ruimte',
  },
  {
    slug: 'warmtepomp',
    label: 'Warmtepomp installatie',
    hint: 'Advies en installatie op maat',
  },
  {
    slug: 'service-onderhoud',
    label: 'Service en onderhoud',
    hint: 'Onderhoud, service of storing',
  },
]

/** Preference windows — not live availability. */
export const bookingTimeWindows = [
  {
    value: 'ochtend',
    label: 'Ochtend',
    range: '07:00–10:30',
  },
  {
    value: 'middag',
    label: 'Middag',
    range: '10:30–14:00',
  },
  {
    value: 'namiddag',
    label: 'Namiddag',
    range: '14:00–17:00',
  },
  {
    value: 'geen-voorkeur',
    label: 'Geen voorkeur',
    range: 'We stemmen het moment met u af',
  },
] as const

export type BookingTimeWindowValue = (typeof bookingTimeWindows)[number]['value']

export function bookingServiceLabel(slug: string): string {
  return bookingServices.find((item) => item.slug === slug)?.label ?? slug
}

export function bookingTimeWindowLabel(value: string): string {
  const match = bookingTimeWindows.find((item) => item.value === value)
  if (!match) return value
  return match.value === 'geen-voorkeur'
    ? match.label
    : `${match.label} — ${match.range}`
}

/** Local calendar date in Europe/Amsterdam (YYYY-MM-DD). */
export function todayAmsterdam(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export function addDaysIso(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** ISO weekday 1=Mon … 7=Sun using noon UTC to avoid DST edge cases. */
export function weekdayIso(isoDate: string): number {
  const weekday = new Date(`${isoDate}T12:00:00Z`).getUTCDay()
  return weekday === 0 ? 7 : weekday
}

function closedWeekdays(): Set<number> {
  const map: Record<string, number> = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  }
  const closed = new Set<number>()
  for (const day of business.openingHours.days) {
    if (day.closed || !day.opens) closed.add(map[day.day]!)
  }
  return closed
}

export function isBusinessDay(isoDate: string): boolean {
  return !closedWeekdays().has(weekdayIso(isoDate))
}

/** First valid future business day (not today if already past planning, still allow today if weekday). */
export function nextBusinessDay(fromIso = todayAmsterdam()): string {
  let cursor = fromIso
  // Prefer today if still a business day; otherwise next.
  for (let i = 0; i < 14; i += 1) {
    if (isBusinessDay(cursor) && cursor >= todayAmsterdam()) return cursor
    cursor = addDaysIso(cursor, 1)
  }
  return cursor
}

export function upcomingBusinessDays(count: number, fromIso = todayAmsterdam()): string[] {
  const days: string[] = []
  let cursor = fromIso
  for (let i = 0; i < 60 && days.length < count; i += 1) {
    if (isBusinessDay(cursor) && cursor >= todayAmsterdam()) days.push(cursor)
    cursor = addDaysIso(cursor, 1)
  }
  return days
}

export function maxBookingDate(horizonDays = 90): string {
  return addDaysIso(todayAmsterdam(), horizonDays)
}

export function formatBookingDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  if (!year || !month || !day) return iso
  return `${day}-${month}-${year}`
}

export function formatBookingDateLong(iso: string): string {
  const date = new Date(`${iso}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return formatBookingDate(iso)
  return new Intl.DateTimeFormat('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function formatBookingDateShort(iso: string): string {
  const date = new Date(`${iso}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return formatBookingDate(iso)
  return new Intl.DateTimeFormat('nl-NL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date)
}

export function validatePreferredDate(value: string): string | undefined {
  if (!value) return 'Kies een geldige toekomstige datum.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Kies een geldige toekomstige datum.'
  const today = todayAmsterdam()
  if (value < today) return 'Kies een geldige toekomstige datum.'
  if (value > maxBookingDate()) return 'Deze datum ligt te ver vooruit.'
  if (!isBusinessDay(value)) {
    return 'In het weekend plannen we geen afspraken. Kies een werkdag.'
  }
  return undefined
}

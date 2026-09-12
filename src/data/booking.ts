import type { ServiceSlug } from '../types'

/** Confirmed services only. Labels for the booking flow. */
export const bookingServices: { slug: ServiceSlug; label: string }[] = [
  { slug: 'cv-ketel', label: 'CV-ketel' },
  { slug: 'airco', label: 'Airco' },
  { slug: 'warmtepomp', label: 'Warmtepomp' },
  { slug: 'service-onderhoud', label: 'CV-ketel service en onderhoud' },
]

export function bookingServiceLabel(slug: string): string {
  return bookingServices.find((item) => item.slug === slug)?.label ?? slug
}

export function formatBookingDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  if (!year || !month || !day) return iso
  return `${day}-${month}-${year}`
}

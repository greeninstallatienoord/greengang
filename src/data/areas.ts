import type { AreaPage, ServiceSlug } from '../types'

export const localServicePaths: ServiceSlug[] = [
  'cv-ketel',
  'airco',
  'warmtepomp',
  'service-onderhoud',
]

export const areas: AreaPage[] = [
  // Local pages must follow docs/page-architecture.md (local SEO template).
  // Add a place only with unique intro, localNotes and serviceCopy.
  // Do not reuse the same paragraph for every city. No thin doorway pages.
]

export function getArea(slug: string): AreaPage | undefined {
  return areas.find((area) => area.slug === slug)
}

export function areaHasServiceCopy(area: AreaPage, service: ServiceSlug): boolean {
  return Boolean(area.serviceCopy[service]?.intro.trim())
}

export function areaPath(slug: string): string {
  return `/werkgebied/${slug}`
}

export function areaServicePath(slug: string, service: ServiceSlug): string {
  return `/werkgebied/${slug}/${service}`
}

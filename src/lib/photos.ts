import type { PhotoAttachment } from '../types'

export const PHOTO_MAX_BYTES = 8 * 1024 * 1024
export const PHOTO_MAX_FILES = 5
export const PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,image/heif'

const allowedTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
])

export function validatePhotos(files: File[]): {
  accepted: PhotoAttachment[]
  errors: string[]
} {
  const errors: string[] = []
  const accepted: PhotoAttachment[] = []

  if (files.length > PHOTO_MAX_FILES) {
    errors.push(`U kunt maximaal ${PHOTO_MAX_FILES} foto’s toevoegen.`)
  }

  for (const file of files.slice(0, PHOTO_MAX_FILES)) {
    if (!allowedTypes.has(file.type) && !/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)) {
      errors.push(`${file.name}: alleen JPG, PNG, WEBP of HEIC.`)
      continue
    }
    if (file.size > PHOTO_MAX_BYTES) {
      errors.push(`${file.name}: groter dan 8 MB.`)
      continue
    }
    accepted.push({
      name: file.name,
      size: file.size,
      type: file.type || 'image/*',
    })
  }

  return { accepted, errors }
}

export function photoHint(service: string): string {
  const hints: Record<string, string> = {
    'cv-ketel':
      'Optioneel: een foto van de bestaande ketel of de opstellingsruimte.',
    airco:
      'Optioneel: een foto van de binnenruimte en/of de plek voor de buitenunit.',
    warmtepomp:
      'Optioneel: een foto van de technische ruimte of de buitenopstelling.',
    'service-onderhoud':
      'Optioneel: een foto van het toestel of de storing (display/foutmelding).',
    overig: 'Optioneel: een foto van de huidige situatie.',
  }
  return hints[service] ?? 'Optioneel: een foto van de huidige situatie.'
}

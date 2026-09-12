const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const postalPattern = /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/
const phoneAllowed = /^[0-9+\s()-]+$/

export function required(value: string, label: string): string | undefined {
  if (!value.trim()) return `${label} is verplicht.`
  return undefined
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'E-mailadres is verplicht.'
  if (!emailPattern.test(value.trim())) return 'Vul een geldig e-mailadres in.'
  return undefined
}

export function validatePhone(value: string): string | undefined {
  if (!value.trim()) return 'Telefoonnummer is verplicht.'
  const trimmed = value.trim()
  if (!phoneAllowed.test(trimmed)) {
    return 'Gebruik alleen cijfers, spaties, + of haakjes.'
  }
  const digits = trimmed.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) {
    return 'Vul een geldig telefoonnummer in, met minstens 10 cijfers.'
  }
  return undefined
}

export function validatePostalCode(value: string): string | undefined {
  if (!value.trim()) return 'Postcode is verplicht.'
  if (!postalPattern.test(value.trim())) {
    return 'Gebruik een Nederlandse postcode, bijvoorbeeld 1234 AB.'
  }
  return undefined
}

export function firstError(errors: Record<string, string | undefined>): string | undefined {
  return Object.values(errors).find(Boolean)
}

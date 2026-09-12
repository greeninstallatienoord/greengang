import { HttpError } from './http'

const SERVICES = ['cv-ketel', 'airco', 'warmtepomp', 'service-onderhoud'] as const
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^[0-9+\s()-]+$/
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/
const DATE = /^\d{4}-\d{2}-\d{2}$/

export function text(value: unknown, label: string, max: number, required = true): string {
  if (typeof value !== 'string' || !value.trim()) {
    if (!required) return ''
    throw new HttpError(400, `${label} is verplicht.`)
  }
  const next = value.trim()
  if (next.length > max) throw new HttpError(400, `${label} is te lang.`)
  return next
}

export function email(value: unknown): string {
  const next = text(value, 'E-mail', 120)
  if (!EMAIL.test(next)) throw new HttpError(400, 'Vul een geldig e-mailadres in.')
  return next.toLowerCase()
}

export function phone(value: unknown, required = true): string {
  const next = text(value, 'Telefoon', 40, required)
  if (!next) return ''
  if (!PHONE.test(next) || next.replace(/\D/g, '').length < 10) {
    throw new HttpError(400, 'Vul een geldig telefoonnummer in.')
  }
  return next
}

export function service(value: unknown): (typeof SERVICES)[number] {
  const next = text(value, 'Dienst', 40)
  if (!SERVICES.includes(next as (typeof SERVICES)[number])) {
    throw new HttpError(400, 'Kies een geldige dienst.')
  }
  return next as (typeof SERVICES)[number]
}

export function dateOnly(value: unknown): string {
  const next = text(value, 'Datum', 10)
  if (!DATE.test(next)) throw new HttpError(400, 'Gebruik een geldige datum.')
  return next
}

export function timeOnly(value: unknown): string {
  const next = text(value, 'Tijd', 5)
  if (!TIME.test(next)) throw new HttpError(400, 'Gebruik een geldige tijd.')
  return next
}

export function rejectHoneypot(value: unknown): void {
  if (typeof value === 'string' && value.trim()) {
    throw new HttpError(400, 'Het formulier kon niet worden verwerkt.')
  }
}

export function privacyAccepted(value: unknown): void {
  if (value !== true) {
    throw new HttpError(400, 'Bevestig dat u de privacyverklaring heeft gelezen.')
  }
}

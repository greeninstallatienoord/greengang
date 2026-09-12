import type { BookingRequest, SubmissionResult } from '../types'
import { api } from './api'

export type BookingResult = SubmissionResult & {
  status?: 'pending'
  emailWarning?: string
}

export type SlotConfig = {
  today: string
  maxDate: string
  workingDays: number[]
  blockedDates: string[]
  horizonDays: number
}

export async function getSlotConfig(): Promise<SlotConfig | null> {
  const result = await api.appointmentConfig()
  if (!result.ok) return null
  return result.data
}

export async function getAvailability(date?: string): Promise<{
  ready: boolean
  message: string
  slots: string[]
}> {
  if (!date) {
    return {
      ready: false,
      message: 'Kies eerst een datum. Daarna ziet u alleen echte vrije tijden.',
      slots: [],
    }
  }

  const result = await api.appointmentSlots(date)
  if (result.ok) {
    const empty = result.data.slots.length === 0
    return {
      ready: true,
      message: empty
        ? result.data.reason ??
          'Er zijn geen vrije tijden op deze datum. Kies een andere dag.'
        : 'Kies een vrij tijdstip. Dit is een aanvraag, geen bevestigde afspraak.',
      slots: result.data.slots,
    }
  }

  return {
    ready: false,
    message:
      'De agenda is nu niet beschikbaar. Probeer het later opnieuw of bel 06 28 73 91 34.',
    slots: [],
  }
}

export async function submitBooking(
  payload: BookingRequest,
): Promise<BookingResult> {
  if (payload.website?.trim()) {
    return { ok: false, message: 'Het formulier kon niet worden verwerkt.' }
  }
  if (!payload.privacyAccepted) {
    return {
      ok: false,
      message: 'Bevestig dat u de privacyverklaring heeft gelezen.',
    }
  }

  const result = await api.appointments(payload)
  if (result.ok) {
    return {
      ok: true,
      confirmedByServer: true,
      status: 'pending',
      id: result.data.id,
      emailWarning: result.data.emailWarning,
    }
  }
  if (result.unavailable) {
    return {
      ok: false,
      message:
        'We konden uw aanvraag nu niet versturen. Controleer uw verbinding of bel 06 28 73 91 34.',
    }
  }
  return { ok: false, message: result.message }
}

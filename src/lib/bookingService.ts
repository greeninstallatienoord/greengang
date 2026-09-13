import type { BookingRequest, SubmissionResult } from '../types'
import { api } from './api'

export type BookingResult = SubmissionResult & {
  status?: 'pending'
  emailWarning?: string
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
      message: 'Bevestig dat u het privacybeleid heeft gelezen.',
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
        'Het versturen is niet gelukt. Uw gegevens zijn bewaard. Probeer het opnieuw of bel 050 569 0997.',
    }
  }
  return { ok: false, message: result.message }
}

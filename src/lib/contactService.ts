import type { ContactRequest, SubmissionResult } from '../types'
import { api } from './api'

export type ContactResult = SubmissionResult

const UNAVAILABLE =
  'We konden uw bericht nu niet versturen. Controleer uw verbinding of bel 06 28 73 91 34.'

export async function submitContact(
  payload: ContactRequest,
): Promise<ContactResult> {
  if (payload.website?.trim()) {
    return { ok: false, message: 'Het formulier kon niet worden verwerkt.' }
  }
  if (!payload.privacyAccepted) {
    return {
      ok: false,
      message: 'Bevestig dat u het privacybeleid heeft gelezen.',
    }
  }

  const result = await api.contact(payload)
  if (result.ok) {
    return {
      ok: true,
      confirmedByServer: true,
      id: result.data.id,
      emailWarning: result.data.emailWarning,
    }
  }
  if (result.unavailable) {
    return { ok: false, message: UNAVAILABLE }
  }
  return { ok: false, message: result.message }
}

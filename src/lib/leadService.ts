import type { LeadRequest, SubmissionResult } from '../types'
import { api } from './api'

export type LeadResult = SubmissionResult

const UNAVAILABLE =
  'We konden uw aanvraag nu niet versturen. Controleer uw verbinding of bel 050 569 0997.'

export async function submitLead(payload: LeadRequest): Promise<LeadResult> {
  if (payload.website?.trim()) {
    return { ok: false, message: 'Het formulier kon niet worden verwerkt.' }
  }
  if (!payload.privacyAccepted) {
    return {
      ok: false,
      message: 'Bevestig dat u het privacybeleid heeft gelezen.',
    }
  }

  const result = await api.quotes(payload)
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

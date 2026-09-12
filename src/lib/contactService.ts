import type { ContactRequest, SubmissionResult } from '../types'
import { api } from './api'

export type ContactResult = SubmissionResult

export async function submitContact(
  payload: ContactRequest,
): Promise<ContactResult> {
  if (!payload.privacyAccepted) {
    return {
      ok: false,
      message: 'Bevestig dat u het privacybeleid heeft gelezen.',
    }
  }

  const result = await api.contact(payload)
  if (result.ok) {
    return { ok: true, confirmedByServer: true, id: result.data.id }
  }
  if (result.unavailable) {
    if (import.meta.env.DEV) {
      console.info('[contactService] preview only — geen serverbevestiging')
    }
    return {
      ok: true,
      confirmedByServer: false,
      id: `preview-contact-${Date.now()}`,
    }
  }
  return { ok: false, message: result.message }
}

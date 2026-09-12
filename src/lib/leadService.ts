import type { LeadRequest, SubmissionResult } from '../types'
import { api } from './api'

export type LeadResult = SubmissionResult

export async function submitLead(payload: LeadRequest): Promise<LeadResult> {
  if (!payload.privacyAccepted) {
    return {
      ok: false,
      message: 'Bevestig dat u het privacybeleid heeft gelezen.',
    }
  }

  const result = await api.quotes(payload)
  if (result.ok) {
    return { ok: true, confirmedByServer: true, id: result.data.id }
  }
  if (result.unavailable) {
    if (import.meta.env.DEV) {
      console.info('[leadService] preview only — geen serverbevestiging')
    }
    return {
      ok: true,
      confirmedByServer: false,
      id: `preview-lead-${Date.now()}`,
    }
  }
  return { ok: false, message: result.message }
}

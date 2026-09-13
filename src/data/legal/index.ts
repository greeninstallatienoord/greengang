import type { LegalDocument } from './types'
import { privacy } from './privacy'
import { cookies } from './cookiesDoc'
import { terms } from './terms'
import { disclaimer } from './disclaimer'
import { legalMeta } from './meta'

export type { LegalBlock, LegalSection, LegalDocument } from './types'
export { legalMeta, legalDates } from './meta'
export { privacy } from './privacy'
export { cookies } from './cookiesDoc'
export { terms } from './terms'
export { disclaimer } from './disclaimer'

/** @deprecated Prefer LegalDocument — kept for backward-compatible imports. */
export type LegalDoc = LegalDocument

export const legalDocs = {
  privacy,
  cookies,
  terms,
  disclaimer,
} as const satisfies Record<LegalDocument['id'], LegalDocument>

export type LegalDocId = keyof typeof legalDocs

export function getLegalDoc(path: string): LegalDocument | undefined {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return Object.values(legalDocs).find((doc) => doc.path === normalized)
}

export const legalNav = legalMeta.related

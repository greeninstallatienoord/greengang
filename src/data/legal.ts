/**
 * Backward-compatible entry for `@/data/legal` / `../data/legal`.
 * Canonical modules live in `./legal/`.
 */
export {
  legalDocs,
  getLegalDoc,
  legalNav,
  legalMeta,
  legalDates,
  privacy,
  cookies,
  terms,
  disclaimer,
} from './legal/index'
export type {
  LegalDocument,
  LegalDoc,
  LegalBlock,
  LegalSection,
  LegalDocId,
} from './legal/index'

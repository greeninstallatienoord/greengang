export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'notice'; tone?: 'info' | 'warn'; title?: string; text: string }
  | {
      type: 'table'
      caption?: string
      headers: string[]
      rows: string[][]
    }
  | { type: 'dl'; items: Array<{ term: string; description: string }> }

export type LegalSection = {
  id: string
  number?: string
  title: string
  blocks: LegalBlock[]
}

export type LegalDocument = {
  id: 'privacy' | 'cookies' | 'terms' | 'disclaimer'
  title: string
  path: string
  eyebrow: string
  intro: string
  metaDescription: string
  version: string
  effectiveDate: string // ISO
  lastUpdated: string // ISO
  sections: LegalSection[]
}

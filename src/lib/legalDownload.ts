import type { LegalBlock, LegalDocument } from '../data/legal/types'
import { business } from '../data/business'

function blocksToText(blocks: LegalBlock[]): string {
  const lines: string[] = []
  for (const block of blocks) {
    if (block.type === 'p') lines.push(block.text, '')
    else if (block.type === 'notice') {
      if (block.title) lines.push(block.title)
      lines.push(block.text, '')
    } else if (block.type === 'ul' || block.type === 'ol') {
      block.items.forEach((item, index) => {
        lines.push(block.type === 'ol' ? `${index + 1}. ${item}` : `• ${item}`)
      })
      lines.push('')
    } else if (block.type === 'table') {
      if (block.caption) lines.push(block.caption)
      lines.push(block.headers.join(' | '))
      for (const row of block.rows) lines.push(row.join(' | '))
      lines.push('')
    } else if (block.type === 'dl') {
      for (const item of block.items) {
        lines.push(`${item.term}: ${item.description}`)
      }
      lines.push('')
    }
  }
  return lines.join('\n').trim()
}

/** Single-source plain text export for download/print (same content as the page). */
export function legalDocumentToPlainText(doc: LegalDocument): string {
  const header = [
    doc.title,
    business.legalName,
    `${business.address.street}, ${business.address.postalCode} ${business.address.city}`,
    `KvK ${business.kvk}`,
    `${business.email} · ${business.phone}`,
    `Versie ${doc.version} · Geldig vanaf ${doc.effectiveDate} · Laatste wijziging ${doc.lastUpdated}`,
    '',
    doc.intro,
    '',
    '─'.repeat(48),
    '',
  ].join('\n')

  const body = doc.sections
    .map((section) => {
      const title = section.number
        ? `${section.number} — ${section.title}`
        : section.title
      return `${title}\n\n${blocksToText(section.blocks)}`
    })
    .join(`\n\n${'─'.repeat(48)}\n\n`)

  return `${header}${body}\n`
}

export function downloadLegalDocument(doc: LegalDocument): void {
  const text = legalDocumentToPlainText(doc)
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const slug = doc.path.replace(/^\//, '') || doc.id
  anchor.href = url
  anchor.download = `${slug}-v${doc.version}.txt`
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function printLegalDocument(): void {
  window.print()
}

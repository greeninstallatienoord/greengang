import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, List } from 'lucide-react'
import { Breadcrumbs } from '../Breadcrumbs'
import { Container } from '../Container'
import { cn } from '../../lib/cn'
import type { LegalDocument, LegalSection } from '../../data/legal/types'
import { business } from '../../data/business'
import { legalMeta } from '../../data/legal/meta'
import { openPreferences } from '../../lib/consentManager'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useFocusTrap } from '../../hooks/useFocusTrap'

function formatNlDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}-${m}-${y}`
}

export function LegalLastUpdated({
  updated,
  version,
  effective,
}: {
  updated: string
  version: string
  effective: string
}) {
  return (
    <p className="mt-4 text-sm text-ink-muted">
      Laatste wijziging: <time dateTime={updated}>{formatNlDate(updated)}</time>
      <span className="mx-2 text-line" aria-hidden="true">
        ·
      </span>
      Versie {version}
      <span className="mx-2 text-line" aria-hidden="true">
        ·
      </span>
      Geldig vanaf {formatNlDate(effective)}
    </p>
  )
}

export function LegalHero({ doc }: { doc: LegalDocument }) {
  return (
    <header className="border-b border-line bg-paper">
      <Container className="max-w-[78rem] py-8 sm:py-10 lg:py-12">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: doc.title, href: doc.path },
          ]}
        />
        <p className="mt-5 text-[0.7rem] font-semibold tracking-[0.16em] text-brand uppercase">
          {doc.eyebrow}
        </p>
        <h1 className="mt-2 max-w-[22ch] font-display text-[clamp(1.85rem,4.2vw,2.75rem)] leading-[1.12] tracking-[-0.02em] text-ink">
          {doc.title}
        </h1>
        <p className="mt-4 max-w-[40rem] text-[1.02rem] leading-relaxed text-ink-muted">
          {doc.intro}
        </p>
        <LegalLastUpdated
          updated={doc.lastUpdated}
          version={doc.version}
          effective={doc.effectiveDate}
        />
      </Container>
    </header>
  )
}

export function LegalNotice({
  tone = 'info',
  title,
  text,
}: {
  tone?: 'info' | 'warn'
  title?: string
  text: string
}) {
  return (
    <aside
      className={cn(
        'my-5 border px-4 py-3 text-sm leading-relaxed',
        tone === 'warn'
          ? 'border-[#d4b48a] bg-[#fbf6ee] text-ink'
          : 'border-line bg-surface text-ink',
      )}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      <p className={title ? 'mt-1 text-ink-muted' : 'text-ink-muted'}>{text}</p>
    </aside>
  )
}

export function LegalDataTable({
  caption,
  headers,
  rows,
}: {
  caption?: string
  headers: string[]
  rows: string[][]
}) {
  const captionId = useId()
  return (
    <div className="my-5" role="region" aria-labelledby={caption ? captionId : undefined}>
      {caption ? (
        <p id={captionId} className="mb-2 text-sm font-semibold text-ink">
          {caption}
        </p>
      ) : null}
      {/* Desktop table */}
      <div className="admin-table-wrap hidden overflow-x-auto border border-line md:block">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-line bg-surface">
              {headers.map((header) => (
                <th key={header} scope="col" className="px-3 py-2.5 font-semibold text-ink">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-line last:border-0">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-2.5 align-top break-words text-ink-muted">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile cards */}
      <ul className="grid gap-3 md:hidden" aria-labelledby={caption ? captionId : undefined}>
        {rows.map((row, index) => (
          <li key={index} className="min-w-0 border border-line bg-paper px-3.5 py-3">
            <dl className="grid gap-2">
              {headers.map((header, headerIndex) => (
                <div key={header} className="min-w-0">
                  <dt className="text-[0.68rem] font-semibold tracking-[0.08em] text-ink-muted uppercase">
                    {header}
                  </dt>
                  <dd className="mt-0.5 text-sm break-words text-ink">{row[headerIndex]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LegalSectionView({ section }: { section: LegalSection }) {
  return (
    <section
      id={section.id}
      className="scroll-mt-[calc(var(--header-offset)+0.5rem)] border-b border-line py-8 last:border-0 sm:py-9"
    >
      <h2 className="font-display text-[clamp(1.2rem,2.2vw,1.55rem)] leading-snug tracking-[-0.015em] text-ink">
        {section.number ? (
          <span className="mr-2 text-brand tabular-nums">{section.number}</span>
        ) : null}
        {section.title}
      </h2>
      <div className="mt-4 max-w-[42rem]">
        {section.blocks.map((block, index) => {
          if (block.type === 'p') {
            return (
              <p key={index} className="mt-3 text-[0.98rem] leading-[1.7] text-ink-muted first:mt-0">
                {block.text}
              </p>
            )
          }
          if (block.type === 'ul' || block.type === 'ol') {
            const Tag = block.type === 'ul' ? 'ul' : 'ol'
            return (
              <Tag
                key={index}
                className={cn(
                  'mt-3 grid gap-2 pl-5 text-[0.98rem] leading-[1.65] text-ink-muted',
                  block.type === 'ul' ? 'list-disc' : 'list-decimal',
                )}
              >
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </Tag>
            )
          }
          if (block.type === 'notice') {
            return (
              <LegalNotice key={index} tone={block.tone} title={block.title} text={block.text} />
            )
          }
          if (block.type === 'table') {
            return (
              <LegalDataTable
                key={index}
                caption={block.caption}
                headers={block.headers}
                rows={block.rows}
              />
            )
          }
          if (block.type === 'dl') {
            return (
              <dl key={index} className="mt-4 grid gap-3">
                {block.items.map((item) => (
                  <div key={item.term} className="border border-line bg-paper px-3.5 py-3">
                    <dt className="text-sm font-semibold text-ink">{item.term}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink-muted">
                      {item.description}
                    </dd>
                  </div>
                ))}
              </dl>
            )
          }
          return null
        })}
      </div>
    </section>
  )
}

export function LegalTableOfContents({
  sections,
  activeId,
}: {
  sections: LegalSection[]
  activeId: string
}) {
  return (
    <nav aria-label="Inhoudsopgave" className="hidden lg:block">
      <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-ink-muted uppercase">
        Op deze pagina
      </p>
      <ol className="mt-3 grid gap-0.5 border-l border-line">
        {sections.map((section) => {
          const active = section.id === activeId
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={cn(
                  'relative block py-1.5 pl-3 text-sm leading-snug transition-colors',
                  active
                    ? 'font-semibold text-brand before:absolute before:inset-y-1 before:left-[-1px] before:w-0.5 before:bg-brand'
                    : 'text-ink-muted hover:text-ink',
                )}
              >
                {section.number ? `${section.number} ` : ''}
                {section.title}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function LegalMobileToc({ sections }: { sections: LegalSection[] }) {
  const [open, setOpen] = useState(false)
  const [restoreFocus, setRestoreFocus] = useState<HTMLElement | null>(null)
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  useFocusTrap(open, panelRef, restoreFocus)

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const main = document.getElementById('main-content')
    if (main) main.inert = true
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
      if (main) main.inert = false
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex min-h-11 w-full items-center justify-between gap-2 border border-line bg-paper px-3 text-sm font-semibold"
        aria-expanded={open}
        aria-controls="legal-mobile-toc"
        onClick={() => {
          setRestoreFocus(triggerRef.current)
          setOpen(true)
        }}
      >
        <span className="inline-flex items-center gap-2">
          <List size={16} aria-hidden="true" />
          Op deze pagina
        </span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-[#102418]/45"
            aria-label="Sluiten"
            onClick={() => setOpen(false)}
          />
          <div
            id="legal-mobile-toc"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="absolute inset-x-0 bottom-0 max-h-[min(80dvh,36rem)] overflow-y-auto rounded-t-[0.5rem] border border-line bg-paper pb-[max(1rem,env(safe-area-inset-bottom))] outline-none"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-line bg-paper px-4 py-3">
              <p id={titleId} className="font-semibold">
                Op deze pagina
              </p>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center border border-line"
                aria-label="Sluiten"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>
            <ol className="grid p-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex min-h-12 items-center px-3 text-sm font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {section.number ? (
                      <span className="mr-2 text-brand tabular-nums">{section.number}</span>
                    ) : null}
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function LegalContactCard() {
  return (
    <aside className="mt-10 border border-line bg-surface px-4 py-5 sm:px-5">
      <h2 className="font-display text-xl tracking-[-0.015em]">Vragen over deze informatie?</h2>
      <p className="mt-2 max-w-[36rem] text-sm leading-relaxed text-ink-muted">
        Neem contact met ons op. Voor privacyverzoeken vermeldt u duidelijk waar uw verzoek over gaat.
      </p>
      <ul className="mt-4 grid gap-1 text-sm">
        <li>
          <a href={business.emailHref} className="font-semibold underline-offset-2 hover:underline">
            {business.email}
          </a>
        </li>
        <li>
          <a href={business.phoneHref} className="font-semibold underline-offset-2 hover:underline">
            {business.phone}
          </a>
        </li>
        <li className="pt-1 text-ink-muted whitespace-pre-line">{legalMeta.addressBlock}</li>
        <li className="text-ink-muted">KvK {business.kvk}</li>
      </ul>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          to="/contact"
          className="inline-flex min-h-11 items-center bg-brand px-4 text-sm font-semibold text-white"
        >
          Contactformulier
        </Link>
        <button
          type="button"
          className="inline-flex min-h-11 items-center border border-line px-4 text-sm font-semibold"
          onClick={(event) => openPreferences(event.currentTarget)}
        >
          Cookie-instellingen
        </button>
      </div>
    </aside>
  )
}

export function LegalRelatedLinks({ currentPath }: { currentPath: string }) {
  return (
    <nav aria-label="Juridische pagina's" className="mt-8 border-t border-line pt-6">
      <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-ink-muted uppercase">
        Privacy &amp; voorwaarden
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-1 gap-y-1">
        {legalMeta.related.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              aria-current={item.href === currentPath ? 'page' : undefined}
              className={cn(
                'inline-flex min-h-11 items-center px-2 text-sm underline-offset-2 hover:underline',
                item.href === currentPath ? 'font-semibold text-brand' : 'text-ink-muted',
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <button
            type="button"
            className="inline-flex min-h-11 items-center px-2 text-sm text-ink-muted underline-offset-2 hover:underline"
            onClick={(event) => openPreferences(event.currentTarget)}
          >
            Cookie-instellingen
          </button>
        </li>
      </ul>
    </nav>
  )
}

export function LegalPageLayout({
  doc,
  actions,
}: {
  doc: LegalDocument
  actions?: ReactNode
}) {
  const sectionIds = useMemo(() => doc.sections.map((section) => section.id), [doc.sections])
  const activeId = useActiveSection(sectionIds)

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [doc.path])

  return (
    <article className="legal-page bg-paper">
      <LegalHero doc={doc} />
      <Container className="max-w-[78rem] py-6 sm:py-8 lg:py-10">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:mb-6">
          <div className="min-w-0 w-full sm:flex-1">
            <LegalMobileToc sections={doc.sections} />
          </div>
          {actions ? <div className="flex min-w-0 flex-wrap gap-2">{actions}</div> : null}
        </div>
        <div className="lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[16.5rem_minmax(0,42rem)_1fr] xl:gap-12">
          <aside className="legal-toc sticky top-[calc(var(--header-offset)+0.75rem)] hidden self-start lg:block">
            <LegalTableOfContents sections={doc.sections} activeId={activeId} />
          </aside>
          <div className="min-w-0">
            {doc.sections.map((section) => (
              <LegalSectionView key={section.id} section={section} />
            ))}
            <LegalContactCard />
            <LegalRelatedLinks currentPath={doc.path} />
          </div>
        </div>
      </Container>
    </article>
  )
}

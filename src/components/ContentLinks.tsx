import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ContentLink } from '../types'
import { cn } from '../lib/cn'

type ContentLinksProps = {
  items: ContentLink[]
  className?: string
  /**
   * plain — legacy inline list (non-article pages)
   * resources — editorial “Verder lezen” rows
   * sources — official external references
   */
  variant?: 'plain' | 'resources' | 'sources'
  title?: string
  intro?: string
}

function parseResourceLabel(label: string): { kind?: string; title: string } {
  const match = label.match(/^(Gids|Dienst|Offerte|Artikel|Checklist)\s*:\s*(.+)$/i)
  if (match?.[1] && match[2]) {
    return { kind: match[1], title: match[2] }
  }
  return { title: label }
}

export function ContentLinks({
  items,
  className,
  variant = 'plain',
  title,
  intro,
}: ContentLinksProps) {
  if (items.length === 0) return null

  if (variant === 'resources') {
    return (
      <div className={cn('article-resources', className)}>
        <p className="article-resources__label">{title ?? 'Verder lezen'}</p>
        <ul className="article-resources__list">
          {items.map((item) => {
            const parsed = parseResourceLabel(item.label)
            const body = (
              <>
                <span className="article-resources__text">
                  {parsed.kind ? (
                    <span className="article-resources__kind">{parsed.kind}</span>
                  ) : null}
                  <span className="article-resources__title">{parsed.title}</span>
                </span>
                <ArrowRight
                  size={15}
                  strokeWidth={2}
                  className="article-resources__arrow"
                  aria-hidden="true"
                />
              </>
            )
            return (
              <li key={`${item.href}-${item.label}`}>
                {item.external ? (
                  <a
                    href={item.href}
                    className="article-resources__row"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {body}
                    <span className="sr-only"> (opent in nieuw tabblad)</span>
                  </a>
                ) : (
                  <Link to={item.href} className="article-resources__row">
                    {body}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  if (variant === 'sources') {
    return (
      <aside className={cn('article-sources', className)}>
        <p className="article-sources__label">{title ?? 'Officiële bronnen'}</p>
        {intro ? <p className="article-sources__intro">{intro}</p> : null}
        <ul className="article-sources__list">
          {items.map((item) => (
            <li key={`${item.href}-${item.label}`}>
              {item.external ? (
                <a
                  href={item.href}
                  className="article-sources__link"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight size={15} strokeWidth={1.85} aria-hidden="true" />
                  <span className="sr-only"> (externe bron, opent in nieuw tabblad)</span>
                </a>
              ) : (
                <Link to={item.href} className="article-sources__link">
                  <span>{item.label}</span>
                  <ArrowRight size={15} strokeWidth={1.85} aria-hidden="true" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </aside>
    )
  }

  return (
    <ul className={className ?? 'mt-3 grid gap-2 text-sm'}>
      {items.map((item) => (
        <li key={`${item.href}-${item.label}`}>
          {item.external ? (
            <a
              href={item.href}
              className="font-semibold text-brand-dark underline decoration-brand/35 underline-offset-2 transition-colors hover:decoration-brand"
              rel="noopener noreferrer"
              target="_blank"
            >
              {item.label}
              <span className="font-normal text-ink-muted"> (externe bron)</span>
            </a>
          ) : (
            <Link
              to={item.href}
              className="font-semibold text-brand-dark underline decoration-brand/35 underline-offset-2 transition-colors hover:decoration-brand"
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

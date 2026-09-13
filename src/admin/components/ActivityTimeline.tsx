import { Link } from 'react-router-dom'
import { formatDateTime } from '../labels'
import { adminUrl } from '../adminPath'

export type TimelineItem = {
  id: string
  source: string
  eventType: string
  title: string
  detail: string | null
  href: string | null
  createdAt: string
}

type ActivityTimelineProps = {
  items: TimelineItem[]
  emptyText?: string
}

function resolveHref(href: string | null): string | null {
  if (!href) return null
  if (href.startsWith('/')) return adminUrl(href.replace(/^\//, ''))
  return href
}

export function ActivityTimeline({
  items,
  emptyText = 'Nog geen activiteit voor deze klant.',
}: ActivityTimelineProps) {
  if (items.length === 0) {
    return <p className="text-sm text-[var(--admin-muted)]">{emptyText}</p>
  }

  return (
    <ol className="relative grid gap-0 border-l border-[var(--admin-line)] pl-4">
      {items.map((item) => {
        const href = resolveHref(item.href)
        const content = (
          <>
            <p className="text-sm font-semibold text-[var(--admin-ink)]">{item.title}</p>
            {item.detail ? (
              <p className="mt-0.5 text-sm leading-snug text-[var(--admin-muted)]">{item.detail}</p>
            ) : null}
            <p className="mt-1 text-xs text-[var(--admin-muted)]">
              {formatDateTime(item.createdAt)}
            </p>
          </>
        )
        return (
          <li key={item.id} className="relative pb-4 last:pb-0">
            <span
              className="absolute top-1.5 -left-[1.28rem] size-2.5 rounded-full border-2 border-[var(--admin-panel)] bg-[var(--admin-accent)]"
              aria-hidden="true"
            />
            {href ? (
              <Link to={href} className="block rounded-[var(--admin-radius)] hover:bg-[var(--admin-hover)]">
                {content}
              </Link>
            ) : (
              <div>{content}</div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

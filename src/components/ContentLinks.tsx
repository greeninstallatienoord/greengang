import { Link } from 'react-router-dom'
import type { ContentLink } from '../types'

type ContentLinksProps = {
  items: ContentLink[]
  className?: string
}

export function ContentLinks({ items, className }: ContentLinksProps) {
  if (items.length === 0) return null

  return (
    <ul className={className ?? 'mt-3 grid gap-2 text-sm'}>
      {items.map((item) => (
        <li key={`${item.href}-${item.label}`}>
          {item.external ? (
            <a
              href={item.href}
              className="font-semibold underline underline-offset-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              {item.label}
              <span className="font-normal text-ink-muted"> (externe bron)</span>
            </a>
          ) : (
            <Link to={item.href} className="font-semibold underline underline-offset-2">
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

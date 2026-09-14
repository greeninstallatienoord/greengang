import { Link, useLocation } from 'react-router-dom'
import { JsonLd } from './seo/JsonLd'
import { breadcrumbJsonLd } from '../lib/jsonld'

type Crumb = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  items: Crumb[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const location = useLocation()
  const schemaItems = items
    .map((item, index) => ({
      name: item.label,
      path:
        item.href ??
        (index === items.length - 1 ? location.pathname : index === 0 ? '/' : ''),
    }))
    .filter((item) => item.path)

  return (
    <nav aria-label="Broodkruimelpad" className="text-[0.8rem] text-ink-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1">
            {item.href && index < items.length - 1 ? (
              <Link to={item.href} className="hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span
                className="max-w-[min(100%,22rem)] text-ink sm:max-w-none"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
            {index < items.length - 1 ? (
              <span aria-hidden="true" className="px-1">
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <JsonLd data={breadcrumbJsonLd(schemaItems)} />
    </nav>
  )
}

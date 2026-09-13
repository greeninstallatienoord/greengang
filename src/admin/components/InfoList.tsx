import { Link } from 'react-router-dom'

type InfoListProps = {
  items: Array<{ label: string; value?: string | null; href?: string }>
}

function isInternalPath(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//')
}

export function InfoList({ items }: InfoListProps) {
  const visible = items.filter((item) => item.value)

  if (visible.length === 0) return null

  return (
    <dl className="grid gap-px overflow-hidden border border-[var(--admin-line)] bg-[var(--admin-line)] sm:grid-cols-2">
      {visible.map((item) => (
        <div key={item.label} className="bg-[var(--admin-panel)] px-4 py-3">
          <dt className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm font-medium break-words whitespace-pre-wrap">
            {item.href ? (
              isInternalPath(item.href) ? (
                <Link
                  to={item.href}
                  className="underline decoration-[var(--admin-line)] underline-offset-2"
                >
                  {item.value}
                </Link>
              ) : (
                <a
                  href={item.href}
                  className="underline decoration-[var(--admin-line)] underline-offset-2"
                >
                  {item.value}
                </a>
              )
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

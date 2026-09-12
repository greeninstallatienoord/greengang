import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { EmailCenterNav } from '../email/EmailCenterNav'
import { EmptyState } from '../components/EmptyState'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { adminUrl } from '../adminPath'

const COMPOSE_ORDER = [
  'tpl-appointment-confirmed',
  'tpl-quote-received-customer',
  'tpl-quote-followup',
  'tpl-appointment-reminder',
  'tpl-thank-you',
]

export function TemplatesPage() {
  const [items, setItems] = useState<Array<Record<string, string> & { compose?: number }>>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void api.admin.templates().then((result) => {
      setLoading(false)
      if (result.ok) setItems(result.data.items)
      else setError(result.message)
    })
  }, [])

  const compose = useMemo(() => {
    const selected = items.filter(
      (item) => Number(item.compose) === 1 || COMPOSE_ORDER.includes(item.id ?? ''),
    )
    return [...selected].sort(
      (a, b) => COMPOSE_ORDER.indexOf(a.id ?? '') - COMPOSE_ORDER.indexOf(b.id ?? ''),
    )
  }, [items])

  const system = useMemo(
    () => items.filter((item) => !compose.some((entry) => entry.id === item.id)),
    [items, compose],
  )

  return (
    <div>
      <PageHeader
        title="Templates"
        description="Vijf standaardberichten voor klanten. Aanpassen wijzigt toekomstige e-mails, niet het verzonden logboek."
      />
      <EmailCenterNav />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading ? <Skeleton /> : null}
      {!loading && items.length === 0 && !error ? (
        <EmptyState
          title="Geen templates"
          text="Pas migratie 0004 toe om de vijf klanttemplates te laden."
        />
      ) : null}

      {compose.length > 0 ? (
        <ul className="grid gap-3">
          {compose.map((item) => (
            <li key={item.id}>
              <Link
                to={adminUrl(`templates/${item.id}`)}
                className="admin-card block p-5"
              >
                <p className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
                  {item.purpose || 'Klantbericht'}
                </p>
                <p className="mt-1 text-lg font-semibold tracking-[-0.02em]">{item.name}</p>
                <p className="mt-1 text-sm text-[var(--admin-muted)]">{item.description}</p>
                <div className="mt-3 overflow-hidden border border-[var(--admin-line)]">
                  <div className="h-1.5 bg-[#102418]" />
                  <p className="line-clamp-3 bg-[#fbf8f2] px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap">
                    {item.body_text}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {system.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold">Automatische berichten</h2>
          <ul className="grid gap-2">
            {system.map((item) => (
              <li key={item.id}>
                <Link
                  to={adminUrl(`templates/${item.id}`)}
                  className="admin-card block px-4 py-3"
                >
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-[var(--admin-muted)]">{item.subject}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { formatDate, quoteStatusLabel, serviceLabel } from '../labels'
import { adminUrl } from '../adminPath'

const filters = ['all', 'new', 'contacted', 'in_progress', 'completed', 'archived'] as const

export function QuotesPage() {
  const [items, setItems] = useState<Array<Record<string, string>>>([])
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const [error, setError] = useState('')

  useEffect(() => {
    void api.admin.quotes().then((result) => {
      if (result.ok) setItems(result.data.items)
      else setError(result.message)
    })
  }, [])

  const visible = useMemo(
    () => items.filter((item) => filter === 'all' || item.status === filter),
    [items, filter],
  )

  return (
    <div>
      <PageHeader title="Offertes" />
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            className={`min-h-10 shrink-0 rounded-md px-3 text-sm font-semibold ${
              filter === value ? 'bg-brand text-white' : 'border border-line bg-paper'
            }`}
            onClick={() => setFilter(value)}
          >
            {value === 'all' ? 'Alles' : quoteStatusLabel[value]}
          </button>
        ))}
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {visible.length === 0 && !error ? (
        <EmptyState title="Geen offerteaanvragen" text="Nieuwe aanvragen van de website komen hier binnen." />
      ) : (
        <ul className="grid gap-3">
          {visible.map((item) => (
            <li key={item.id}>
              <Link to={adminUrl(`quotes/${item.id}`)} className="block rounded-md border border-line bg-paper p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{item.name}</p>
                  <StatusBadge value={item.status ?? ''} label={quoteStatusLabel[item.status ?? '']} />
                </div>
                <p className="mt-2 text-sm text-ink-muted">
                  {serviceLabel[item.service ?? ''] ?? item.service} · {formatDate(item.created_at)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

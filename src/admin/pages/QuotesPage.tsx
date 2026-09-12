import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { FilterTabs } from '../components/FilterTabs'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { SearchField } from '../components/SearchField'
import { Skeleton } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import { formatDateTime, matchesQuery, quoteStatusLabel, serviceLabel } from '../labels'
import { adminUrl } from '../adminPath'

const filters = ['all', 'new', 'in_progress', 'contacted', 'quoted', 'completed', 'cancelled', 'archived'] as const

export function QuotesPage() {
  const [items, setItems] = useState<Array<Record<string, string>>>([])
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void api.admin.quotes().then((result) => {
      setLoading(false)
      if (result.ok) setItems(result.data.items)
      else setError(result.message)
    })
  }, [])

  const visible = useMemo(
    () =>
      items.filter(
        (item) =>
          (filter === 'all' || item.status === filter) &&
          matchesQuery(query, item.name, item.email, item.phone, serviceLabel[item.service ?? ''], item.service),
      ),
    [items, filter, query],
  )

  return (
    <div>
      <PageHeader
        title="Offertes"
        description="Aanvragen van de website. Bedragen worden alleen getoond als ze in de database staan."
      />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <FilterTabs
          value={filter}
          onChange={setFilter}
          options={filters.map((value) => ({
            value,
            label: value === 'all' ? 'Alles' : quoteStatusLabel[value] ?? value,
            count: value === 'all' ? items.length : items.filter((item) => item.status === value).length,
          }))}
        />
        <SearchField
          id="quote-search"
          value={query}
          onChange={setQuery}
          placeholder="Zoek op naam, e-mail of dienst"
        />
      </div>
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading ? <Skeleton /> : null}
      {!loading && visible.length === 0 && !error ? (
        <EmptyState
          title={items.length === 0 ? 'Geen offerteaanvragen' : 'Geen resultaten'}
          text={
            items.length === 0
              ? 'Nieuwe aanvragen van de website komen hier binnen.'
              : 'Pas de zoekterm of het filter aan.'
          }
        />
      ) : null}

      <ul className="grid gap-2 lg:hidden">
        {visible.map((item) => (
          <li key={item.id}>
            <Link
              to={adminUrl(`quotes/${item.id}`)}
              className="admin-card block p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{item.name}</p>
                <StatusBadge value={item.status ?? ''} label={quoteStatusLabel[item.status ?? '']} />
              </div>
              <p className="mt-2 text-sm text-[var(--admin-muted)]">
                {serviceLabel[item.service ?? ''] ?? item.service}
              </p>
              <p className="mt-1 text-sm text-[var(--admin-muted)]">
                {item.phone || '-'}
                {item.email ? ` · ${item.email}` : ''}
              </p>
              <p className="mt-1 text-xs text-[var(--admin-muted)]">{formatDateTime(item.created_at)}</p>
            </Link>
          </li>
        ))}
      </ul>

      {visible.length > 0 ? (
        <div className="hidden border border-[var(--admin-line)] bg-[var(--admin-panel)] lg:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--admin-line)] text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
                <th className="px-4 py-3 font-semibold">Klant</th>
                <th className="px-4 py-3 font-semibold">Dienst</th>
                <th className="px-4 py-3 font-semibold">Telefoon</th>
                <th className="px-4 py-3 font-semibold">E-mail</th>
                <th className="px-4 py-3 font-semibold">Ontvangen</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id} className="border-b border-[var(--admin-line)] last:border-0 hover:bg-[var(--admin-hover)]">
                  <td className="px-4 py-3">
                    <Link className="font-medium underline decoration-[var(--admin-line)] underline-offset-2" to={adminUrl(`quotes/${item.id}`)}>
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{serviceLabel[item.service ?? ''] ?? item.service}</td>
                  <td className="px-4 py-3">{item.phone || '-'}</td>
                  <td className="px-4 py-3 break-all">{item.email || '-'}</td>
                  <td className="px-4 py-3">{formatDateTime(item.created_at)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.status ?? ''} label={quoteStatusLabel[item.status ?? '']} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

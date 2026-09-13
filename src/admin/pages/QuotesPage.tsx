import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { FilterTabs } from '../components/FilterTabs'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { SearchField } from '../components/SearchField'
import { SkeletonTable } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import { formatDateTime, formatDayMonth, matchesQuery, quoteStatusLabel, serviceLabel } from '../labels'
import { adminUrl } from '../adminPath'

const filters = [
  'all',
  'new',
  'in_progress',
  'contacted',
  'quoted',
  'completed',
  'cancelled',
  'archived',
] as const

export function QuotesPage() {
  const navigate = useNavigate()
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
          matchesQuery(
            query,
            item.name,
            item.email,
            item.phone,
            serviceLabel[item.service ?? ''],
            item.service,
          ),
      ),
    [items, filter, query],
  )

  const filtered = filter !== 'all' || query.trim().length > 0

  return (
    <div>
      <PageHeader
        title="Offertes"
        description="Aanvragen van de website. Bedragen worden alleen getoond als ze in de database staan."
      />
      <div className="mb-3 hidden gap-2 overflow-x-auto pb-1 lg:flex">
        {filters
          .filter((value) => value !== 'all')
          .map((value) => {
            const count = items.filter((item) => item.status === value).length
            const active = filter === value
            return (
              <button
                key={value}
                type="button"
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 border px-3 text-sm font-semibold ${
                  active
                    ? 'border-[var(--admin-accent)] bg-[var(--admin-accent-soft)] text-[#14692a]'
                    : 'border-[var(--admin-line)]'
                }`}
                onClick={() => setFilter(value)}
              >
                <span>{quoteStatusLabel[value]}</span>
                <span className="text-[var(--admin-muted)]">{count}</span>
              </button>
            )
          })}
      </div>
      <div className="mb-3 flex flex-col gap-2.5 lg:mb-4 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <FilterTabs
            value={filter}
            onChange={setFilter}
            label="Offertefilter"
            options={filters.map((value) => ({
              value,
              label: value === 'all' ? 'Alles' : quoteStatusLabel[value] ?? value,
              count:
                value === 'all'
                  ? items.length
                  : items.filter((item) => item.status === value).length,
            }))}
          />
        </div>
        <SearchField
          id="quote-search"
          value={query}
          onChange={setQuery}
          placeholder="Zoek op naam, e-mail of dienst"
        />
      </div>
      <div className="mb-3 flex items-center justify-between gap-3 text-sm text-[var(--admin-muted)]">
        <p>
          {visible.length} resultaat{visible.length === 1 ? '' : 'en'}
          {filtered ? ' (gefilterd)' : ''}
        </p>
        {filtered ? (
          <button
            type="button"
            className="font-semibold underline-offset-2 hover:underline"
            onClick={() => {
              setFilter('all')
              setQuery('')
            }}
          >
            Filters wissen
          </button>
        ) : null}
      </div>
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading ? <SkeletonTable rows={6} /> : null}
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

      <ul className="grid gap-2.5 lg:hidden">
        {visible.map((item) => (
          <li key={item.id} className="admin-card overflow-hidden">
            <Link to={adminUrl(`quotes/${item.id}`)} className="block p-3.5 sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm text-[var(--admin-muted)]">
                    {serviceLabel[item.service ?? ''] ?? item.service}
                  </p>
                  <p className="mt-1 text-sm text-[var(--admin-muted)]">
                    {formatDayMonth(item.created_at)}
                    {item.phone ? ` · ${item.phone}` : ''}
                  </p>
                </div>
                <StatusBadge value={item.status ?? ''} label={quoteStatusLabel[item.status ?? '']} />
              </div>
            </Link>
            <div className="flex flex-wrap gap-2 border-t border-[var(--admin-line)] px-3.5 py-2.5">
              <Link
                to={adminUrl(`quotes/${item.id}`)}
                className="inline-flex min-h-10 items-center bg-[var(--admin-sidebar)] px-3 text-sm font-semibold text-white"
              >
                Behandel offerte
              </Link>
              {item.phone ? (
                <a
                  href={`tel:${item.phone}`}
                  className="inline-flex min-h-10 items-center px-2 text-sm font-semibold"
                >
                  Bellen
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {visible.length > 0 ? (
        <div className="admin-table-wrap hidden lg:block">
          <table>
            <thead>
              <tr>
                <th>Klant</th>
                <th>Dienst</th>
                <th>Telefoon</th>
                <th>E-mail</th>
                <th>Ontvangen</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(adminUrl(`quotes/${item.id}`))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') navigate(adminUrl(`quotes/${item.id}`))
                  }}
                  tabIndex={0}
                  role="link"
                >
                  <td className="font-medium">{item.name}</td>
                  <td>{serviceLabel[item.service ?? ''] ?? item.service}</td>
                  <td>{item.phone || '-'}</td>
                  <td className="break-all">{item.email || '-'}</td>
                  <td>{formatDateTime(item.created_at)}</td>
                  <td>
                    <StatusBadge
                      value={item.status ?? ''}
                      label={quoteStatusLabel[item.status ?? '']}
                    />
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

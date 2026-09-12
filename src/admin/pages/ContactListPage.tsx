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
import { contactStatusLabel, formatDateTime, matchesQuery } from '../labels'
import { adminUrl } from '../adminPath'

const filters = ['all', 'new', 'in_progress', 'answered', 'completed'] as const

function matchesContactFilter(filter: (typeof filters)[number], status?: string): boolean {
  if (filter === 'all') return true
  if (filter === 'in_progress') return status === 'in_progress' || status === 'read'
  if (filter === 'answered') return status === 'answered' || status === 'contacted'
  if (filter === 'completed') return status === 'completed' || status === 'archived'
  return status === filter
}

export function ContactListPage() {
  const [items, setItems] = useState<Array<Record<string, string>>>([])
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void api.admin.contact().then((result) => {
      setLoading(false)
      if (result.ok) setItems(result.data.items)
      else setError(result.message)
    })
  }, [])

  const visible = useMemo(
    () =>
      items.filter(
        (item) =>
          matchesContactFilter(filter, item.status) &&
          matchesQuery(query, item.name, item.email, item.phone, item.subject, item.message),
      ),
    [items, filter, query],
  )

  return (
    <div>
      <PageHeader
        title="Contactaanvragen"
        description="Berichten van het contactformulier. Nieuwe berichten staan bovenaan."
      />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <FilterTabs
          value={filter}
          onChange={setFilter}
          options={filters.map((value) => ({
            value,
            label: value === 'all' ? 'Alles' : contactStatusLabel[value] ?? value,
            count:
              value === 'all'
                ? items.length
                : items.filter((item) => matchesContactFilter(value, item.status)).length,
          }))}
        />
        <SearchField
          id="contact-search"
          value={query}
          onChange={setQuery}
          placeholder="Zoek op naam, e-mail of bericht"
        />
      </div>
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading ? <Skeleton /> : null}
      {!loading && visible.length === 0 && !error ? (
        <EmptyState
          title={items.length === 0 ? 'Geen berichten' : 'Geen resultaten'}
          text={
            items.length === 0
              ? 'Contactformulieren van de website komen hier binnen.'
              : 'Pas de zoekterm of het filter aan.'
          }
        />
      ) : null}

      <ul className="grid gap-2">
        {visible.map((item) => {
          const unread = item.status === 'new'
          return (
            <li key={item.id}>
              <Link
                to={adminUrl(`contact/${item.id}`)}
                className={`admin-card block p-4 ${
                  unread ? 'border-[#1a8a34]/35' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {unread ? <span className="mr-2 inline-block size-1.5 bg-[#1a8a34] align-middle" /> : null}
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-[var(--admin-muted)]">
                      {item.subject ? `${item.subject} · ` : ''}
                      {item.email}
                      {item.phone ? ` · ${item.phone}` : ''}
                    </p>
                  </div>
                  <StatusBadge value={item.status ?? ''} label={contactStatusLabel[item.status ?? '']} />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--admin-ink)]">{item.message}</p>
                <p className="mt-2 text-xs text-[var(--admin-muted)]">{formatDateTime(item.created_at)}</p>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

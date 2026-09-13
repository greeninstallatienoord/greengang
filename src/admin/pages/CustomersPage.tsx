import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { SearchField } from '../components/SearchField'
import { SkeletonTable } from '../components/Skeleton'
import { formatDate, matchesQuery } from '../labels'
import { adminUrl } from '../adminPath'

export function CustomersPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Array<Record<string, string>>>([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void api.admin.customers().then((result) => {
      setLoading(false)
      if (result.ok) setItems(result.data.items)
      else setError(result.message)
    })
  }, [])

  const visible = useMemo(
    () => items.filter((item) => matchesQuery(query, item.name, item.email, item.phone, item.address)),
    [items, query],
  )

  return (
    <div>
      <PageHeader
        title="Klanten"
        description="Samengevoegd op e-mailadres waar mogelijk."
      />
      <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md flex-1">
          <SearchField
            id="customer-search"
            value={query}
            onChange={setQuery}
            placeholder="Zoek op naam, e-mail of telefoon"
          />
        </div>
        <p className="text-sm text-[var(--admin-muted)]">
          {visible.length} klant{visible.length === 1 ? '' : 'en'}
          {query.trim() ? ' (gefilterd)' : ''}
        </p>
      </div>
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading ? <SkeletonTable rows={6} /> : null}
      {!loading && visible.length === 0 && !error ? (
        <EmptyState
          title={items.length === 0 ? 'Nog geen klanten' : 'Geen resultaten'}
          text={
            items.length === 0
              ? 'Klanten ontstaan via afspraak-, offerte- of contactformulieren.'
              : 'Pas de zoekterm aan.'
          }
        />
      ) : null}

      <ul className="grid gap-2.5 lg:hidden">
        {visible.map((item) => (
          <li key={item.id} className="admin-card overflow-hidden">
            <Link to={adminUrl(`customers/${item.id}`)} className="block p-3.5 sm:p-4">
              <p className="font-semibold">{item.name}</p>
              <p className="mt-1 break-words text-sm text-[var(--admin-muted)]">{item.email}</p>
              {item.phone ? (
                <p className="mt-1 text-sm text-[var(--admin-muted)]">{item.phone}</p>
              ) : null}
            </Link>
            <div className="flex flex-wrap gap-2 border-t border-[var(--admin-line)] px-3.5 py-2.5">
              <Link
                to={adminUrl(`customers/${item.id}`)}
                className="inline-flex min-h-10 items-center px-2 text-sm font-semibold"
              >
                Bekijken
              </Link>
              {item.phone ? (
                <a
                  href={`tel:${item.phone}`}
                  className="inline-flex min-h-10 items-center px-2 text-sm font-semibold"
                >
                  Bellen
                </a>
              ) : null}
              {item.email ? (
                <a
                  href={`mailto:${item.email}`}
                  className="inline-flex min-h-10 items-center px-2 text-sm font-semibold"
                >
                  E-mailen
                </a>
              ) : null}
              <Link
                to={adminUrl('appointments/new')}
                className="inline-flex min-h-10 items-center px-2 text-sm font-semibold"
              >
                Afspraak
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {visible.length > 0 ? (
        <div className="admin-table-wrap hidden lg:block">
          <table>
            <thead>
              <tr>
                <th>Naam</th>
                <th>E-mail</th>
                <th>Telefoon</th>
                <th>Sinds</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(adminUrl(`customers/${item.id}`))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') navigate(adminUrl(`customers/${item.id}`))
                  }}
                  tabIndex={0}
                  role="link"
                >
                  <td className="font-medium">{item.name}</td>
                  <td className="break-all">{item.email}</td>
                  <td>{item.phone || '-'}</td>
                  <td>{formatDate(item.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

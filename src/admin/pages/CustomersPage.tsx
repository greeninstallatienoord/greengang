import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { SearchField } from '../components/SearchField'
import { Skeleton } from '../components/Skeleton'
import { formatDate, matchesQuery } from '../labels'
import { adminUrl } from '../adminPath'

export function CustomersPage() {
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
      <div className="mb-4 max-w-md">
        <SearchField
          id="customer-search"
          value={query}
          onChange={setQuery}
          placeholder="Zoek op naam, e-mail of telefoon"
        />
      </div>
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading ? <Skeleton /> : null}
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

      <ul className="grid gap-2 lg:hidden">
        {visible.map((item) => (
          <li key={item.id}>
            <Link
              to={adminUrl(`customers/${item.id}`)}
              className="admin-card block p-4"
            >
              <p className="font-semibold">{item.name}</p>
              <p className="mt-1 text-sm break-words text-[var(--admin-muted)]">{item.email}</p>
              {item.phone ? <p className="mt-1 text-sm text-[var(--admin-muted)]">{item.phone}</p> : null}
            </Link>
          </li>
        ))}
      </ul>

      {visible.length > 0 ? (
        <div className="hidden border border-[var(--admin-line)] bg-[var(--admin-panel)] lg:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--admin-line)] text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
                <th className="px-4 py-3 font-semibold">Naam</th>
                <th className="px-4 py-3 font-semibold">E-mail</th>
                <th className="px-4 py-3 font-semibold">Telefoon</th>
                <th className="px-4 py-3 font-semibold">Sinds</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id} className="border-b border-[var(--admin-line)] last:border-0 hover:bg-[var(--admin-hover)]">
                  <td className="px-4 py-3">
                    <Link className="font-medium underline decoration-[var(--admin-line)] underline-offset-2" to={adminUrl(`customers/${item.id}`)}>
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 break-all">{item.email}</td>
                  <td className="px-4 py-3">{item.phone || '-'}</td>
                  <td className="px-4 py-3">{formatDate(item.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

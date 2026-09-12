import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { adminUrl } from '../adminPath'

export function CustomersPage() {
  const [items, setItems] = useState<Array<Record<string, string>>>([])
  const [error, setError] = useState('')

  useEffect(() => {
    void api.admin.customers().then((result) => {
      if (result.ok) setItems(result.data.items)
      else setError(result.message)
    })
  }, [])

  return (
    <div>
      <PageHeader title="Klanten" description="Samengevoegd op e-mailadres waar mogelijk." />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {items.length === 0 && !error ? (
        <EmptyState title="Nog geen klanten" text="Klanten ontstaan via afspraak-, offerte- of contactformulieren." />
      ) : (
        <ul className="grid gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link to={adminUrl(`customers/${item.id}`)} className="block rounded-md border border-line bg-paper p-4">
                <p className="font-semibold">{item.name}</p>
                <p className="mt-1 text-sm text-ink-muted break-words">
                  {item.email}
                  {item.phone ? ` · ${item.phone}` : ''}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

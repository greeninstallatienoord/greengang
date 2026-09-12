import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { contactStatusLabel, formatDate } from '../labels'
import { adminUrl } from '../adminPath'

export function ContactListPage() {
  const [items, setItems] = useState<Array<Record<string, string>>>([])
  const [error, setError] = useState('')

  useEffect(() => {
    void api.admin.contact().then((result) => {
      if (result.ok) setItems(result.data.items)
      else setError(result.message)
    })
  }, [])

  return (
    <div>
      <PageHeader title="Contact" />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {items.length === 0 && !error ? (
        <EmptyState title="Geen berichten" text="Contactformulieren van de website komen hier binnen." />
      ) : (
        <ul className="grid gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link to={adminUrl(`contact/${item.id}`)} className="block rounded-md border border-line bg-paper p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{item.name}</p>
                  <StatusBadge value={item.status ?? ''} label={contactStatusLabel[item.status ?? '']} />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{item.message}</p>
                <p className="mt-2 text-xs text-ink-muted">{formatDate(item.created_at)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

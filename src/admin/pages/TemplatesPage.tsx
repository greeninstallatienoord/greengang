import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { adminUrl } from '../adminPath'

export function TemplatesPage() {
  const [items, setItems] = useState<Array<Record<string, string>>>([])
  const [error, setError] = useState('')

  useEffect(() => {
    void api.admin.templates().then((result) => {
      if (result.ok) setItems(result.data.items)
      else setError(result.message)
    })
  }, [])

  return (
    <div>
      <PageHeader
        title="Templates"
        description="{{customer.name}}, {{customer.firstName}}, {{customer.email}}, {{appointment.date}}, {{appointment.time}}, {{appointment.service}}"
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {items.length === 0 && !error ? (
        <EmptyState title="Geen templates" text="Pas de database-migratie toe om de standaardtemplates te laden." />
      ) : (
        <ul className="grid gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link to={adminUrl(`templates/${item.id}`)} className="block rounded-md border border-line bg-paper p-4">
                <p className="font-semibold">{item.name}</p>
                <p className="mt-1 text-sm text-ink-muted">{item.subject}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

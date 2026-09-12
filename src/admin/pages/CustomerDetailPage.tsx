import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../lib/api'
import { BackLink } from '../components/BackLink'
import { InfoList } from '../components/InfoList'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import {
  appointmentStatusLabel,
  contactStatusLabel,
  formatDate,
  quoteStatusLabel,
  serviceLabel,
} from '../labels'
import { adminUrl } from '../adminPath'

export function CustomerDetailPage() {
  const { id = '' } = useParams()
  type CustomerDetail = {
    name?: string
    email?: string
    phone?: string
    address?: string
    created_at?: string
    appointments: Array<Record<string, string>>
    quotes: Array<Record<string, string>>
    contacts: Array<Record<string, string>>
  }

  const [item, setItem] = useState<CustomerDetail | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    void api.admin.customer(id).then((result) => {
      if (result.ok) setItem({ ...result.data, contacts: result.data.contacts ?? [] })
      else setError(result.message)
    })
  }, [id])

  if (error) return <Notice tone="error">{error}</Notice>
  if (!item) return <Skeleton rows={5} />

  return (
    <div>
      <BackLink to={adminUrl('customers')}>Terug naar klanten</BackLink>
      <PageHeader title={item.name ?? 'Klant'} />
      <InfoList
        items={[
          { label: 'Naam', value: item.name },
          { label: 'E-mail', value: item.email, href: item.email ? `mailto:${item.email}` : undefined },
          { label: 'Telefoon', value: item.phone, href: item.phone ? `tel:${item.phone}` : undefined },
          { label: 'Adres', value: item.address },
          { label: 'Sinds', value: formatDate(item.created_at) },
        ]}
      />

      <RelationList
        title="Afspraken"
        empty="Geen afspraken."
        items={item.appointments}
        href={(row) => adminUrl(`appointments/${row.id}`)}
        label={(row) =>
          `${serviceLabel[row.service ?? ''] ?? row.service} · ${formatDate(row.appointment_date)} · ${row.appointment_time}`
        }
        status={(row) => ({
          value: row.status ?? '',
          label: appointmentStatusLabel[row.status ?? ''] ?? row.status ?? '',
        })}
      />

      <RelationList
        title="Offertes"
        empty="Geen offertes."
        items={item.quotes}
        href={(row) => adminUrl(`quotes/${row.id}`)}
        label={(row) => `${serviceLabel[row.service ?? ''] ?? row.service} · ${formatDate(row.created_at)}`}
        status={(row) => ({
          value: row.status ?? '',
          label: quoteStatusLabel[row.status ?? ''] ?? row.status ?? '',
        })}
      />

      <RelationList
        title="Contactaanvragen"
        empty="Geen contactaanvragen."
        items={item.contacts}
        href={(row) => adminUrl(`contact/${row.id}`)}
        label={(row) => row.message || formatDate(row.created_at)}
        status={(row) => ({
          value: row.status ?? '',
          label: contactStatusLabel[row.status ?? ''] ?? row.status ?? '',
        })}
      />
    </div>
  )
}

function RelationList({
  title,
  empty,
  items,
  href,
  label,
  status,
}: {
  title: string
  empty: string
  items: Array<Record<string, string>>
  href: (row: Record<string, string>) => string
  label: (row: Record<string, string>) => string
  status: (row: Record<string, string>) => { value: string; label: string }
}) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-sm font-semibold tracking-[-0.01em]">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--admin-muted)]">{empty}</p>
      ) : (
        <ul className="grid gap-px overflow-hidden border border-[var(--admin-line)] bg-[var(--admin-line)]">
          {items.map((row) => {
            const badge = status(row)
            return (
              <li key={row.id}>
                <Link
                  to={href(row)}
                  className="flex items-start justify-between gap-3 bg-[var(--admin-panel)] px-4 py-3 text-sm transition-colors hover:bg-[var(--admin-hover)]"
                >
                  <span className="min-w-0 line-clamp-2">{label(row)}</span>
                  <StatusBadge value={badge.value} label={badge.label} />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

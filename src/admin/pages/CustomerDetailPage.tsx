import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ActivityTimeline, type TimelineItem } from '../components/ActivityTimeline'
import { BackLink } from '../components/BackLink'
import { InfoList } from '../components/InfoList'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import { StickyActions } from '../components/StatusSheet'
import {
  appointmentStatusLabel,
  contactStatusLabel,
  formatDate,
  formatDateTime,
  quoteStatusLabel,
  serviceLabel,
} from '../labels'
import { adminUrl } from '../adminPath'
import { api } from '../../lib/api'

export function CustomerDetailPage() {
  const { id = '' } = useParams()
  type CustomerDetail = {
    id?: string
    name?: string
    email?: string
    phone?: string
    address?: string
    created_at?: string
    last_activity?: string
    appointments: Array<Record<string, string>>
    quotes: Array<Record<string, string>>
    contacts: Array<Record<string, string>>
    emails?: Array<Record<string, string>>
    activity?: TimelineItem[]
  }

  const [item, setItem] = useState<CustomerDetail | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    void api.admin.customer(id).then((result) => {
      if (result.ok) {
        setItem({
          ...result.data,
          contacts: result.data.contacts ?? [],
          activity: result.data.activity ?? [],
          emails: result.data.emails ?? [],
        })
      } else setError(result.message)
    })
  }, [id])

  if (error) return <Notice tone="error">{error}</Notice>
  if (!item) return <Skeleton rows={5} />

  const composeHref = `${adminUrl('emails')}?to=${encodeURIComponent(item.email ?? '')}&name=${encodeURIComponent(item.name ?? '')}#compose`
  const appointmentHref = `${adminUrl('appointments/new')}?name=${encodeURIComponent(item.name ?? '')}&email=${encodeURIComponent(item.email ?? '')}&phone=${encodeURIComponent(item.phone ?? '')}&address=${encodeURIComponent(item.address ?? '')}`

  return (
    <div className="pb-24 lg:pb-0">
      <BackLink to={adminUrl('customers')}>Terug naar klanten</BackLink>
      <PageHeader
        title={item.name ?? 'Klant'}
        description="Klantprofiel met aanvragen, afspraken en communicatie."
      />

      <InfoList
        items={[
          { label: 'Naam', value: item.name },
          { label: 'E-mail', value: item.email, href: item.email ? `mailto:${item.email}` : undefined },
          { label: 'Telefoon', value: item.phone, href: item.phone ? `tel:${item.phone}` : undefined },
          { label: 'Adres', value: item.address },
          { label: 'Eerste keer gezien', value: formatDate(item.created_at) },
          { label: 'Laatste activiteit', value: formatDateTime(item.last_activity) },
        ]}
      />

      <section className="admin-panel mt-6 p-4">
        <h2 className="mb-3 text-sm font-semibold tracking-[-0.01em]">Activiteit</h2>
        <ActivityTimeline items={item.activity ?? []} />
      </section>

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
        label={(row) => row.subject || row.message || formatDate(row.created_at)}
        status={(row) => ({
          value: row.status ?? '',
          label: contactStatusLabel[row.status ?? ''] ?? row.status ?? '',
        })}
      />

      {(item.emails?.length ?? 0) > 0 ? (
        <RelationList
          title="E-mails"
          empty="Geen e-mails."
          items={item.emails ?? []}
          href={(row) => adminUrl(`emails/logs/${row.id}`)}
          label={(row) => row.subject || 'E-mail'}
          status={(row) => ({
            value: row.status ?? '',
            label: row.status ?? '',
          })}
        />
      ) : null}

      <StickyActions>
        {item.phone ? (
          <a
            href={`tel:${item.phone}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center bg-[var(--admin-sidebar)] px-4 text-sm font-semibold text-white sm:flex-none"
          >
            Bel klant
          </a>
        ) : null}
        {item.email ? (
          <Link
            to={composeHref}
            className="inline-flex min-h-11 flex-1 items-center justify-center border border-[var(--admin-line)] px-4 text-sm font-semibold sm:flex-none"
          >
            Nieuwe e-mail
          </Link>
        ) : null}
        <Link
          to={appointmentHref}
          className="inline-flex min-h-11 flex-1 items-center justify-center border border-[var(--admin-line)] px-4 text-sm font-semibold sm:flex-none"
        >
          Nieuwe afspraak
        </Link>
      </StickyActions>
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
        <ul className="admin-panel divide-y divide-[var(--admin-line)] overflow-hidden">
          {items.map((row) => {
            const badge = status(row)
            return (
              <li key={row.id}>
                <Link
                  to={href(row)}
                  className="flex items-start justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-[var(--admin-hover)]"
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

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../../components/ButtonLink'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { activityLabel, appointmentStatusLabel, formatDate, serviceLabel } from '../labels'
import { adminUrl } from '../adminPath'

type DashboardData = {
  appointmentsToday: number
  upcomingAppointments: number
  newQuotes: number
  unreadContacts: number
  todayItems: Array<Record<string, string>>
  upcomingItems: Array<Record<string, string>>
  recent: Array<Record<string, string>>
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    void api.admin.dashboard().then((result) => {
      if (result.ok) setData(result.data)
      else {
        setError(result.message)
        setUnavailable(Boolean(result.unavailable))
      }
    })
  }, [])

  if (unavailable || error) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <EmptyState
          title="Geen live cijfers"
          text={error || 'De serverkoppeling is nog niet beschikbaar. Er worden geen voorbeeldstatistieken getoond.'}
        />
      </div>
    )
  }

  if (!data) return <p className="text-sm text-ink-muted">Dashboard wordt geladen…</p>

  const cards = [
    { label: 'Vandaag', value: data.appointmentsToday, to: 'appointments' },
    { label: 'Aankomende afspraken', value: data.upcomingAppointments, to: 'appointments' },
    { label: 'Nieuwe offerteaanvragen', value: data.newQuotes, to: 'quotes' },
    { label: 'Nieuwe contactaanvragen', value: data.unreadContacts, to: 'contact' },
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overzicht van openstaande aanvragen. Cijfers komen uit de database."
        actions={
          <>
            <ButtonLink to={adminUrl('appointments/new')}>Nieuwe afspraak</ButtonLink>
            <ButtonLink to={adminUrl('emails')} variant="secondary">
              Nieuwe e-mail
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={adminUrl(card.to)}
            className="rounded-md border border-line bg-paper p-4"
          >
            <p className="text-sm text-ink-muted">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold">{card.value}</p>
          </Link>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-base font-semibold">Vandaag</h2>
        {data.todayItems.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Geen afspraken vandaag" text="Nieuwe aanvragen verschijnen hier automatisch." />
          </div>
        ) : (
          <ul className="mt-3 grid gap-2">
            {data.todayItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={adminUrl(`appointments/${item.id}`)}
                  className="flex items-center justify-between gap-3 rounded-md border border-line bg-paper px-3 py-3"
                >
                  <span>
                    <span className="font-medium">{item.name}</span>
                    <span className="block text-sm text-ink-muted">
                      {item.appointment_time} · {serviceLabel[item.service ?? ''] ?? item.service}
                    </span>
                  </span>
                  <StatusBadge
                    value={item.status ?? ''}
                    label={appointmentStatusLabel[item.status ?? '']}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-base font-semibold">Aankomende afspraken</h2>
        {data.upcomingItems.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Nog geen aankomende afspraken" text="Bevestigde en openstaande aanvragen komen hier te staan." />
          </div>
        ) : (
          <ul className="mt-3 grid gap-2">
            {data.upcomingItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={adminUrl(`appointments/${item.id}`)}
                  className="flex items-center justify-between gap-3 rounded-md border border-line bg-paper px-3 py-3"
                >
                  <span>
                    <span className="font-medium">{item.name}</span>
                    <span className="block text-sm text-ink-muted">
                      {formatDate(item.appointment_date)} · {item.appointment_time}
                    </span>
                  </span>
                  <StatusBadge
                    value={item.status ?? ''}
                    label={appointmentStatusLabel[item.status ?? '']}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-base font-semibold">Recente activiteit</h2>
        {data.recent.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="Nog geen activiteit" text="Afspraken, offertes en contactberichten verschijnen hier." />
          </div>
        ) : (
          <ul className="mt-3 grid gap-2 text-sm">
            {data.recent.map((item, index) => (
              <li key={item.id ?? String(index)} className="rounded-md border border-line bg-paper px-3 py-2">
                {activityLabel[item.kind ?? ''] ?? item.kind} · {item.name} · {formatDate(item.created_at)}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

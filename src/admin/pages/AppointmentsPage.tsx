import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../../components/ButtonLink'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { FilterTabs } from '../components/FilterTabs'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { SearchField } from '../components/SearchField'
import { Skeleton } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import { appointmentStatusLabel, formatDate, matchesQuery, serviceLabel, todayIso } from '../labels'
import { adminUrl } from '../adminPath'

const filters = ['all', 'today', 'upcoming', 'pending', 'cancelled', 'completed'] as const
const filterLabel: Record<(typeof filters)[number], string> = {
  all: 'Alles',
  today: 'Vandaag',
  upcoming: 'Komende afspraken',
  pending: 'Wacht op bevestiging',
  cancelled: 'Geannuleerd',
  completed: 'Afgerond',
}

function statusKey(status?: string): string {
  return status === 'requested' ? 'pending' : status ?? ''
}

function matchesAppointmentFilter(
  filter: (typeof filters)[number],
  item: Record<string, string>,
  today: string,
): boolean {
  const status = statusKey(item.status)
  const date = item.appointment_date ?? ''
  if (filter === 'all') return true
  if (filter === 'today') return date === today && status !== 'cancelled'
  if (filter === 'upcoming') {
    return date > today && (status === 'pending' || status === 'confirmed')
  }
  return status === filter
}

export function AppointmentsPage() {
  const [items, setItems] = useState<Array<Record<string, string>>>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    void api.admin.appointments().then((result) => {
      setLoading(false)
      if (result.ok) setItems(result.data.items)
      else setError(result.message)
    })
  }, [])

  const today = todayIso()
  const visible = useMemo(() => {
    return items.filter(
      (item) =>
        matchesAppointmentFilter(filter, item, today) &&
        matchesQuery(query, item.name, item.email, item.phone, serviceLabel[item.service ?? ''], item.service),
    )
  }, [items, filter, query, today])

  return (
    <div>
      <PageHeader
        title="Afspraken"
        description="Aanvragen van de website en handmatig geplaatste afspraken."
        actions={<ButtonLink to={adminUrl('appointments/new')}>Nieuwe afspraak</ButtonLink>}
      />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <FilterTabs
          value={filter}
          onChange={setFilter}
          options={filters.map((value) => ({
            value,
            label: filterLabel[value],
            count:
              value === 'all'
                ? items.length
                : items.filter((item) => matchesAppointmentFilter(value, item, today)).length,
          }))}
        />
        <SearchField
          id="appointment-search"
          value={query}
          onChange={setQuery}
          placeholder="Zoek op naam, e-mail of dienst"
        />
      </div>
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading ? <Skeleton /> : null}
      {!loading && visible.length === 0 && !error ? (
        <EmptyState
          title={items.length === 0 ? 'Nog geen afspraken' : 'Geen resultaten'}
          text={
            items.length === 0
              ? 'Aanvragen van de website of een nieuwe afspraak verschijnen hier.'
              : 'Pas de zoekterm of het filter aan.'
          }
          action={
            items.length === 0 ? (
              <ButtonLink to={adminUrl('appointments/new')}>Nieuwe afspraak</ButtonLink>
            ) : undefined
          }
        />
      ) : null}

      <ul className="grid gap-2 lg:hidden">
        {visible.map((item) => (
          <li key={item.id}>
            <Link
              to={adminUrl(`appointments/${item.id}`)}
              className="admin-card block p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold tracking-[-0.02em]">
                    {formatDate(item.appointment_date)} · {item.appointment_time}
                  </p>
                  <p className="mt-1 font-medium">{item.name}</p>
                </div>
                <StatusBadge value={item.status ?? ''} label={appointmentStatusLabel[item.status ?? '']} />
              </div>
              <p className="mt-2 text-sm text-[var(--admin-muted)]">
                {serviceLabel[item.service ?? ''] ?? item.service}
              </p>
            </Link>
            {(item.phone || item.email) && (
              <div className="flex gap-4 border border-t-0 border-[var(--admin-line)] bg-[var(--admin-panel)] px-4 py-2.5 text-sm font-medium">
                {item.phone ? (
                  <a href={`tel:${item.phone}`} className="min-h-10 inline-flex items-center">
                    Bellen
                  </a>
                ) : null}
                {item.email ? (
                  <a href={`mailto:${item.email}`} className="min-h-10 inline-flex items-center">
                    E-mail
                  </a>
                ) : null}
              </div>
            )}
          </li>
        ))}
      </ul>

      {visible.length > 0 ? (
        <div className="hidden border border-[var(--admin-line)] bg-[var(--admin-panel)] lg:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--admin-line)] text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
                <th className="px-4 py-3 font-semibold">Datum</th>
                <th className="px-4 py-3 font-semibold">Tijd</th>
                <th className="px-4 py-3 font-semibold">Klant</th>
                <th className="px-4 py-3 font-semibold">Dienst</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr key={item.id} className="border-b border-[var(--admin-line)] last:border-0 hover:bg-[var(--admin-hover)]">
                  <td className="px-4 py-3 font-medium">{formatDate(item.appointment_date)}</td>
                  <td className="px-4 py-3">{item.appointment_time}</td>
                  <td className="px-4 py-3">
                    <Link className="font-medium underline decoration-[var(--admin-line)] underline-offset-2" to={adminUrl(`appointments/${item.id}`)}>
                      {item.name}
                    </Link>
                    {item.email ? (
                      <span className="mt-0.5 block text-xs text-[var(--admin-muted)]">{item.email}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{serviceLabel[item.service ?? ''] ?? item.service}</td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.status ?? ''} label={appointmentStatusLabel[item.status ?? '']} />
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

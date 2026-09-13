import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ButtonLink } from '../../components/ButtonLink'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { FilterTabs } from '../components/FilterTabs'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { SearchField } from '../components/SearchField'
import { Skeleton } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import {
  appointmentStatusLabel,
  formatDate,
  formatDayMonth,
  matchesQuery,
  serviceLabel,
  todayIso,
} from '../labels'
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
  const navigate = useNavigate()
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
        matchesQuery(
          query,
          item.name,
          item.email,
          item.phone,
          serviceLabel[item.service ?? ''],
          item.service,
        ),
    )
  }, [items, filter, query, today])

  const filtered = filter !== 'all' || query.trim().length > 0

  return (
    <div>
      <PageHeader
        title="Afspraken"
        description="Aanvragen van de website en handmatig geplaatste afspraken."
        actions={
          <div className="flex flex-wrap gap-2">
            <ButtonLink to={adminUrl('calendar')} variant="secondary" className="min-h-11">
              Agenda
            </ButtonLink>
            <ButtonLink to={adminUrl('appointments/new')} className="min-h-11">
              Nieuwe afspraak
            </ButtonLink>
          </div>
        }
      />
      <div className="mb-3 flex flex-col gap-2.5 lg:mb-4 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <FilterTabs
            value={filter}
            onChange={setFilter}
            label="Afspraakfilter"
            options={filters.map((value) => ({
              value,
              label: filterLabel[value],
              count:
                value === 'all'
                  ? items.length
                  : items.filter((item) => matchesAppointmentFilter(value, item, today)).length,
            }))}
          />
        </div>
        <SearchField
          id="appointment-search"
          value={query}
          onChange={setQuery}
          placeholder="Zoek op naam, e-mail of dienst"
        />
      </div>
      <div className="mb-3 flex items-center justify-between gap-3 text-sm text-[var(--admin-muted)]">
        <p>
          {visible.length} resultaat{visible.length === 1 ? '' : 'en'}
          {filtered ? ' (gefilterd)' : ''}
        </p>
        {filtered ? (
          <button
            type="button"
            className="font-semibold underline-offset-2 hover:underline"
            onClick={() => {
              setFilter('all')
              setQuery('')
            }}
          >
            Filters wissen
          </button>
        ) : null}
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

      <ul className="grid gap-2.5 lg:hidden">
        {visible.map((item) => {
          const pending = item.status === 'pending' || item.status === 'requested'
          return (
            <li key={item.id} className="admin-card overflow-hidden">
              <Link to={adminUrl(`appointments/${item.id}`)} className="block p-3.5 sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold tracking-[-0.02em]">
                      {formatDayMonth(item.appointment_date)} · {item.appointment_time}
                    </p>
                    <p className="mt-1 font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-[var(--admin-muted)]">
                      {serviceLabel[item.service ?? ''] ?? item.service}
                    </p>
                  </div>
                  <StatusBadge
                    value={item.status ?? ''}
                    label={appointmentStatusLabel[item.status ?? '']}
                  />
                </div>
              </Link>
              <div className="flex flex-wrap gap-2 border-t border-[var(--admin-line)] bg-[var(--admin-panel)] px-3.5 py-2.5">
                <Link
                  to={adminUrl(`appointments/${item.id}`)}
                  className="inline-flex min-h-10 items-center px-2 text-sm font-semibold"
                >
                  Bekijken
                </Link>
                {pending ? (
                  <Link
                    to={adminUrl(`appointments/${item.id}`)}
                    className="inline-flex min-h-10 items-center bg-[var(--admin-sidebar)] px-3 text-sm font-semibold text-white"
                  >
                    Bevestigen
                  </Link>
                ) : null}
                {item.phone ? (
                  <a
                    href={`tel:${item.phone}`}
                    className="inline-flex min-h-10 items-center px-2 text-sm font-semibold"
                  >
                    Bellen
                  </a>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>

      {visible.length > 0 ? (
        <div className="admin-table-wrap hidden lg:block">
          <table>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Tijd</th>
                <th>Klant</th>
                <th>Dienst</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(adminUrl(`appointments/${item.id}`))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') navigate(adminUrl(`appointments/${item.id}`))
                  }}
                  tabIndex={0}
                  role="link"
                >
                  <td className="font-medium">{formatDate(item.appointment_date)}</td>
                  <td>{item.appointment_time}</td>
                  <td>
                    <span className="font-medium">{item.name}</span>
                    {item.email ? (
                      <span className="mt-0.5 block text-xs text-[var(--admin-muted)]">
                        {item.email}
                      </span>
                    ) : null}
                  </td>
                  <td>{serviceLabel[item.service ?? ''] ?? item.service}</td>
                  <td>
                    <StatusBadge
                      value={item.status ?? ''}
                      label={appointmentStatusLabel[item.status ?? '']}
                    />
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

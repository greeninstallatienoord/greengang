import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import {
  appointmentStatusLabel,
  formatDate,
  formatDayMonth,
  serviceLabel,
  todayIso,
} from '../labels'
import { adminUrl } from '../adminPath'

type ViewMode = 'month' | 'week' | 'day'

function parseYmd(value: string): Date {
  const parts = value.split('-').map((part) => Number(part))
  const y = parts[0] ?? 1970
  const m = parts[1] ?? 1
  const d = parts[2] ?? 1
  return new Date(y, m - 1, d)
}

function toYmd(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function startOfWeek(date: Date): Date {
  const copy = new Date(date)
  const day = (copy.getDay() + 6) % 7
  copy.setDate(copy.getDate() - day)
  return copy
}

function addDays(date: Date, amount: number): Date {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + amount)
  return copy
}

function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat('nl-NL', { month: 'long', year: 'numeric' }).format(date)
}

function weekdayShort(date: Date): string {
  return new Intl.DateTimeFormat('nl-NL', { weekday: 'short' }).format(date)
}

export function CalendarPage() {
  const today = todayIso()
  const [cursor, setCursor] = useState(() => parseYmd(today))
  const [view, setView] = useState<ViewMode>(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
      ? 'day'
      : 'month',
  )
  const [items, setItems] = useState<Array<Record<string, string>>>([])
  const [error, setError] = useState('')
  const [loadedRange, setLoadedRange] = useState('')

  const range = useMemo(() => {
    if (view === 'day') {
      const day = toYmd(cursor)
      return { from: day, to: day }
    }
    if (view === 'week') {
      const start = startOfWeek(cursor)
      return { from: toYmd(start), to: toYmd(addDays(start, 6)) }
    }
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0)
    return { from: toYmd(first), to: toYmd(last) }
  }, [cursor, view])

  const loading = loadedRange !== `${range.from}:${range.to}`

  useEffect(() => {
    let active = true
    void api.admin.appointments({ from: range.from, to: range.to }).then((result) => {
      if (!active) return
      if (result.ok) {
        setItems(result.data.items)
        setError('')
      } else {
        setError(result.message)
      }
      setLoadedRange(`${range.from}:${range.to}`)
    })
    return () => {
      active = false
    }
  }, [range.from, range.to])

  const byDate = useMemo(() => {
    const map = new Map<string, Array<Record<string, string>>>()
    for (const item of items) {
      const key = item.appointment_date ?? ''
      const list = map.get(key) ?? []
      list.push(item)
      map.set(key, list)
    }
    return map
  }, [items])

  const upcoming = useMemo(
    () =>
      [...items]
        .filter((item) => (item.appointment_date ?? '') >= today)
        .sort((a, b) =>
          `${a.appointment_date}${a.appointment_time}`.localeCompare(
            `${b.appointment_date}${b.appointment_time}`,
          ),
        ),
    [items, today],
  )

  function shift(amount: number) {
    setCursor((current) => {
      if (view === 'day') return addDays(current, amount)
      if (view === 'week') return addDays(current, amount * 7)
      return new Date(current.getFullYear(), current.getMonth() + amount, 1)
    })
  }

  const monthCells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const start = startOfWeek(first)
    return Array.from({ length: 42 }, (_, index) => addDays(start, index))
  }, [cursor])

  const weekDays = useMemo(() => {
    const start = startOfWeek(cursor)
    return Array.from({ length: 7 }, (_, index) => addDays(start, index))
  }, [cursor])

  return (
    <div>
      <PageHeader
        title="Agenda"
        description="Afspraken in maand-, week- of dagweergave."
        actions={
          <Link
            to={adminUrl('appointments')}
            className="inline-flex min-h-11 items-center border border-[var(--admin-line)] px-4 text-sm font-semibold"
          >
            Lijstweergave
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center border border-[var(--admin-line)]"
            aria-label="Vorige"
            onClick={() => shift(-1)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center border border-[var(--admin-line)]"
            aria-label="Volgende"
            onClick={() => shift(1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <p className="min-w-0 flex-1 text-sm font-semibold capitalize">
          {view === 'day'
            ? new Intl.DateTimeFormat('nl-NL', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              }).format(cursor)
            : view === 'week'
              ? `Week van ${formatDate(toYmd(startOfWeek(cursor)))}`
              : monthLabel(cursor)}
        </p>
        <button
          type="button"
          className="inline-flex min-h-11 items-center border border-[var(--admin-line)] px-3 text-sm font-semibold"
          onClick={() => setCursor(parseYmd(today))}
        >
          Vandaag
        </button>
        <div className="hidden gap-1 lg:flex">
          {(['month', 'week', 'day'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`inline-flex min-h-11 items-center px-3 text-sm font-semibold ${
                view === mode
                  ? 'bg-[var(--admin-sidebar)] text-white'
                  : 'border border-[var(--admin-line)]'
              }`}
              onClick={() => setView(mode)}
            >
              {mode === 'month' ? 'Maand' : mode === 'week' ? 'Week' : 'Dag'}
            </button>
          ))}
        </div>
        <div className="flex gap-1 lg:hidden">
          {(['day', 'week'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`inline-flex min-h-11 items-center px-3 text-sm font-semibold ${
                view === mode
                  ? 'bg-[var(--admin-sidebar)] text-white'
                  : 'border border-[var(--admin-line)]'
              }`}
              onClick={() => setView(mode)}
            >
              {mode === 'week' ? 'Week' : 'Dag'}
            </button>
          ))}
        </div>
      </div>

      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading ? <Skeleton /> : null}

      {/* Desktop month */}
      {!loading && view === 'month' ? (
        <div className="admin-panel hidden overflow-hidden lg:block">
          <div className="grid grid-cols-7 border-b border-[var(--admin-line)]">
            {weekDays.map((day) => (
              <div
                key={weekdayShort(day)}
                className="px-2 py-2 text-center text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase"
              >
                {weekdayShort(day)}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthCells.map((day) => {
              const key = toYmd(day)
              const inMonth = day.getMonth() === cursor.getMonth()
              const isToday = key === today
              const dayItems = byDate.get(key) ?? []
              return (
                <button
                  key={key}
                  type="button"
                  className={`min-h-28 border-r border-b border-[var(--admin-line)] p-1.5 text-left align-top ${
                    inMonth ? 'bg-[var(--admin-panel)]' : 'bg-[var(--admin-hover)]/40'
                  }`}
                  onClick={() => {
                    setCursor(day)
                    setView('day')
                  }}
                >
                  <span
                    className={`inline-flex size-7 items-center justify-center text-xs font-semibold ${
                      isToday
                        ? 'bg-[var(--admin-accent)] text-white'
                        : inMonth
                          ? 'text-[var(--admin-ink)]'
                          : 'text-[var(--admin-muted)]'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  <ul className="mt-1 grid gap-0.5">
                    {dayItems.slice(0, 3).map((item) => (
                      <li key={item.id}>
                        <Link
                          to={adminUrl(`appointments/${item.id}`)}
                          className="block truncate rounded-sm bg-[var(--admin-accent-soft)] px-1 py-0.5 text-[10px] font-semibold text-[#14692a]"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {item.appointment_time} {item.name}
                        </Link>
                      </li>
                    ))}
                    {dayItems.length > 3 ? (
                      <li className="px-1 text-[10px] text-[var(--admin-muted)]">
                        +{dayItems.length - 3} meer
                      </li>
                    ) : null}
                  </ul>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* Desktop week */}
      {!loading && view === 'week' ? (
        <div className="admin-panel hidden overflow-hidden lg:block">
          <div className="grid grid-cols-7">
            {weekDays.map((day) => {
              const key = toYmd(day)
              const dayItems = byDate.get(key) ?? []
              const isToday = key === today
              return (
                <div key={key} className="min-h-40 border-r border-[var(--admin-line)] p-2 last:border-r-0">
                  <p className={`text-xs font-semibold ${isToday ? 'text-[var(--admin-accent)]' : ''}`}>
                    {weekdayShort(day)} {day.getDate()}
                  </p>
                  <ul className="mt-2 grid gap-1">
                    {dayItems.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={adminUrl(`appointments/${item.id}`)}
                          className="block border border-[var(--admin-line)] bg-[var(--admin-accent-soft)] px-2 py-1.5"
                        >
                          <span className="block text-xs font-semibold">
                            {item.appointment_time}
                          </span>
                          <span className="block truncate text-xs">{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}

      {/* Mobile / day agenda */}
      {!loading && (view === 'day' || view === 'week') ? (
        <div className={view === 'week' ? 'lg:hidden' : ''}>
          {view === 'week' ? (
            <div className="mb-3 flex gap-1 overflow-x-auto pb-1">
              {weekDays.map((day) => {
                const key = toYmd(day)
                const active = key === toYmd(cursor)
                const count = (byDate.get(key) ?? []).length
                return (
                  <button
                    key={key}
                    type="button"
                    className={`min-w-[3.25rem] shrink-0 border px-2 py-2 text-center ${
                      active
                        ? 'border-[var(--admin-accent)] bg-[var(--admin-accent-soft)]'
                        : 'border-[var(--admin-line)]'
                    }`}
                    onClick={() => {
                      setCursor(day)
                      setView('day')
                    }}
                  >
                    <span className="block text-[10px] font-semibold uppercase text-[var(--admin-muted)]">
                      {weekdayShort(day)}
                    </span>
                    <span className="block text-sm font-semibold">{day.getDate()}</span>
                    {count > 0 ? (
                      <span className="mt-0.5 block text-[10px] text-[var(--admin-accent)]">
                        {count}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          ) : null}

          {(byDate.get(toYmd(cursor)) ?? []).length === 0 ? (
            <EmptyState title="Geen afspraken" text="Er staan geen afspraken op deze dag." />
          ) : (
            <ul className="grid gap-2.5">
              {(byDate.get(toYmd(cursor)) ?? []).map((item) => (
                <li key={item.id} className="admin-card overflow-hidden">
                  <Link to={adminUrl(`appointments/${item.id}`)} className="block p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">
                          {item.appointment_time} · {item.name}
                        </p>
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
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {/* Mobile month fallback: agenda list */}
      {!loading && view === 'month' ? (
        <div className="lg:hidden">
          <p className="mb-2 text-sm font-semibold">Komende afspraken deze maand</p>
          {upcoming.length === 0 ? (
            <EmptyState title="Geen afspraken" text="Er staan geen aankomende afspraken in deze periode." />
          ) : (
            <ul className="grid gap-2.5">
              {upcoming.map((item) => (
                <li key={item.id} className="admin-card overflow-hidden">
                  <Link to={adminUrl(`appointments/${item.id}`)} className="block p-3.5">
                    <p className="font-semibold">
                      {formatDayMonth(item.appointment_date)} · {item.appointment_time}
                    </p>
                    <p className="mt-1 text-sm">{item.name}</p>
                    <p className="mt-1 text-sm text-[var(--admin-muted)]">
                      {serviceLabel[item.service ?? ''] ?? item.service}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}

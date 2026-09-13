import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarPlus, MailPlus } from 'lucide-react'
import { ButtonLink } from '../../components/ButtonLink'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { SkeletonCards } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import {
  activityLabel,
  appointmentStatusLabel,
  contactStatusLabel,
  emailStatusLabel,
  formatDate,
  formatDateTime,
  formatDayMonth,
  greeting,
  quoteStatusLabel,
  serviceLabel,
} from '../labels'
import { adminUrl } from '../adminPath'

type DashboardData = {
  appointmentsToday: number
  upcomingAppointments: number
  newQuotes: number
  unreadContacts: number
  pendingAppointments: number
  todayItems: Array<Record<string, string>>
  upcomingItems: Array<Record<string, string>>
  recent: Array<Record<string, string>>
  pendingQuoteItems: Array<Record<string, string>>
  recentContacts: Array<Record<string, string>>
  recentEmails: Array<Record<string, string>>
  appointmentStatusCounts: Record<string, number>
  quoteStatusCounts: Record<string, number>
}

type ActionItem = {
  id: string
  title: string
  detail: string
  href: string
  cta: string
  status?: string
  statusLabel?: string
}

function attentionLine(data: DashboardData): string {
  const parts: string[] = []
  if (data.pendingAppointments > 0) {
    parts.push(
      `${data.pendingAppointments} afspraak${data.pendingAppointments === 1 ? '' : 'en'} wacht op bevestiging`,
    )
  }
  if (data.newQuotes > 0) {
    parts.push(`${data.newQuotes} nieuwe offerte${data.newQuotes === 1 ? '' : 's'}`)
  }
  if (data.unreadContacts > 0) {
    parts.push(
      `${data.unreadContacts} nieuwe contactaanvraag${data.unreadContacts === 1 ? '' : 'en'}`,
    )
  }
  if (data.appointmentsToday > 0) {
    parts.push(
      `${data.appointmentsToday} afspraak${data.appointmentsToday === 1 ? '' : 'en'} vandaag`,
    )
  }
  if (parts.length === 0) return 'Geen openstaande acties op dit moment.'
  return `${parts.join(' · ')}.`
}

function buildActions(data: DashboardData): ActionItem[] {
  const items: ActionItem[] = []

  for (const item of data.upcomingItems) {
    if (item.status !== 'pending' && item.status !== 'requested') continue
    items.push({
      id: `appt-${item.id}`,
      title: item.name ?? 'Afspraak',
      detail: `${formatDayMonth(item.appointment_date)} · ${item.appointment_time} · ${
        serviceLabel[item.service ?? ''] ?? item.service
      }`,
      href: adminUrl(`appointments/${item.id}`),
      cta: 'Bekijk afspraak',
      status: item.status,
      statusLabel: appointmentStatusLabel[item.status ?? ''],
    })
  }

  for (const item of data.pendingQuoteItems.slice(0, 5)) {
    items.push({
      id: `quote-${item.id}`,
      title: item.name ?? 'Offerte',
      detail: `${serviceLabel[item.service ?? ''] ?? item.service} · ${formatDayMonth(item.created_at)}`,
      href: adminUrl(`quotes/${item.id}`),
      cta: 'Behandel offerte',
      status: item.status,
      statusLabel: quoteStatusLabel[item.status ?? ''],
    })
  }

  for (const item of data.recentContacts.filter((row) => row.status === 'new').slice(0, 5)) {
    items.push({
      id: `contact-${item.id}`,
      title: item.name ?? 'Bericht',
      detail: item.subject || item.message?.slice(0, 80) || 'Nieuw contactbericht',
      href: adminUrl(`contact/${item.id}`),
      cta: 'Lees bericht',
      status: item.status,
      statusLabel: contactStatusLabel[item.status ?? ''],
    })
  }

  return items.slice(0, 8)
}

function activityHref(item: Record<string, string>): string | null {
  if (item.kind === 'appointment') return adminUrl(`appointments/${item.id}`)
  if (item.kind === 'quote') return adminUrl(`quotes/${item.id}`)
  if (item.kind === 'contact') return adminUrl(`contact/${item.id}`)
  return null
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

  const actions = useMemo(() => (data ? buildActions(data) : []), [data])

  if (unavailable || error) {
    return (
      <div>
        <PageHeader title="Overzicht" />
        <EmptyState
          title="Geen live cijfers"
          text={
            error ||
            'De serverkoppeling is nog niet beschikbaar. Er worden geen voorbeeldstatistieken getoond.'
          }
        />
      </div>
    )
  }

  if (!data) return <SkeletonCards count={4} />

  const metrics = [
    {
      label: 'Vandaag',
      value: data.appointmentsToday,
      text: 'Afspraken op de planning',
      to: adminUrl('appointments'),
      alert: data.appointmentsToday > 0,
    },
    {
      label: 'Te bevestigen',
      value: data.pendingAppointments,
      text: 'Wacht op bevestiging',
      to: adminUrl('appointments'),
      alert: data.pendingAppointments > 0,
    },
    {
      label: 'Nieuwe offertes',
      value: data.newQuotes,
      text: 'Nog te behandelen',
      to: adminUrl('quotes'),
      alert: data.newQuotes > 0,
    },
    {
      label: 'Ongelezen',
      value: data.unreadContacts,
      text: 'Contactberichten',
      to: adminUrl('contact'),
      alert: data.unreadContacts > 0,
    },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Overzicht"
        title={greeting()}
        description={attentionLine(data)}
        actions={
          <>
            <ButtonLink to={adminUrl('appointments/new')} className="min-h-11">
              <CalendarPlus size={16} aria-hidden="true" />
              Nieuwe afspraak
            </ButtonLink>
            <ButtonLink
              to={`${adminUrl('emails')}#compose`}
              variant="secondary"
              className="min-h-11"
            >
              <MailPlus size={16} aria-hidden="true" />
              Nieuwe e-mail
            </ButtonLink>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
        {metrics.map((metric) => (
          <Link
            key={metric.label}
            to={metric.to}
            className={`admin-kpi ${metric.alert ? 'is-alert' : ''}`}
          >
            <p className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
              {metric.label}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{metric.value}</p>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">{metric.text}</p>
          </Link>
        ))}
      </div>

      {actions.length > 0 ? (
        <section className="mt-5 sm:mt-6">
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-[-0.01em]">Actie nodig</h2>
            <span className="text-xs text-[var(--admin-muted)]">{actions.length} items</span>
          </div>
          <ul className="grid gap-2">
            {actions.map((item) => (
              <li key={item.id} className="admin-card overflow-hidden">
                <div className="flex flex-col gap-3 p-3.5 min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between sm:p-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold tracking-[-0.01em]">{item.title}</p>
                      {item.status ? (
                        <StatusBadge value={item.status} label={item.statusLabel} />
                      ) : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--admin-muted)]">
                      {item.detail}
                    </p>
                  </div>
                  <Link
                    to={item.href}
                    className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 bg-[var(--admin-sidebar)] px-3.5 text-sm font-semibold text-white"
                  >
                    {item.cta}
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="mt-5 sm:mt-6">
          <EmptyState
            compact
            title="Geen acties open"
            text="Nieuwe afspraken, offertes en berichten verschijnen hier zodra er iets te doen is."
          />
        </section>
      )}

      <div className="mt-6 grid gap-5 lg:mt-7 lg:grid-cols-2 lg:gap-6">
        <section>
          <SectionTitle href={adminUrl('appointments')} action="Alle afspraken">
            Afspraken vandaag
          </SectionTitle>
          {data.todayItems.length === 0 ? (
            <EmptyState
              compact
              title="Geen afspraken vandaag"
              text="Bekijk de komende planning of maak een nieuwe afspraak."
              action={
                <Link
                  to={adminUrl('appointments')}
                  className="text-sm font-semibold underline-offset-2 hover:underline"
                >
                  Bekijk komende afspraken
                </Link>
              }
            />
          ) : (
            <ul className="admin-panel divide-y divide-[var(--admin-line)] overflow-hidden">
              {data.todayItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={adminUrl(`appointments/${item.id}`)}
                    className="flex items-center justify-between gap-3 px-3.5 py-3 transition-colors hover:bg-[var(--admin-hover)] sm:px-4"
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold">{item.appointment_time}</span>
                      <span className="mt-0.5 block truncate text-sm text-[var(--admin-muted)]">
                        {item.name} · {serviceLabel[item.service ?? ''] ?? item.service}
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

        <section>
          <SectionTitle href={adminUrl('quotes')} action="Alle offertes">
            Openstaande offertes
          </SectionTitle>
          {data.pendingQuoteItems.length === 0 ? (
            <EmptyState
              compact
              title="Geen nieuwe offertes"
              text="Aanvragen van de website komen hier binnen."
            />
          ) : (
            <ul className="admin-panel divide-y divide-[var(--admin-line)] overflow-hidden">
              {data.pendingQuoteItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={adminUrl(`quotes/${item.id}`)}
                    className="flex items-center justify-between gap-3 px-3.5 py-3 transition-colors hover:bg-[var(--admin-hover)] sm:px-4"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{item.name}</span>
                      <span className="mt-0.5 block text-sm text-[var(--admin-muted)]">
                        {serviceLabel[item.service ?? ''] ?? item.service} ·{' '}
                        {formatDayMonth(item.created_at)}
                      </span>
                    </span>
                    <StatusBadge value={item.status ?? ''} label={quoteStatusLabel[item.status ?? '']} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-2 lg:gap-6">
        <section>
          <SectionTitle href={adminUrl('contact')} action="Alle berichten">
            Recente contactaanvragen
          </SectionTitle>
          {data.recentContacts.length === 0 ? (
            <EmptyState
              compact
              title="Nog geen berichten"
              text="Contactformulieren van de website komen hier binnen."
            />
          ) : (
            <ul className="admin-panel divide-y divide-[var(--admin-line)] overflow-hidden">
              {data.recentContacts.map((item) => (
                <li key={item.id}>
                  <Link
                    to={adminUrl(`contact/${item.id}`)}
                    className="block px-3.5 py-3 transition-colors hover:bg-[var(--admin-hover)] sm:px-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold">{item.name}</p>
                      <StatusBadge
                        value={item.status ?? ''}
                        label={contactStatusLabel[item.status ?? '']}
                      />
                    </div>
                    {item.message ? (
                      <p className="mt-1 line-clamp-2 text-sm text-[var(--admin-muted)]">
                        {item.message}
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-[var(--admin-muted)]">
                      {formatDate(item.created_at)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <SectionTitle href={adminUrl('emails/logs')} action="E-maillog">
            Recente e-mails
          </SectionTitle>
          {data.recentEmails.length === 0 ? (
            <EmptyState
              compact
              title="Nog geen e-mails"
              text="Verzonden berichten verschijnen hier."
            />
          ) : (
            <ul className="admin-panel divide-y divide-[var(--admin-line)] overflow-hidden">
              {data.recentEmails.map((item) => (
                <li key={item.id}>
                  <Link
                    to={adminUrl(`emails/logs/${item.id}`)}
                    className="block px-3.5 py-3 transition-colors hover:bg-[var(--admin-hover)] sm:px-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 truncate font-semibold">{item.subject}</p>
                      <StatusBadge
                        value={item.status ?? ''}
                        label={emailStatusLabel[item.status ?? ''] ?? item.status}
                      />
                    </div>
                    <p className="mt-1 text-sm text-[var(--admin-muted)]">
                      {item.recipient}
                      {item.template_name ? ` · ${item.template_name}` : ''}
                    </p>
                    <p className="mt-1 text-xs text-[var(--admin-muted)]">
                      {formatDateTime(item.created_at)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-5 lg:mt-6">
        <SectionTitle href={adminUrl('appointments')} action="Planning">
          Aankomende afspraken
        </SectionTitle>
        {data.upcomingItems.length === 0 ? (
          <EmptyState
            compact
            title="Nog geen aankomende afspraken"
            text="Bevestigde en openstaande aanvragen komen hier te staan."
          />
        ) : (
          <ul className="admin-panel divide-y divide-[var(--admin-line)] overflow-hidden">
            {data.upcomingItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={adminUrl(`appointments/${item.id}`)}
                  className="flex items-center justify-between gap-3 px-3.5 py-3 transition-colors hover:bg-[var(--admin-hover)] sm:px-4"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold">{item.name}</span>
                    <span className="mt-0.5 block text-sm text-[var(--admin-muted)]">
                      {formatDayMonth(item.appointment_date)} · {item.appointment_time} ·{' '}
                      {serviceLabel[item.service ?? ''] ?? item.service}
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

      <section className="mt-5 lg:mt-6">
        <h2 className="mb-3 text-sm font-semibold tracking-[-0.01em]">Recente activiteit</h2>
        {data.recent.length === 0 ? (
          <EmptyState
            compact
            title="Nog geen activiteit"
            text="Afspraken, offertes en contactberichten verschijnen hier."
          />
        ) : (
          <ul className="admin-panel divide-y divide-[var(--admin-line)] overflow-hidden">
            {data.recent.map((item, index) => {
              const href = activityHref(item)
              const content = (
                <>
                  <span className="font-medium">
                    {activityLabel[item.kind ?? ''] ?? item.kind}
                  </span>
                  <span className="text-[var(--admin-muted)]"> · {item.name}</span>
                  <span className="ml-auto text-xs text-[var(--admin-muted)]">
                    {formatDate(item.created_at)}
                  </span>
                </>
              )
              return (
                <li key={item.id ?? String(index)}>
                  {href ? (
                    <Link
                      to={href}
                      className="flex items-center gap-2 px-3.5 py-3 text-sm transition-colors hover:bg-[var(--admin-hover)] sm:px-4"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 px-3.5 py-3 text-sm sm:px-4">
                      {content}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {(Object.values(data.appointmentStatusCounts).some((n) => n > 0) ||
        Object.values(data.quoteStatusCounts).some((n) => n > 0)) && (
        <div className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-2 lg:gap-6">
          {Object.values(data.appointmentStatusCounts).some((n) => n > 0) ? (
            <section>
              <h2 className="mb-3 text-sm font-semibold tracking-[-0.01em]">Afspraakstatus</h2>
              <StatusRows
                items={['pending', 'confirmed', 'completed', 'cancelled'].map((status) => ({
                  status,
                  count:
                    (data.appointmentStatusCounts[status] ?? 0) +
                    (status === 'pending'
                      ? (data.appointmentStatusCounts.requested ?? 0)
                      : 0),
                  label: appointmentStatusLabel[status] ?? status,
                }))}
              />
            </section>
          ) : null}
          {Object.values(data.quoteStatusCounts).some((n) => n > 0) ? (
            <section>
              <h2 className="mb-3 text-sm font-semibold tracking-[-0.01em]">Offertepipeline</h2>
              <StatusRows
                items={[
                  'new',
                  'in_progress',
                  'contacted',
                  'quoted',
                  'completed',
                  'cancelled',
                  'archived',
                ].map((status) => ({
                  status,
                  count: data.quoteStatusCounts[status] ?? 0,
                  label: quoteStatusLabel[status] ?? status,
                }))}
              />
            </section>
          ) : null}
        </div>
      )}
    </div>
  )
}

function SectionTitle({
  children,
  href,
  action,
}: {
  children: string
  href: string
  action: string
}) {
  return (
    <div className="mb-2.5 flex items-end justify-between gap-3">
      <h2 className="text-sm font-semibold tracking-[-0.01em]">{children}</h2>
      <Link
        to={href}
        className="text-xs font-semibold text-[var(--admin-muted)] transition-colors hover:text-[var(--admin-ink)]"
      >
        {action}
      </Link>
    </div>
  )
}

function StatusRows({
  items,
}: {
  items: Array<{ status: string; count: number; label: string }>
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0)
  if (total === 0) {
    return <Notice tone="info">Nog geen records in de database.</Notice>
  }

  return (
    <ul className="admin-panel grid gap-2.5 p-3.5 sm:p-4">
      {items.map((item) => (
        <li key={item.status} className="grid grid-cols-[minmax(0,7.5rem)_1fr_2rem] items-center gap-3 text-sm">
          <span className="truncate text-[var(--admin-muted)]">{item.label}</span>
          <span className="h-1.5 bg-[#eceee9]">
            <span
              className="block h-1.5 bg-[var(--admin-accent)]"
              style={{ width: `${Math.max(item.count ? 8 : 0, (item.count / total) * 100)}%` }}
            />
          </span>
          <span className="text-right font-semibold">{item.count}</span>
        </li>
      ))}
    </ul>
  )
}

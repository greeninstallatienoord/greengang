import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../../components/ButtonLink'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import {
  activityLabel,
  appointmentStatusLabel,
  contactStatusLabel,
  emailStatusLabel,
  formatDate,
  formatDateTime,
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
  if (parts.length === 0) return 'Geen openstaande aanvragen op dit moment.'
  return `${parts.join(', ')}.`
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

  if (!data) return <Skeleton rows={6} />

  const metrics = [
    {
      label: 'Vandaag',
      value: data.appointmentsToday,
      text: 'Afspraken op de planning',
      to: 'appointments',
    },
    {
      label: 'In behandeling',
      value: data.pendingAppointments,
      text: 'Nog te bevestigen',
      to: 'appointments',
    },
    {
      label: 'Offertes',
      value: data.newQuotes,
      text: 'Nieuwe aanvragen',
      to: 'quotes',
    },
    {
      label: 'Contact',
      value: data.unreadContacts,
      text: 'Nog niet gelezen',
      to: 'contact',
    },
  ]

  const appointmentPipeline = ['pending', 'confirmed', 'completed', 'cancelled'].map((status) => ({
    status,
    count:
      (data.appointmentStatusCounts[status] ?? 0) +
      (status === 'pending' ? (data.appointmentStatusCounts.requested ?? 0) : 0),
    label: appointmentStatusLabel[status] ?? status,
  }))

  const quotePipeline = ['new', 'in_progress', 'contacted', 'quoted', 'completed', 'cancelled', 'archived']
    .map((status) => ({
      status,
      count: data.quoteStatusCounts[status] ?? 0,
      label: quoteStatusLabel[status] ?? status,
    }))
    .filter((item) => Object.values(data.quoteStatusCounts).some((count) => count > 0) || item.status === 'new')

  const hasQuoteData = Object.values(data.quoteStatusCounts).some((count) => count > 0)
  const hasAppointmentData = Object.values(data.appointmentStatusCounts).some((count) => count > 0)

  return (
    <div>
      <PageHeader
        title={greeting()}
        description={attentionLine(data)}
        actions={
          <>
            <ButtonLink to={adminUrl('appointments/new')}>Nieuwe afspraak</ButtonLink>
            <ButtonLink to={`${adminUrl('emails')}#compose`} variant="secondary">
              Nieuwe e-mail
            </ButtonLink>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-px overflow-hidden border border-[var(--admin-line)] bg-[var(--admin-line)] lg:grid-cols-4">
        {metrics.map((metric) => (
          <Link
            key={metric.label}
            to={adminUrl(metric.to)}
            className="bg-[var(--admin-panel)] px-4 py-4 transition-colors hover:bg-[var(--admin-hover)]"
          >
            <p className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
              {metric.label}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{metric.value}</p>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">{metric.text}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <section>
          <SectionTitle href={adminUrl('appointments')} action="Alle afspraken">
            Afspraken vandaag
          </SectionTitle>
          {data.todayItems.length === 0 ? (
            <EmptyState
              title="Geen afspraken vandaag"
              text="Nieuwe aanvragen verschijnen hier automatisch."
            />
          ) : (
            <ul className="grid gap-px overflow-hidden border border-[var(--admin-line)] bg-[var(--admin-line)]">
              {data.todayItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={adminUrl(`appointments/${item.id}`)}
                    className="flex items-center justify-between gap-3 bg-[var(--admin-panel)] px-4 py-3 transition-colors hover:bg-[var(--admin-hover)]"
                  >
                    <span className="min-w-0">
                      <span className="block font-medium">{item.appointment_time}</span>
                      <span className="block truncate text-sm text-[var(--admin-muted)]">
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
              title="Geen nieuwe offerteaanvragen"
              text="Aanvragen van de website komen hier binnen."
            />
          ) : (
            <ul className="grid gap-px overflow-hidden border border-[var(--admin-line)] bg-[var(--admin-line)]">
              {data.pendingQuoteItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={adminUrl(`quotes/${item.id}`)}
                    className="flex items-center justify-between gap-3 bg-[var(--admin-panel)] px-4 py-3 transition-colors hover:bg-[var(--admin-hover)]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{item.name}</span>
                      <span className="block text-sm text-[var(--admin-muted)]">
                        {serviceLabel[item.service ?? ''] ?? item.service} · {formatDate(item.created_at)}
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

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <section>
          <SectionTitle href={adminUrl('contact')} action="Alle berichten">
            Recente contactaanvragen
          </SectionTitle>
          {data.recentContacts.length === 0 ? (
            <EmptyState title="Nog geen berichten" text="Contactformulieren van de website komen hier binnen." />
          ) : (
            <ul className="grid gap-px overflow-hidden border border-[var(--admin-line)] bg-[var(--admin-line)]">
              {data.recentContacts.map((item) => (
                <li key={item.id}>
                  <Link
                    to={adminUrl(`contact/${item.id}`)}
                    className="block bg-[var(--admin-panel)] px-4 py-3 transition-colors hover:bg-[var(--admin-hover)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{item.name}</p>
                      <StatusBadge
                        value={item.status ?? ''}
                        label={contactStatusLabel[item.status ?? '']}
                      />
                    </div>
                    {item.message ? (
                      <p className="mt-1 line-clamp-2 text-sm text-[var(--admin-muted)]">{item.message}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-[var(--admin-muted)]">{formatDate(item.created_at)}</p>
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
            <EmptyState title="Nog geen e-mails" text="Verzonden berichten verschijnen hier." />
          ) : (
            <ul className="grid gap-px overflow-hidden border border-[var(--admin-line)] bg-[var(--admin-line)]">
              {data.recentEmails.map((item) => (
                <li key={item.id}>
                  <Link
                    to={adminUrl(`emails/logs/${item.id}`)}
                    className="block bg-[var(--admin-panel)] px-4 py-3 transition-colors hover:bg-[var(--admin-hover)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 truncate font-medium">{item.subject}</p>
                      <StatusBadge
                        value={item.status ?? ''}
                        label={emailStatusLabel[item.status ?? ''] ?? item.status}
                      />
                    </div>
                    <p className="mt-1 text-sm text-[var(--admin-muted)]">
                      {item.recipient}
                      {item.template_name ? ` · ${item.template_name}` : ''}
                    </p>
                    <p className="mt-1 text-xs text-[var(--admin-muted)]">{formatDateTime(item.created_at)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {(hasAppointmentData || hasQuoteData) && (
        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          {hasAppointmentData ? (
            <section>
              <h2 className="mb-3 text-sm font-semibold tracking-[-0.01em]">Afspraakstatus</h2>
              <StatusRows items={appointmentPipeline} />
            </section>
          ) : null}
          {hasQuoteData ? (
            <section>
              <h2 className="mb-3 text-sm font-semibold tracking-[-0.01em]">Offertepipeline</h2>
              <StatusRows items={quotePipeline} />
            </section>
          ) : null}
        </div>
      )}

      <section className="mt-8">
        <SectionTitle href={adminUrl('appointments')} action="Planning">
          Aankomende afspraken
        </SectionTitle>
        {data.upcomingItems.length === 0 ? (
          <EmptyState
            title="Nog geen aankomende afspraken"
            text="Bevestigde en openstaande aanvragen komen hier te staan."
          />
        ) : (
          <ul className="grid gap-px overflow-hidden border border-[var(--admin-line)] bg-[var(--admin-line)]">
            {data.upcomingItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={adminUrl(`appointments/${item.id}`)}
                  className="flex items-center justify-between gap-3 bg-[var(--admin-panel)] px-4 py-3 transition-colors hover:bg-[var(--admin-hover)]"
                >
                  <span className="min-w-0">
                    <span className="block font-medium">{item.name}</span>
                    <span className="block text-sm text-[var(--admin-muted)]">
                      {formatDate(item.appointment_date)} · {item.appointment_time} ·{' '}
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

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold tracking-[-0.01em]">Recente activiteit</h2>
        {data.recent.length === 0 ? (
          <EmptyState
            title="Nog geen activiteit"
            text="Afspraken, offertes en contactberichten verschijnen hier."
          />
        ) : (
          <ul className="grid gap-px overflow-hidden border border-[var(--admin-line)] bg-[var(--admin-line)]">
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
                      className="flex items-center gap-2 bg-[var(--admin-panel)] px-4 py-3 text-sm transition-colors hover:bg-[var(--admin-hover)]"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 bg-[var(--admin-panel)] px-4 py-3 text-sm">
                      {content}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
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
    <div className="mb-3 flex items-end justify-between gap-3">
      <h2 className="text-sm font-semibold tracking-[-0.01em]">{children}</h2>
      <Link
        to={href}
        className="text-xs font-medium text-[var(--admin-muted)] transition-colors hover:text-[var(--admin-ink)]"
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
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item.status} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-3 text-sm">
          <span className="text-[var(--admin-muted)]">{item.label}</span>
          <span className="h-1.5 bg-[#eceee9]">
            <span
              className="block h-1.5 bg-[#1a8a34]"
              style={{ width: `${Math.max(item.count ? 8 : 0, (item.count / total) * 100)}%` }}
            />
          </span>
          <span className="text-right font-semibold">{item.count}</span>
        </li>
      ))}
    </ul>
  )
}

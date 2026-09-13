import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Field, TextArea } from '../../components/forms/Field'
import { api } from '../../lib/api'
import { quoteSituations } from '../../data/forms'
import { BackLink } from '../components/BackLink'
import { EmailHistory } from '../components/EmailHistory'
import { InfoList } from '../components/InfoList'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import { StatusSheet, StickyActions } from '../components/StatusSheet'
import { formatDateTime, quoteStatusLabel, serviceLabel } from '../labels'
import { adminUrl } from '../adminPath'

const statusOptions = [
  'new',
  'in_progress',
  'contacted',
  'quoted',
  'completed',
  'cancelled',
  'archived',
].map((value) => ({ value, label: quoteStatusLabel[value] ?? value }))

export function QuoteDetailPage() {
  const { id = '' } = useParams()
  const [item, setItem] = useState<
    (Record<string, string> & { emails?: Array<Record<string, string>> }) | null
  >(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [notesDraft, setNotesDraft] = useState('')
  const [notesDirty, setNotesDirty] = useState(false)

  useEffect(() => {
    void api.admin.quote(id).then((result) => {
      if (result.ok) {
        setItem(result.data)
        setNotesDraft(result.data.internal_notes ?? '')
        setNotesDirty(false)
      } else setError(result.message)
    })
  }, [id])

  function load() {
    void api.admin.quote(id).then((result) => {
      if (result.ok) {
        setItem(result.data)
        setNotesDraft(result.data.internal_notes ?? '')
        setNotesDirty(false)
      } else setError(result.message)
    })
  }

  async function patch(payload: { status?: string; internal_notes?: string }) {
    setBusy(true)
    const result = await api.admin.updateQuote(id, payload)
    setBusy(false)
    if (result.ok) {
      setNotice(payload.internal_notes !== undefined ? 'Notitie opgeslagen.' : 'Status is bijgewerkt.')
      setError('')
      load()
    } else {
      setError(result.message)
    }
  }

  if (error && !item) return <Notice tone="error">{error}</Notice>
  if (!item) return <Skeleton rows={5} />

  const composeHref = `${adminUrl('emails')}?to=${encodeURIComponent(item.email ?? '')}&template=tpl-quote-followup&name=${encodeURIComponent(item.name ?? '')}#compose`
  const appointmentHref = `${adminUrl('appointments/new')}?name=${encodeURIComponent(item.name ?? '')}&email=${encodeURIComponent(item.email ?? '')}&phone=${encodeURIComponent(item.phone ?? '')}&address=${encodeURIComponent(item.address ?? '')}&service=${encodeURIComponent(item.service ?? '')}`
  const customerHref = item.customer_id ? adminUrl(`customers/${item.customer_id}`) : null

  return (
    <div className="pb-28 lg:pb-0">
      <BackLink to={adminUrl('quotes')}>Terug naar offertes</BackLink>
      <PageHeader
        title={item.name ?? 'Offerte'}
        description={serviceLabel[item.service ?? ''] ?? item.service}
      />
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <StatusBadge value={item.status ?? ''} label={quoteStatusLabel[item.status ?? '']} />
        {customerHref ? (
          <Link to={customerHref} className="text-sm font-semibold underline-offset-2 hover:underline">
            Naar klantprofiel
          </Link>
        ) : null}
      </div>
      {notice ? (
        <div className="mb-4">
          <Notice tone="success">{notice}</Notice>
        </div>
      ) : null}
      {error ? (
        <div className="mb-4">
          <Notice tone="error">{error}</Notice>
        </div>
      ) : null}

      <InfoList
        items={[
          { label: 'Klant', value: item.name, href: customerHref ?? undefined },
          { label: 'E-mail', value: item.email, href: item.email ? `mailto:${item.email}` : undefined },
          { label: 'Telefoon', value: item.phone, href: item.phone ? `tel:${item.phone}` : undefined },
          { label: 'Adres', value: item.address },
          { label: 'Dienst', value: serviceLabel[item.service ?? ''] ?? item.service },
          {
            label: 'Situatie',
            value:
              quoteSituations.find((entry) => entry.value === item.situation)?.label ??
              item.situation,
          },
          { label: 'Details / toelichting', value: item.message },
          { label: 'Ontvangen', value: formatDateTime(item.created_at) },
          { label: 'Status', value: quoteStatusLabel[item.status ?? ''] ?? item.status },
        ]}
      />

      <section className="mt-5 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-4">
        <Field id="quote-notes" label="Interne notities">
          <TextArea
            id="quote-notes"
            value={notesDraft}
            onChange={(event) => {
              setNotesDraft(event.target.value)
              setNotesDirty(true)
            }}
          />
        </Field>
        {notesDirty ? (
          <div className="mt-3">
            <Button size="sm" disabled={busy} onClick={() => void patch({ internal_notes: notesDraft })}>
              Notitie opslaan
            </Button>
          </div>
        ) : null}
      </section>

      <EmailHistory items={item.emails} />

      <StickyActions>
        {item.phone ? (
          <a
            href={`tel:${item.phone}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center bg-[var(--admin-sidebar)] px-4 text-sm font-semibold text-white sm:flex-none"
          >
            Bel
          </a>
        ) : null}
        <Link
          to={composeHref}
          className="inline-flex min-h-11 flex-1 items-center justify-center border border-[var(--admin-line)] px-4 text-sm font-semibold sm:flex-none"
        >
          E-mail
        </Link>
        <StatusSheet
          value={item.status ?? 'new'}
          options={statusOptions}
          busy={busy}
          triggerLabel="Status wijzigen"
          onChange={(status) => void patch({ status })}
        />
        <Link
          to={appointmentHref}
          className="inline-flex min-h-11 flex-1 items-center justify-center border border-[var(--admin-line)] px-4 text-sm font-semibold sm:flex-none"
        >
          Afspraak maken
        </Link>
      </StickyActions>
    </div>
  )
}

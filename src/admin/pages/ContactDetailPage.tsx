import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Field, TextArea } from '../../components/forms/Field'
import { api } from '../../lib/api'
import { BackLink } from '../components/BackLink'
import { EmailHistory } from '../components/EmailHistory'
import { InfoList } from '../components/InfoList'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import { StatusSheet, StickyActions } from '../components/StatusSheet'
import { contactStatusLabel, formatDateTime } from '../labels'
import { adminUrl } from '../adminPath'

const statusOptions = ['new', 'in_progress', 'answered', 'completed'].map((value) => ({
  value,
  label: contactStatusLabel[value] ?? value,
}))

export function ContactDetailPage() {
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
    void api.admin.contactItem(id).then((result) => {
        if (result.ok) {
          setItem(result.data)
          setNotesDraft(result.data.internal_notes ?? '')
          setNotesDirty(false)
        } else setError(result.message)
    })
  }, [id])

  function load() {
    void api.admin.contactItem(id).then((result) => {
      if (result.ok) {
        setItem(result.data)
        setNotesDraft(result.data.internal_notes ?? '')
        setNotesDirty(false)
      } else setError(result.message)
    })
  }

  async function patch(payload: { status?: string; internal_notes?: string }) {
    setBusy(true)
    const result = await api.admin.updateContact(id, payload)
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

  const composeHref = `${adminUrl('emails')}?to=${encodeURIComponent(item.email ?? '')}&template=tpl-contact-response&name=${encodeURIComponent(item.name ?? '')}#compose`
  const customerHref = item.customer_id ? adminUrl(`customers/${item.customer_id}`) : null
  const appointmentHref = `${adminUrl('appointments/new')}?name=${encodeURIComponent(item.name ?? '')}&email=${encodeURIComponent(item.email ?? '')}&phone=${encodeURIComponent(item.phone ?? '')}`

  return (
    <div className="pb-28 lg:pb-0">
      <BackLink to={adminUrl('contact')}>Terug naar contactaanvragen</BackLink>
      <PageHeader title={item.name ?? 'Bericht'} description={item.subject || 'Contactbericht'} />
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <StatusBadge value={item.status ?? ''} label={contactStatusLabel[item.status ?? '']} />
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
          { label: 'Afzender', value: item.name },
          { label: 'E-mail', value: item.email, href: item.email ? `mailto:${item.email}` : undefined },
          { label: 'Telefoon', value: item.phone, href: item.phone ? `tel:${item.phone}` : undefined },
          { label: 'Onderwerp', value: item.subject },
          { label: 'Ontvangen', value: formatDateTime(item.created_at) },
        ]}
      />

      {item.message ? (
        <section className="mt-5 border border-[var(--admin-line)] bg-[var(--admin-panel)] px-4 py-4">
          <h2 className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
            Bericht
          </h2>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{item.message}</p>
        </section>
      ) : null}

      <section className="mt-5 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-4">
        <Field id="contact-notes" label="Interne notities">
          <TextArea
            id="contact-notes"
            value={notesDraft}
            onChange={(event) => {
              setNotesDraft(event.target.value)
              setNotesDirty(true)
            }}
          />
        </Field>
        {notesDirty ? (
          <div className="mt-3">
            <Button
              size="sm"
              disabled={busy}
              onClick={() => void patch({ internal_notes: notesDraft })}
            >
              Notitie opslaan
            </Button>
          </div>
        ) : null}
      </section>

      <EmailHistory items={item.emails} />

      <StickyActions>
        <Link
          to={composeHref}
          className="inline-flex min-h-11 flex-1 items-center justify-center bg-[var(--admin-sidebar)] px-4 text-sm font-semibold text-white sm:flex-none"
        >
          Beantwoorden per e-mail
        </Link>
        {item.phone ? (
          <a
            href={`tel:${item.phone}`}
            className="inline-flex min-h-11 items-center justify-center border border-[var(--admin-line)] px-4 text-sm font-semibold"
          >
            Bellen
          </a>
        ) : null}
        {customerHref ? (
          <Link
            to={customerHref}
            className="inline-flex min-h-11 items-center justify-center border border-[var(--admin-line)] px-4 text-sm font-semibold"
          >
            Koppel / bekijk klant
          </Link>
        ) : null}
        {item.status !== 'in_progress' && item.status !== 'answered' && item.status !== 'completed' ? (
          <Button
            variant="secondary"
            className="min-h-11"
            disabled={busy}
            onClick={() => void patch({ status: 'in_progress' })}
          >
            Markeer in behandeling
          </Button>
        ) : null}
        <StatusSheet
          value={item.status === 'read' ? 'in_progress' : item.status ?? 'new'}
          options={statusOptions}
          busy={busy}
          triggerLabel="Status"
          onChange={(status) => void patch({ status })}
        />
        {item.status !== 'completed' ? (
          <Button
            variant="secondary"
            className="min-h-11"
            disabled={busy}
            onClick={() => void patch({ status: 'completed' })}
          >
            Afronden
          </Button>
        ) : null}
        <Link
          to={appointmentHref}
          className="inline-flex min-h-11 items-center justify-center border border-[var(--admin-line)] px-4 text-sm font-semibold"
        >
          Afspraak maken
        </Link>
      </StickyActions>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Field, TextArea, TextInput } from '../../components/forms/Field'
import { api } from '../../lib/api'
import { BackLink } from '../components/BackLink'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmailHistory } from '../components/EmailHistory'
import { InfoList } from '../components/InfoList'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import { StickyActions } from '../components/StatusSheet'
import { appointmentStatusLabel, formatDate, formatDateTime, serviceLabel } from '../labels'
import { adminUrl } from '../adminPath'

type PendingAction = 'confirmed' | 'cancelled' | 'completed' | null

export function AppointmentDetailPage() {
  const { id = '' } = useParams()
  const [item, setItem] = useState<
    (Record<string, string> & { emails?: Array<Record<string, string>> }) | null
  >(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState<PendingAction>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [slots, setSlots] = useState<string[]>([])
  const [notesDraft, setNotesDraft] = useState('')
  const [notesDirty, setNotesDirty] = useState(false)

  useEffect(() => {
    void api.admin.appointment(id).then((result) => {
      if (result.ok) {
        setItem(result.data)
        setDate(result.data.appointment_date ?? '')
        setTime(result.data.appointment_time ?? '')
        setNotesDraft(result.data.internal_notes ?? '')
        setNotesDirty(false)
      } else setError(result.message)
    })
  }, [id])

  useEffect(() => {
    if (!date || !rescheduleOpen) return
    let active = true
    void api.appointmentSlots(date).then((result) => {
      if (!active) return
      setSlots(result.ok ? result.data.slots : [])
    })
    return () => {
      active = false
    }
  }, [date, rescheduleOpen])

  function load() {
    void api.admin.appointment(id).then((result) => {
      if (result.ok) {
        setItem(result.data)
        setDate(result.data.appointment_date ?? '')
        setTime(result.data.appointment_time ?? '')
        setNotesDraft(result.data.internal_notes ?? '')
        setNotesDirty(false)
      } else setError(result.message)
    })
  }

  async function apply(payload: {
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    appointment_date?: string
    appointment_time?: string
    internal_notes?: string
  }) {
    setBusy(true)
    const result = await api.admin.updateAppointment(id, payload)
    setBusy(false)
    setPending(null)
    if (!result.ok) {
      setError(result.message)
      return
    }
    if (
      payload.status &&
      payload.status !== 'pending' &&
      payload.status !== 'completed' &&
      (result.data.emailStatus === 'failed' || result.data.emailStatus === 'skipped')
    ) {
      setNotice('Status is bijgewerkt. De klant-e-mail is niet verstuurd.')
    } else if (payload.appointment_date || payload.appointment_time) {
      setNotice('Afspraak is verplaatst.')
      setRescheduleOpen(false)
    } else if (payload.internal_notes !== undefined) {
      setNotice('Interne notitie opgeslagen.')
      setNotesDirty(false)
    } else {
      setNotice('Status is bijgewerkt.')
    }
    setError('')
    load()
  }

  if (error && !item) return <Notice tone="error">{error}</Notice>
  if (!item) return <Skeleton rows={5} />

  const waiting = item.status === 'pending' || item.status === 'requested'
  const confirmed = item.status === 'confirmed'
  const completed = item.status === 'completed'
  const cancelled = item.status === 'cancelled'
  const composeHref = `${adminUrl('emails')}?to=${encodeURIComponent(item.email ?? '')}&name=${encodeURIComponent(item.name ?? '')}#compose`
  const customerHref = item.customer_id ? adminUrl(`customers/${item.customer_id}`) : null

  return (
    <div className="pb-28 lg:pb-0">
      <BackLink to={adminUrl('appointments')}>Terug naar afspraken</BackLink>
      <PageHeader
        title={item.name ?? 'Afspraak'}
        description={`${serviceLabel[item.service ?? ''] ?? item.service} · ${formatDate(item.appointment_date)} · ${item.appointment_time}`}
      />
      <div className="mb-5">
        <StatusBadge value={item.status ?? ''} label={appointmentStatusLabel[item.status ?? '']} />
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
          {
            label: 'Klant',
            value: item.name,
            href: customerHref ?? undefined,
          },
          { label: 'E-mail', value: item.email, href: item.email ? `mailto:${item.email}` : undefined },
          { label: 'Telefoon', value: item.phone, href: item.phone ? `tel:${item.phone}` : undefined },
          { label: 'Adres', value: item.address },
          { label: 'Dienst', value: serviceLabel[item.service ?? ''] ?? item.service },
          { label: 'Gevraagde datum', value: formatDate(item.appointment_date) },
          { label: 'Gevraagde tijd', value: item.appointment_time },
          { label: 'Opmerkingen klant', value: item.notes },
          { label: 'Aangemaakt', value: formatDateTime(item.created_at) },
          {
            label: 'Laatst gewijzigd',
            value: item.updated_at ? formatDateTime(item.updated_at) : undefined,
          },
        ]}
      />

      <section className="mt-5 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-4">
        <Field id="internal-notes" label="Interne notities">
          <TextArea
            id="internal-notes"
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
              onClick={() => void apply({ internal_notes: notesDraft })}
            >
              Notitie opslaan
            </Button>
          </div>
        ) : null}
      </section>

      {rescheduleOpen ? (
        <section className="mt-5 grid gap-3 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-4">
          <h2 className="text-sm font-semibold">Tijd aanpassen</h2>
          <Field id="reschedule-date" label="Datum">
            <TextInput
              id="reschedule-date"
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value)
                setTime('')
              }}
            />
          </Field>
          <Field id="reschedule-time" label="Tijd">
            <select
              id="reschedule-time"
              className="min-h-11 w-full border border-[var(--admin-line)] bg-[var(--admin-panel)] px-3 text-sm"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            >
              <option value="">{date ? 'Kies een tijd' : 'Kies eerst een datum'}</option>
              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
              {time && !slots.includes(time) ? <option value={time}>{time}</option> : null}
            </select>
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={busy || !date || !time}
              onClick={() =>
                void apply({ appointment_date: date, appointment_time: time })
              }
            >
              Opslaan
            </Button>
            <Button variant="secondary" disabled={busy} onClick={() => setRescheduleOpen(false)}>
              Annuleren
            </Button>
          </div>
        </section>
      ) : null}

      <EmailHistory items={item.emails} />

      <StickyActions>
        {waiting ? (
          <>
            <Button className="min-h-11 flex-1 sm:flex-none" onClick={() => setPending('confirmed')}>
              Bevestigen
            </Button>
            <Button
              variant="secondary"
              className="min-h-11 flex-1 sm:flex-none"
              onClick={() => setRescheduleOpen(true)}
            >
              Tijd aanpassen
            </Button>
            <Button
              variant="secondary"
              className="min-h-11 flex-1 sm:flex-none"
              onClick={() => setPending('cancelled')}
            >
              Annuleren
            </Button>
          </>
        ) : null}

        {confirmed ? (
          <>
            <Button
              variant="secondary"
              className="min-h-11 flex-1 sm:flex-none"
              onClick={() => setRescheduleOpen(true)}
            >
              Verplaatsen
            </Button>
            <Button
              className="min-h-11 flex-1 sm:flex-none"
              onClick={() => setPending('completed')}
            >
              Markeren als afgerond
            </Button>
            <Button
              variant="secondary"
              className="min-h-11 flex-1 sm:flex-none"
              onClick={() => setPending('cancelled')}
            >
              Annuleren
            </Button>
          </>
        ) : null}

        {completed || cancelled ? (
          <>
            {customerHref ? (
              <Link
                to={customerHref}
                className="inline-flex min-h-11 flex-1 items-center justify-center border border-[var(--admin-line)] px-4 text-sm font-semibold sm:flex-none"
              >
                Bekijk geschiedenis
              </Link>
            ) : null}
            {item.email ? (
              <Link
                to={composeHref}
                className="inline-flex min-h-11 flex-1 items-center justify-center border border-[var(--admin-line)] px-4 text-sm font-semibold sm:flex-none"
              >
                Contacteer klant
              </Link>
            ) : null}
          </>
        ) : null}

        {item.phone ? (
          <a
            href={`tel:${item.phone}`}
            className="inline-flex min-h-11 items-center justify-center border border-[var(--admin-line)] px-4 text-sm font-semibold"
          >
            Bel
          </a>
        ) : null}
        {item.email && !completed && !cancelled ? (
          <Link
            to={composeHref}
            className="inline-flex min-h-11 items-center justify-center border border-[var(--admin-line)] px-4 text-sm font-semibold"
          >
            E-mail
          </Link>
        ) : null}
      </StickyActions>

      {pending ? (
        <ConfirmDialog
          title={
            pending === 'cancelled'
              ? 'Afspraak annuleren?'
              : pending === 'completed'
                ? 'Afspraak afronden?'
                : 'Afspraak bevestigen?'
          }
          message={
            pending === 'cancelled'
              ? 'De afspraak wordt geannuleerd. Er wordt een e-mail naar de klant gestuurd als e-mail is ingesteld.'
              : pending === 'completed'
                ? 'Markeer deze afspraak als afgerond. De rij blijft bewaard.'
                : 'De klant ontvangt een bevestigingsmail via de bestaande template als e-mail is ingesteld.'
          }
          confirmLabel={pending === 'cancelled' ? 'Annuleren' : 'Doorgaan'}
          danger={pending === 'cancelled'}
          busy={busy}
          onCancel={() => setPending(null)}
          onConfirm={() => void apply({ status: pending })}
        />
      ) : null}
    </div>
  )
}

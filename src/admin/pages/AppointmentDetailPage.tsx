import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { api } from '../../lib/api'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { appointmentStatusLabel, formatDate, serviceLabel } from '../labels'
import { adminUrl } from '../adminPath'

export function AppointmentDetailPage() {
  const { id = '' } = useParams()
  const [item, setItem] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState<'confirmed' | 'cancelled' | 'completed' | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    void api.admin.appointment(id).then((result) => {
      if (result.ok) setItem(result.data)
      else setError(result.message)
    })
  }, [id])

  function load() {
    void api.admin.appointment(id).then((result) => {
      if (result.ok) setItem(result.data)
      else setError(result.message)
    })
  }

  async function apply(status: 'confirmed' | 'cancelled' | 'completed') {
    setBusy(true)
    const result = await api.admin.updateAppointment(id, status)
    setBusy(false)
    setPending(null)
    if (!result.ok) {
      setError(result.message)
      return
    }
    if (result.data.emailStatus === 'failed' || result.data.emailStatus === 'skipped') {
      setNotice('Status is bijgewerkt. De klant-e-mail is niet verstuurd.')
    } else {
      setNotice('Status is bijgewerkt.')
    }
    load()
  }

  if (error && !item) return <p className="text-danger">{error}</p>
  if (!item) return <p className="text-sm text-ink-muted">Laden…</p>

  return (
    <div>
      <p className="mb-3 text-sm">
        <Link to={adminUrl('appointments')} className="underline">
          Terug naar afspraken
        </Link>
      </p>
      <PageHeader
        title={item.name ?? 'Afspraak'}
        description={`${serviceLabel[item.service ?? ''] ?? item.service} · ${formatDate(item.appointment_date)} · ${item.appointment_time}`}
      />
      <StatusBadge value={item.status ?? ''} label={appointmentStatusLabel[item.status ?? '']} />
      {notice ? <p className="mt-3 text-sm text-ink-muted">{notice}</p> : null}
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      <dl className="mt-5 grid gap-3 text-sm">
        <Row label="E-mail" value={item.email} />
        <Row label="Telefoon" value={item.phone} />
        <Row label="Adres" value={item.address} />
        <Row label="Toelichting" value={item.notes} />
        <Row label="Aangemaakt" value={formatDate(item.created_at)} />
      </dl>

      <div className="mt-6 grid gap-2 sm:flex">
        {item.status === 'pending' || item.status === 'requested' ? (
          <Button onClick={() => setPending('confirmed')}>Bevestigen</Button>
        ) : null}
        {item.status !== 'cancelled' && item.status !== 'completed' ? (
          <Button variant="secondary" onClick={() => setPending('cancelled')}>
            Annuleren
          </Button>
        ) : null}
        {item.status === 'confirmed' ? (
          <Button variant="secondary" onClick={() => setPending('completed')}>
            Afronden
          </Button>
        ) : null}
        <ButtonLinkSafe id={item.email} />
      </div>

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
                : 'De klant ontvangt een bevestigingsmail als e-mail is ingesteld.'
          }
          confirmLabel={pending === 'cancelled' ? 'Annuleren' : 'Doorgaan'}
          danger={pending === 'cancelled'}
          busy={busy}
          onCancel={() => setPending(null)}
          onConfirm={() => void apply(pending)}
        />
      ) : null}
    </div>
  )
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="rounded-md border border-line bg-paper px-3 py-2">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="mt-0.5 font-medium break-words">{value}</dd>
    </div>
  )
}

function ButtonLinkSafe({ id }: { id?: string }) {
  if (!id) return null
  return (
    <a className="inline-flex min-h-11 items-center justify-center rounded-md px-4 text-sm font-semibold underline" href={`mailto:${id}`}>
      E-mail klant
    </a>
  )
}

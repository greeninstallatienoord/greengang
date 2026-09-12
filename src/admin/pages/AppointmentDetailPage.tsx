import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { api } from '../../lib/api'
import { BackLink } from '../components/BackLink'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { InfoList } from '../components/InfoList'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import { EmailHistory } from '../components/EmailHistory'
import { appointmentStatusLabel, formatDate, formatDateTime, serviceLabel } from '../labels'
import { adminUrl } from '../adminPath'

export function AppointmentDetailPage() {
  const { id = '' } = useParams()
  const [item, setItem] = useState<
    (Record<string, string> & { emails?: Array<Record<string, string>> }) | null
  >(null)
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

  async function apply(status: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
    setBusy(true)
    const result = await api.admin.updateAppointment(id, status)
    setBusy(false)
    setPending(null)
    if (!result.ok) {
      setError(result.message)
      return
    }
    if (
      status !== 'pending' &&
      status !== 'completed' &&
      (result.data.emailStatus === 'failed' || result.data.emailStatus === 'skipped')
    ) {
      setNotice('Status is bijgewerkt. De klant-e-mail is niet verstuurd.')
    } else {
      setNotice('Status is bijgewerkt.')
    }
    load()
  }

  if (error && !item) return <Notice tone="error">{error}</Notice>
  if (!item) return <Skeleton rows={5} />

  return (
    <div>
      <BackLink to={adminUrl('appointments')}>Terug naar afspraken</BackLink>
      <PageHeader
        title={item.name ?? 'Afspraak'}
        description={`${serviceLabel[item.service ?? ''] ?? item.service} · ${formatDate(item.appointment_date)} · ${item.appointment_time}`}
      />
      <div className="mb-5">
        <StatusBadge value={item.status ?? ''} label={appointmentStatusLabel[item.status ?? '']} />
      </div>
      {notice ? <div className="mb-4"><Notice tone="success">{notice}</Notice></div> : null}
      {error ? <div className="mb-4"><Notice tone="error">{error}</Notice></div> : null}

      <InfoList
        items={[
          { label: 'Klant', value: item.name },
          { label: 'E-mail', value: item.email, href: item.email ? `mailto:${item.email}` : undefined },
          { label: 'Telefoon', value: item.phone, href: item.phone ? `tel:${item.phone}` : undefined },
          { label: 'Adres', value: item.address },
          { label: 'Datum', value: formatDate(item.appointment_date) },
          { label: 'Tijd', value: item.appointment_time },
          { label: 'Dienst', value: serviceLabel[item.service ?? ''] ?? item.service },
          { label: 'Toelichting', value: item.notes },
          { label: 'Aangemaakt', value: formatDateTime(item.created_at) },
          { label: 'Laatst gewijzigd', value: item.updated_at ? formatDateTime(item.updated_at) : undefined },
        ]}
      />

      <EmailHistory items={item.emails} />

      <div className="mt-6 grid gap-2 sm:flex">
        {item.status !== 'pending' && item.status !== 'requested' ? (
          <Button variant="secondary" disabled={busy} onClick={() => void apply('pending')}>
            Wacht op bevestiging
          </Button>
        ) : null}
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
        {item.email ? (
          <a
            className="inline-flex min-h-11 items-center justify-center border border-[var(--admin-line)] px-4 text-sm font-semibold"
            href={`mailto:${item.email}`}
          >
            E-mail klant
          </a>
        ) : null}
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

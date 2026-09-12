import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../lib/api'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { appointmentStatusLabel, formatDate, quoteStatusLabel, serviceLabel } from '../labels'
import { adminUrl } from '../adminPath'

export function CustomerDetailPage() {
  const { id = '' } = useParams()
  const [item, setItem] = useState<
    | (Record<string, string> & {
        appointments: Array<Record<string, string>>
        quotes: Array<Record<string, string>>
      })
    | null
  >(null)
  const [error, setError] = useState('')

  useEffect(() => {
    void api.admin.customer(id).then((result) => {
      if (result.ok) setItem(result.data)
      else setError(result.message)
    })
  }, [id])

  if (error) return <p className="text-danger">{error}</p>
  if (!item) return <p className="text-sm text-ink-muted">Laden…</p>

  return (
    <div>
      <p className="mb-3 text-sm">
        <Link to={adminUrl('customers')} className="underline">
          Terug naar klanten
        </Link>
      </p>
      <PageHeader title={item.name ?? 'Klant'} />
      <dl className="grid gap-3 text-sm">
        <Info label="E-mail" value={item.email} />
        <Info label="Telefoon" value={item.phone} />
        <Info label="Adres" value={item.address} />
      </dl>

      <h2 className="mt-8 text-base font-semibold">Afspraken</h2>
      <ul className="mt-3 grid gap-2">
        {item.appointments.length === 0 ? <li className="text-sm text-ink-muted">Geen afspraken.</li> : null}
        {item.appointments.map((row) => (
          <li key={row.id}>
            <Link to={adminUrl(`appointments/${row.id}`)} className="flex justify-between gap-3 rounded-md border border-line bg-paper px-3 py-3 text-sm">
              <span>
                {serviceLabel[row.service ?? ''] ?? row.service} · {formatDate(row.appointment_date)} · {row.appointment_time}
              </span>
              <StatusBadge value={row.status ?? ''} label={appointmentStatusLabel[row.status ?? '']} />
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-base font-semibold">Offertes</h2>
      <ul className="mt-3 grid gap-2">
        {item.quotes.length === 0 ? <li className="text-sm text-ink-muted">Geen offertes.</li> : null}
        {item.quotes.map((row) => (
          <li key={row.id}>
            <Link to={adminUrl(`quotes/${row.id}`)} className="flex justify-between gap-3 rounded-md border border-line bg-paper px-3 py-3 text-sm">
              <span>{serviceLabel[row.service ?? ''] ?? row.service}</span>
              <StatusBadge value={row.status ?? ''} label={quoteStatusLabel[row.status ?? '']} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Info({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="rounded-md border border-line bg-paper px-3 py-2">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-medium break-words">{value}</dd>
    </div>
  )
}

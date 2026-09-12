import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '../../components/ButtonLink'
import { api } from '../../lib/api'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { appointmentStatusLabel, formatDate, serviceLabel } from '../labels'
import { adminUrl } from '../adminPath'

export function AppointmentsPage() {
  const [items, setItems] = useState<Array<Record<string, string>>>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void api.admin.appointments().then((result) => {
      setLoading(false)
      if (result.ok) setItems(result.data.items)
      else setError(result.message)
    })
  }, [])

  return (
    <div>
      <PageHeader
        title="Afspraken"
        actions={<ButtonLink to={adminUrl('appointments/new')}>Nieuwe afspraak</ButtonLink>}
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {loading ? <p className="text-sm text-ink-muted">Laden…</p> : null}
      {!loading && items.length === 0 && !error ? (
        <EmptyState title="Nog geen afspraken" text="Aanvragen van de website of een nieuwe afspraak verschijnen hier." />
      ) : null}

      <ul className="grid gap-3 lg:hidden">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={adminUrl(`appointments/${item.id}`)}
              className="block rounded-md border border-line bg-paper p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{item.name}</p>
                <StatusBadge value={item.status ?? ''} label={appointmentStatusLabel[item.status ?? '']} />
              </div>
              <p className="mt-2 text-sm text-ink-muted">
                {serviceLabel[item.service ?? ''] ?? item.service}
                <br />
                {formatDate(item.appointment_date)} · {item.appointment_time}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {items.length > 0 ? (
        <div className="hidden overflow-x-auto rounded-md border border-line bg-paper lg:block">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-ink-muted">
                <th className="px-3 py-2 font-medium">Klant</th>
                <th className="px-3 py-2 font-medium">Dienst</th>
                <th className="px-3 py-2 font-medium">Datum</th>
                <th className="px-3 py-2 font-medium">Tijd</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="px-3 py-2">
                    <Link className="font-medium underline" to={adminUrl(`appointments/${item.id}`)}>
                      {item.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{serviceLabel[item.service ?? ''] ?? item.service}</td>
                  <td className="px-3 py-2">{formatDate(item.appointment_date)}</td>
                  <td className="px-3 py-2">{item.appointment_time}</td>
                  <td className="px-3 py-2">
                    <StatusBadge value={item.status ?? ''} label={appointmentStatusLabel[item.status ?? '']} />
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

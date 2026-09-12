import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { EmailCenterNav } from '../email/EmailCenterNav'
import { EmptyState } from '../components/EmptyState'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import { emailStatusLabel, formatDateTime } from '../labels'
import { adminUrl } from '../adminPath'

export function EmailLogsPage() {
  const [items, setItems] = useState<Array<Record<string, string>>>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void api.admin.emails().then((result) => {
      setLoading(false)
      if (result.ok) setItems(result.data.items)
      else setError(result.message)
    })
  }, [])

  return (
    <div>
      <PageHeader
        title="Verzonden e-mails"
        description="Alleen echte verzendpogingen. Bezorging bij de ontvanger wordt niet aangenomen."
      />
      <EmailCenterNav />
      {error ? <Notice tone="error">{error}</Notice> : null}
      {loading ? <Skeleton /> : null}
      {!loading && items.length === 0 && !error ? (
        <EmptyState
          title="Nog geen e-mails"
          text="Verstuurde, mislukte of overgeslagen berichten komen hier te staan."
        />
      ) : null}

      <ul className="grid gap-2 lg:hidden">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={adminUrl(`emails/logs/${item.id}`)}
              className="admin-card block p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{item.subject}</p>
                <StatusBadge
                  value={item.status ?? ''}
                  label={emailStatusLabel[item.status ?? ''] ?? item.status}
                />
              </div>
              <p className="mt-1 text-sm text-[var(--admin-muted)]">
                {item.recipient_name ? `${item.recipient_name} · ` : ''}
                {item.recipient}
              </p>
              <p className="mt-1 text-xs text-[var(--admin-muted)]">
                {item.template_name || 'Zonder template'} · {formatDateTime(item.created_at)}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {items.length > 0 ? (
        <div className="hidden border border-[var(--admin-line)] bg-[var(--admin-panel)] lg:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--admin-line)] text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
                <th className="px-4 py-3 font-semibold">Ontvanger</th>
                <th className="px-4 py-3 font-semibold">Onderwerp</th>
                <th className="px-4 py-3 font-semibold">Template</th>
                <th className="px-4 py-3 font-semibold">Afzender</th>
                <th className="px-4 py-3 font-semibold">Datum</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[var(--admin-line)] last:border-0 hover:bg-[var(--admin-hover)]">
                  <td className="px-4 py-3">
                    <Link
                      className="font-medium underline decoration-[var(--admin-line)] underline-offset-2"
                      to={adminUrl(`emails/logs/${item.id}`)}
                    >
                      {item.recipient_name || item.recipient}
                    </Link>
                    {item.recipient_name ? (
                      <span className="mt-0.5 block text-xs text-[var(--admin-muted)]">{item.recipient}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{item.subject}</td>
                  <td className="px-4 py-3 text-[var(--admin-muted)]">{item.template_name || '-'}</td>
                  <td className="px-4 py-3 text-[var(--admin-muted)]">{item.sender || '-'}</td>
                  <td className="px-4 py-3">{formatDateTime(item.created_at)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      value={item.status ?? ''}
                      label={emailStatusLabel[item.status ?? ''] ?? item.status}
                    />
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

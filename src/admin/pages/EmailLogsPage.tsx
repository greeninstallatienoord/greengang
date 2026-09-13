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

function relatedHref(item: Record<string, string>): string | null {
  if (!item.related_type || !item.related_id) return null
  if (item.related_type === 'appointment') return adminUrl(`appointments/${item.related_id}`)
  if (item.related_type === 'quote') return adminUrl(`quotes/${item.related_id}`)
  if (item.related_type === 'contact') return adminUrl(`contact/${item.related_id}`)
  return null
}

function relatedLabel(item: Record<string, string>): string {
  if (item.related_type === 'appointment') return 'Afspraak'
  if (item.related_type === 'quote') return 'Offerte'
  if (item.related_type === 'contact') return 'Contact'
  return ''
}

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
        description="Verzendpogingen via Resend. Status toont of het bericht is aangeboden, niet of de klant het heeft gelezen."
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

      <ul className="grid gap-2.5 lg:hidden">
        {items.map((item) => {
          const related = relatedHref(item)
          return (
            <li key={item.id} className="admin-card overflow-hidden">
              <Link to={adminUrl(`emails/logs/${item.id}`)} className="block p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{item.subject}</p>
                    <p className="mt-1 text-sm text-[var(--admin-muted)]">
                      {item.customer_name || item.recipient_name || item.recipient}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--admin-muted)]">{item.recipient}</p>
                  </div>
                  <StatusBadge
                    value={item.status ?? ''}
                    label={emailStatusLabel[item.status ?? ''] ?? item.status}
                  />
                </div>
                <p className="mt-2 text-xs text-[var(--admin-muted)]">
                  {item.template_name || 'Zonder template'} · {formatDateTime(item.created_at)}
                  {related ? ` · ${relatedLabel(item)}` : ''}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>

      {items.length > 0 ? (
        <div className="admin-table-wrap hidden lg:block">
          <table>
            <thead>
              <tr>
                <th>Ontvanger</th>
                <th>Klant</th>
                <th>Onderwerp</th>
                <th>Template</th>
                <th>Gerelateerd</th>
                <th>Datum</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const related = relatedHref(item)
                return (
                  <tr key={item.id}>
                    <td>
                      <Link
                        className="font-medium underline decoration-[var(--admin-line)] underline-offset-2"
                        to={adminUrl(`emails/logs/${item.id}`)}
                      >
                        {item.recipient_name || item.recipient}
                      </Link>
                      {item.recipient_name ? (
                        <span className="mt-0.5 block text-xs text-[var(--admin-muted)]">
                          {item.recipient}
                        </span>
                      ) : null}
                    </td>
                    <td>
                      {item.customer_id ? (
                        <Link
                          to={adminUrl(`customers/${item.customer_id}`)}
                          className="underline decoration-[var(--admin-line)] underline-offset-2"
                        >
                          {item.customer_name || 'Klant'}
                        </Link>
                      ) : (
                        item.customer_name || '-'
                      )}
                    </td>
                    <td>{item.subject}</td>
                    <td className="text-[var(--admin-muted)]">{item.template_name || '-'}</td>
                    <td>
                      {related ? (
                        <Link
                          to={related}
                          className="underline decoration-[var(--admin-line)] underline-offset-2"
                        >
                          {relatedLabel(item)}
                        </Link>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{formatDateTime(item.created_at)}</td>
                    <td>
                      <StatusBadge
                        value={item.status ?? ''}
                        label={emailStatusLabel[item.status ?? ''] ?? item.status}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

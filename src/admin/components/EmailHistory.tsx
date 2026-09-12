import { Link } from 'react-router-dom'
import { emailStatusLabel, formatDateTime } from '../labels'
import { adminUrl } from '../adminPath'
import { StatusBadge } from './StatusBadge'

type EmailHistoryProps = {
  items?: Array<Record<string, string>>
}

export function EmailHistory({ items }: EmailHistoryProps) {
  return (
    <section className="mt-5 border border-[var(--admin-line)] bg-[var(--admin-panel)] px-4 py-4">
      <h2 className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
        E-mailgeschiedenis
      </h2>
      {!items || items.length === 0 ? (
        <p className="mt-2 text-sm text-[var(--admin-muted)]">
          Nog geen e-mails gekoppeld aan deze aanvraag.
        </p>
      ) : (
        <ul className="mt-3 grid gap-3">
          {items.map((item) => (
            <li key={item.id} className="border-t border-[var(--admin-line)] pt-3 first:border-0 first:pt-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.subject || 'Zonder onderwerp'}</p>
                  <p className="mt-1 text-xs text-[var(--admin-muted)]">
                    {item.recipient} · {formatDateTime(item.created_at)}
                  </p>
                </div>
                <StatusBadge
                  value={item.status ?? ''}
                  label={emailStatusLabel[item.status ?? ''] ?? item.status}
                />
              </div>
              {item.id ? (
                <Link
                  to={adminUrl(`emails/${item.id}`)}
                  className="mt-2 inline-block text-sm underline decoration-[var(--admin-line)] underline-offset-2"
                >
                  Open e-mail
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

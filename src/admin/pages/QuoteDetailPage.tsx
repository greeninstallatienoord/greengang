import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { ButtonLink } from '../../components/ButtonLink'
import { api } from '../../lib/api'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { formatDate, quoteStatusLabel, serviceLabel } from '../labels'
import { adminUrl } from '../adminPath'

const actions = ['new', 'contacted', 'in_progress', 'completed', 'archived'] as const

export function QuoteDetailPage() {
  const { id = '' } = useParams()
  const [item, setItem] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    void api.admin.quote(id).then((result) => {
      if (result.ok) setItem(result.data)
      else setError(result.message)
    })
  }, [id])

  function load() {
    void api.admin.quote(id).then((result) => {
      if (result.ok) setItem(result.data)
      else setError(result.message)
    })
  }

  if (error && !item) return <p className="text-danger">{error}</p>
  if (!item) return <p className="text-sm text-ink-muted">Laden…</p>

  return (
    <div>
      <p className="mb-3 text-sm">
        <Link to={adminUrl('quotes')} className="underline">
          Terug naar offertes
        </Link>
      </p>
      <PageHeader title={item.name ?? 'Offerte'} description={serviceLabel[item.service ?? ''] ?? item.service} />
      <StatusBadge value={item.status ?? ''} label={quoteStatusLabel[item.status ?? '']} />
      <dl className="mt-5 grid gap-3 text-sm">
        <Info label="E-mail" value={item.email} />
        <Info label="Telefoon" value={item.phone} />
        <Info label="Adres" value={item.address} />
        <Info label="Bericht" value={item.message} />
        <Info label="Ontvangen" value={formatDate(item.created_at)} />
      </dl>
      <div className="mt-6 flex flex-wrap gap-2">
        {actions.map((status) => (
          <Button
            key={status}
            size="sm"
            variant={item.status === status ? 'primary' : 'secondary'}
            onClick={() => {
              void api.admin.updateQuote(id, status).then((result) => {
                if (result.ok) load()
                else setError(result.message)
              })
            }}
          >
            {quoteStatusLabel[status]}
          </Button>
        ))}
      </div>
      <div className="mt-4">
        <ButtonLink
          to={`${adminUrl('emails')}?to=${encodeURIComponent(item.email ?? '')}&template=tpl-quote-followup&name=${encodeURIComponent(item.name ?? '')}`}
          variant="secondary"
        >
          E-mail naar klant
        </ButtonLink>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="rounded-md border border-line bg-paper px-3 py-2">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-medium break-words whitespace-pre-wrap">{value}</dd>
    </div>
  )
}

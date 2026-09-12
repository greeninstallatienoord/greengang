import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { ButtonLink } from '../../components/ButtonLink'
import { api } from '../../lib/api'
import { BackLink } from '../components/BackLink'
import { InfoList } from '../components/InfoList'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import { quoteSituations } from '../../data/forms'
import { EmailHistory } from '../components/EmailHistory'
import { formatDateTime, quoteStatusLabel, serviceLabel } from '../labels'
import { adminUrl } from '../adminPath'

const actions = ['new', 'in_progress', 'contacted', 'quoted', 'completed', 'cancelled', 'archived'] as const

export function QuoteDetailPage() {
  const { id = '' } = useParams()
  const [item, setItem] = useState<
    (Record<string, string> & { emails?: Array<Record<string, string>> }) | null
  >(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

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

  async function setStatus(status: string) {
    setBusy(true)
    const result = await api.admin.updateQuote(id, status)
    setBusy(false)
    if (result.ok) {
      setNotice('Status is bijgewerkt.')
      setError('')
      load()
    } else {
      setError(result.message)
    }
  }

  if (error && !item) return <Notice tone="error">{error}</Notice>
  if (!item) return <Skeleton rows={5} />

  return (
    <div>
      <BackLink to={adminUrl('quotes')}>Terug naar offertes</BackLink>
      <PageHeader
        title={item.name ?? 'Offerte'}
        description={serviceLabel[item.service ?? ''] ?? item.service}
      />
      <div className="mb-5">
        <StatusBadge value={item.status ?? ''} label={quoteStatusLabel[item.status ?? '']} />
      </div>
      {notice ? <div className="mb-4"><Notice tone="success">{notice}</Notice></div> : null}
      {error ? <div className="mb-4"><Notice tone="error">{error}</Notice></div> : null}

      <InfoList
        items={[
          { label: 'Klant', value: item.name },
          { label: 'E-mail', value: item.email, href: item.email ? `mailto:${item.email}` : undefined },
          { label: 'Telefoon', value: item.phone, href: item.phone ? `tel:${item.phone}` : undefined },
          { label: 'Adres', value: item.address },
          { label: 'Dienst', value: serviceLabel[item.service ?? ''] ?? item.service },
          {
            label: 'Situatie',
            value:
              quoteSituations.find((entry) => entry.value === item.situation)?.label ??
              item.situation,
          },
          { label: 'Opmerking', value: item.message },
          { label: 'Ontvangen', value: formatDateTime(item.created_at) },
        ]}
      />

      <EmailHistory items={item.emails} />

      <div className="mt-6">
        <p className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
          Status
        </p>
        <div className="flex flex-wrap gap-2">
          {actions.map((status) => (
            <Button
              key={status}
              size="sm"
              variant={item.status === status ? 'primary' : 'secondary'}
              disabled={busy || item.status === status}
              onClick={() => void setStatus(status)}
            >
              {quoteStatusLabel[status]}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <ButtonLink
          to={`${adminUrl('emails')}?to=${encodeURIComponent(item.email ?? '')}&template=tpl-quote-followup&name=${encodeURIComponent(item.name ?? '')}#compose`}
          variant="secondary"
        >
          E-mail naar klant
        </ButtonLink>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../lib/api'
import { BackLink } from '../components/BackLink'
import { EmailPreview } from '../components/EmailPreview'
import { InfoList } from '../components/InfoList'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { StatusBadge } from '../components/StatusBadge'
import { emailStatusLabel, formatDateTime } from '../labels'
import { adminUrl } from '../adminPath'

export function EmailLogDetailPage() {
  const { id = '' } = useParams()
  const [item, setItem] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    void api.admin.email(id).then((result) => {
      if (result.ok) setItem(result.data)
      else setError(result.message)
    })
  }, [id])

  if (error && !item) return <Notice tone="error">{error}</Notice>
  if (!item) return <Skeleton rows={5} />

  return (
    <div>
      <BackLink to={adminUrl('emails/logs')}>Terug naar verzonden e-mails</BackLink>
      <PageHeader title={item.subject || 'E-mail'} />
      <div className="mb-5">
        <StatusBadge
          value={item.status ?? ''}
          label={emailStatusLabel[item.status ?? ''] ?? item.status}
        />
      </div>
      <InfoList
        items={[
          { label: 'Ontvanger', value: item.recipient_name || item.recipient },
          { label: 'E-mailadres', value: item.recipient, href: item.recipient ? `mailto:${item.recipient}` : undefined },
          { label: 'Onderwerp', value: item.subject },
          { label: 'Template', value: item.template_name || 'Zonder template' },
          { label: 'Afzender', value: item.sender },
          { label: 'Verzonden', value: formatDateTime(item.created_at) },
          { label: 'Status', value: emailStatusLabel[item.status ?? ''] ?? item.status },
          { label: 'Bericht-ID', value: item.provider_message_id },
        ]}
      />
      {item.body_html ? (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold">Verzonden inhoud</h2>
          <EmailPreview html={item.body_html} subject={item.subject} to={item.recipient} />
        </div>
      ) : item.body_text ? (
        <section className="mt-6 border border-[var(--admin-line)] bg-[var(--admin-panel)] px-4 py-4">
          <h2 className="text-sm font-semibold">Verzonden inhoud</h2>
          <p className="mt-2 text-sm whitespace-pre-wrap">{item.body_text}</p>
        </section>
      ) : (
        <p className="mt-6 text-sm text-[var(--admin-muted)]">
          Van dit bericht is geen inhoud bewaard. Nieuwe e-mails slaan de verzonden tekst wel op.
        </p>
      )}
    </div>
  )
}

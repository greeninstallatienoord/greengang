import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { ButtonLink } from '../../components/ButtonLink'
import { api } from '../../lib/api'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { contactStatusLabel, formatDate } from '../labels'
import { adminUrl } from '../adminPath'

export function ContactDetailPage() {
  const { id = '' } = useParams()
  const [item, setItem] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    void api.admin.contactItem(id).then((result) => {
      if (result.ok) setItem(result.data)
      else setError(result.message)
    })
  }, [id])

  function load() {
    void api.admin.contactItem(id).then((result) => {
      if (result.ok) setItem(result.data)
      else setError(result.message)
    })
  }

  if (error && !item) return <p className="text-danger">{error}</p>
  if (!item) return <p className="text-sm text-ink-muted">Laden…</p>

  function setStatus(status: string) {
    void api.admin.updateContact(id, status).then((result) => {
      if (result.ok) load()
      else setError(result.message)
    })
  }

  return (
    <div>
      <p className="mb-3 text-sm">
        <Link to={adminUrl('contact')} className="underline">
          Terug naar contact
        </Link>
      </p>
      <PageHeader title={item.name ?? 'Bericht'} />
      <StatusBadge value={item.status ?? ''} label={contactStatusLabel[item.status ?? '']} />
      <dl className="mt-5 grid gap-3 text-sm">
        <Info label="E-mail" value={item.email} />
        <Info label="Telefoon" value={item.phone} />
        <Info label="Bericht" value={item.message} />
        <Info label="Ontvangen" value={formatDate(item.created_at)} />
      </dl>
      <div className="mt-6 grid gap-2 sm:flex">
        <Button variant="secondary" onClick={() => setStatus('read')}>
          Markeer als gelezen
        </Button>
        <Button variant="secondary" onClick={() => setStatus('contacted')}>
          Contact gehad
        </Button>
        <Button variant="secondary" onClick={() => setStatus('archived')}>
          Archiveren
        </Button>
      </div>
      <div className="mt-4">
        <ButtonLink
          to={`${adminUrl('emails')}?to=${encodeURIComponent(item.email ?? '')}&template=tpl-contact-response&name=${encodeURIComponent(item.name ?? '')}`}
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

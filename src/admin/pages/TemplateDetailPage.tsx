import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Field, TextArea, TextInput } from '../../components/forms/Field'
import { api } from '../../lib/api'
import { BackLink } from '../components/BackLink'
import { EmailPreview } from '../components/EmailPreview'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { adminUrl } from '../adminPath'

const SAMPLE_VARS = {
  'customer.name': 'Jan Jansen',
  'customer.firstName': 'Jan',
  'customer.email': 'klant@example.com',
  'appointment.date': '2026-09-20',
  'appointment.time': '09:00',
  'appointment.service': 'cv-ketel',
  'quote.reference': 'OFF-2041',
}

export function TemplateDetailPage() {
  const { id = '' } = useParams()
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [html, setHtml] = useState('')
  const [variables, setVariables] = useState<Array<{ key: string; label: string }>>([])
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void api.admin.template(id).then((result) => {
      setLoading(false)
      if (!result.ok) {
        setError(result.message)
        return
      }
      setName(result.data.name ?? '')
      setPurpose(result.data.purpose ?? '')
      setSubject(result.data.subject ?? '')
      setBody(result.data.body_text ?? '')
      setVariables(result.data.variables ?? [])
    })
  }, [id])

  const vars = useMemo(() => SAMPLE_VARS, [])

  useEffect(() => {
    if (!subject && !body) return
    const handle = window.setTimeout(() => {
      void api.admin.previewEmail({ subject, text: body, vars, templateId: id }).then((result) => {
        if (result.ok) setHtml(result.data.html)
      })
    }, 400)
    return () => window.clearTimeout(handle)
  }, [subject, body, vars, id])

  async function save() {
    setBusy(true)
    const result = await api.admin.updateTemplate(id, { subject, body_text: body })
    setBusy(false)
    if (result.ok) {
      setSaved('Template opgeslagen. Eerder verzonden e-mails blijven ongewijzigd.')
      setError('')
    } else {
      setError(result.message)
    }
  }

  if (loading) return <Skeleton rows={5} />

  return (
    <div>
      <BackLink to={adminUrl('templates')}>Terug naar templates</BackLink>
      <PageHeader title={name || 'Template'} description={purpose} />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="grid gap-4 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-5">
          <Field id="subject" label="Onderwerp">
            <TextInput id="subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
          </Field>
          <Field id="body" label="Inhoud">
            <TextArea id="body" rows={14} value={body} onChange={(event) => setBody(event.target.value)} />
          </Field>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
              Beschikbare variabelen
            </p>
            <ul className="mt-2 flex flex-wrap gap-2 text-xs">
              {(variables.length > 0
                ? variables
                : [
                    { key: 'customer.firstName', label: 'Voornaam' },
                    { key: 'appointment.date', label: 'Datum' },
                    { key: 'appointment.time', label: 'Tijd' },
                    { key: 'appointment.service', label: 'Dienst' },
                    { key: 'company.phone', label: 'Telefoon' },
                  ]
              ).map((item) => (
                <li key={item.key} className="border border-[var(--admin-line)] px-2 py-1">
                  {`{{${item.key}}}`}
                </li>
              ))}
            </ul>
          </div>
          {error ? <Notice tone="error">{error}</Notice> : null}
          {saved ? <Notice tone="success">{saved}</Notice> : null}
          <Button type="button" disabled={busy} onClick={() => void save()}>
            {busy ? 'Bezig…' : 'Opslaan'}
          </Button>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Voorbeeld met voorbeeldgegevens</h2>
          {html ? (
            <EmailPreview html={html} subject={subject} />
          ) : (
            <p className="text-sm text-[var(--admin-muted)]">Voorbeeld wordt geladen…</p>
          )}
        </div>
      </div>
    </div>
  )
}

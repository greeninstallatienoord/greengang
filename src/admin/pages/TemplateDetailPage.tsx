import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Field, TextArea, TextInput } from '../../components/forms/Field'
import { api } from '../../lib/api'
import { EmailPreview } from '../components/EmailPreview'
import { PageHeader } from '../components/PageHeader'
import { adminUrl } from '../adminPath'

export function TemplateDetailPage() {
  const { id = '' } = useParams()
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [html, setHtml] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')

  useEffect(() => {
    void api.admin.template(id).then((result) => {
      if (!result.ok) {
        setError(result.message)
        return
      }
      setName(result.data.name ?? '')
      setSubject(result.data.subject ?? '')
      setBody(result.data.body_text ?? '')
    })
  }, [id])

  async function save() {
    const result = await api.admin.updateTemplate(id, { subject, body_text: body })
    if (result.ok) setSaved('Opgeslagen.')
    else setError(result.message)
  }

  async function preview() {
    const result = await api.admin.previewEmail({
      subject,
      text: body,
      vars: {
        'customer.name': 'Jan Jansen',
        'customer.firstName': 'Jan',
        'customer.email': 'klant@example.com',
        'appointment.date': '2026-09-20',
        'appointment.time': '09:00',
        'appointment.service': 'cv-ketel',
      },
    })
    if (result.ok) setHtml(result.data.html)
    else setError(result.message)
  }

  return (
    <div>
      <p className="mb-3 text-sm">
        <Link to={adminUrl('templates')} className="underline">
          Terug naar templates
        </Link>
      </p>
      <PageHeader title={name || 'Template'} />
      <div className="grid gap-4 max-w-2xl">
        <Field id="subject" label="Onderwerp">
          <TextInput id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </Field>
        <Field id="body" label="Inhoud">
          <TextArea id="body" rows={12} value={body} onChange={(e) => setBody(e.target.value)} />
        </Field>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {saved ? <p className="text-sm text-brand-dark">{saved}</p> : null}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => void preview()}>
            Voorbeeld
          </Button>
          <Button type="button" onClick={() => void save()}>
            Opslaan
          </Button>
        </div>
      </div>
      {html ? (
        <div className="mt-6">
          <EmailPreview html={html} />
        </div>
      ) : null}
    </div>
  )
}

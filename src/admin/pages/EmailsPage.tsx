import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Field, TextArea, TextInput } from '../../components/forms/Field'
import { api } from '../../lib/api'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmailPreview } from '../components/EmailPreview'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { formatDate } from '../labels'

export function EmailsPage() {
  const [params] = useSearchParams()
  const [templates, setTemplates] = useState<Array<Record<string, string>>>([])
  const [logs, setLogs] = useState<Array<Record<string, string>>>([])
  const [to, setTo] = useState(params.get('to') ?? '')
  const [templateId, setTemplateId] = useState(params.get('template') ?? '')
  const [subject, setSubject] = useState('')
  const [text, setText] = useState('')
  const [html, setHtml] = useState('')
  const [name] = useState(params.get('name') ?? '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const preset = params.get('template')
    void api.admin.templates().then((result) => {
      if (!result.ok) return
      setTemplates(result.data.items)
      const selected = result.data.items.find(
        (item) => item.id === preset || item.slug === preset,
      )
      if (selected) {
        setTemplateId(selected.id ?? preset ?? '')
        setSubject(selected.subject ?? '')
        setText(selected.body_text ?? '')
      }
    })
    void api.admin.emails().then((result) => {
      if (result.ok) setLogs(result.data.items)
    })
  }, [params])

  const vars = {
    'customer.name': name,
    'customer.firstName': name.trim().split(/\s+/).find(Boolean) ?? name,
    'customer.email': to,
  }

  async function refreshPreview() {
    const result = await api.admin.previewEmail({ subject, text, vars })
    if (result.ok) {
      setHtml(result.data.html)
      setError('')
    } else {
      setError(result.message)
    }
  }

  async function send() {
    setBusy(true)
    const result = await api.admin.sendEmail({
      to,
      subject,
      text,
      templateId: templateId || undefined,
      vars,
    })
    setBusy(false)
    setConfirm(false)
    if (!result.ok) {
      setSuccess('')
      setError(result.message)
      return
    }
    setError('')
    setSuccess('E-mail is verstuurd.')
    void api.admin.emails().then((log) => {
      if (log.ok) setLogs(log.data.items)
    })
  }

  return (
    <div>
      <PageHeader title="E-mails" description="Versturen gaat via de server, niet via de browser." />
      <div className="grid gap-8 xl:grid-cols-2">
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            setConfirm(true)
          }}
        >
          <Field id="template" label="Template">
            <select
              id="template"
              className="min-h-11 w-full rounded-md border border-line bg-paper px-3"
              value={templateId}
              onChange={(event) => {
                const next = event.target.value
                setTemplateId(next)
                const selected = templates.find((item) => item.id === next)
                if (selected) {
                  setSubject(selected.subject ?? '')
                  setText(selected.body_text ?? '')
                }
              }}
            >
              <option value="">Zonder template</option>
              {templates.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field id="to" label="Ontvanger">
            <TextInput id="to" type="email" required value={to} onChange={(e) => setTo(e.target.value)} />
          </Field>
          <Field id="subject" label="Onderwerp">
            <TextInput id="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} />
          </Field>
          <Field id="body" label="Inhoud" hint="Variabelen zoals {{customer.name}} worden veilig ingevuld. Geen ruwe HTML.">
            <TextArea id="body" rows={10} required value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {success ? <p className="text-sm font-medium text-brand-dark">{success}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => void refreshPreview()}>
              Voorbeeld
            </Button>
            <Button type="submit">Versturen</Button>
          </div>
        </form>
        <div>
          <h2 className="mb-3 text-base font-semibold">Voorbeeld</h2>
          {html ? (
            <EmailPreview html={html} />
          ) : (
            <EmptyState title="Nog geen voorbeeld" text="Kies een template of inhoud en tik op Voorbeeld." />
          )}
        </div>
      </div>

      <h2 className="mt-10 text-base font-semibold">Verzonden log</h2>
      {logs.length === 0 ? (
        <div className="mt-3">
          <EmptyState title="Nog geen e-mails" text="Verzonden en overgeslagen berichten komen hier te staan." />
        </div>
      ) : (
        <ul className="mt-3 grid gap-2">
          {logs.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 rounded-md border border-line bg-paper px-3 py-3 text-sm">
              <span className="min-w-0">
                <span className="block truncate font-medium">{item.subject}</span>
                <span className="text-ink-muted">
                  {item.recipient} · {formatDate(item.created_at)}
                </span>
              </span>
              <StatusBadge value={item.status ?? ''} />
            </li>
          ))}
        </ul>
      )}

      {confirm ? (
        <ConfirmDialog
          title="E-mail versturen?"
          message="Weet u zeker dat u deze e-mail wilt versturen?"
          confirmLabel="Versturen"
          busy={busy}
          onCancel={() => setConfirm(false)}
          onConfirm={() => void send()}
        />
      ) : null}
    </div>
  )
}

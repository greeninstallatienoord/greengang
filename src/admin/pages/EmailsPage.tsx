import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Button } from '../../components/Button'
import { Field, TextArea, TextInput } from '../../components/forms/Field'
import { api } from '../../lib/api'
import { EmailCenterNav } from '../email/EmailCenterNav'
import { AdminDialog } from '../components/AdminDialog'
import { EmailPreview } from '../components/EmailPreview'
import { EmptyState } from '../components/EmptyState'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'

const COMPOSE_IDS = [
  'tpl-appointment-confirmed',
  'tpl-quote-received-customer',
  'tpl-quote-followup',
  'tpl-appointment-reminder',
  'tpl-thank-you',
]

type Template = Record<string, string> & { compose?: number }
type Recipient = Record<string, string>

export function EmailsPage() {
  const [params] = useSearchParams()
  const [templates, setTemplates] = useState<Template[]>([])
  const [templateId, setTemplateId] = useState(params.get('template') ?? '')
  const [subject, setSubject] = useState('')
  const [text, setText] = useState('')
  const [html, setHtml] = useState('')
  const [previewSubject, setPreviewSubject] = useState('')
  const [to, setTo] = useState(params.get('to') ?? '')
  const [recipientName, setRecipientName] = useState(params.get('name') ?? '')
  const [picked, setPicked] = useState(Boolean(params.get('to')))
  const [query, setQuery] = useState('')
  const [people, setPeople] = useState<Recipient[]>([])
  const [searching, setSearching] = useState(false)
  const [service, setService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [quoteReference, setQuoteReference] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  const selectedTemplate = templates.find((item) => item.id === templateId || item.slug === templateId)

  const composeTemplates = useMemo(() => {
    const marked = templates.filter((item) => Number(item.compose) === 1)
    if (marked.length > 0) return marked
    return templates.filter((item) => COMPOSE_IDS.includes(item.id ?? ''))
  }, [templates])

  const vars = useMemo(
    () => ({
      'customer.name': recipientName,
      'customer.firstName': recipientName.trim().split(/\s+/).find(Boolean) ?? recipientName,
      'customer.email': to,
      'appointment.date': date,
      'appointment.time': time,
      'appointment.service': service,
      'quote.reference': quoteReference,
    }),
    [recipientName, to, date, time, service, quoteReference],
  )

  useEffect(() => {
    const preset = params.get('template')
    void api.admin.templates().then((result) => {
      setLoading(false)
      if (!result.ok) {
        setError(result.message)
        return
      }
      setTemplates(result.data.items)
      const selected = result.data.items.find((item) => item.id === preset || item.slug === preset)
      if (selected) applyTemplateDraft(selected)
    })
  }, [params])

  useEffect(() => {
    const q = query.trim()
    const handle = window.setTimeout(() => {
      if (q.length < 2) {
        setPeople([])
        setSearching(false)
        return
      }
      setSearching(true)
      void api.admin.recipients(q).then((result) => {
        setSearching(false)
        if (result.ok) setPeople(result.data.items)
      })
    }, 250)
    return () => window.clearTimeout(handle)
  }, [query])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (!subject && !text) {
        setHtml('')
        setPreviewSubject('')
        return
      }
      void api.admin
        .previewEmail({ subject, text, vars, templateId: selectedTemplate?.id })
        .then((result) => {
          if (result.ok) {
            setHtml(result.data.html)
            setPreviewSubject(result.data.subject)
          }
        })
    }, 400)
    return () => window.clearTimeout(handle)
  }, [subject, text, vars, selectedTemplate?.id])

  function applyTemplateDraft(template: Template) {
    setTemplateId(template.id ?? '')
    setSubject(template.subject ?? '')
    setText(template.body_text ?? '')
    setPickerOpen(false)
  }

  function choosePerson(person: Recipient) {
    setTo(person.email ?? '')
    setRecipientName(person.name ?? '')
    setService(person.service ?? '')
    setDate(person.appointment_date ?? '')
    setTime(person.appointment_time ?? '')
    setQuoteReference(person.quote_reference ?? '')
    setQuery('')
    setPeople([])
    setPicked(true)
  }

  async function send() {
    if (busy) return
    setBusy(true)
    setError('')
    const result = await api.admin.sendEmail({
      to,
      subject,
      text,
      templateId: selectedTemplate?.id,
      recipientName,
      vars,
    })
    setBusy(false)
    setConfirm(false)
    if (!result.ok) {
      setSuccess('')
      setError(result.message)
      return
    }
    setSuccess('E-mail is verstuurd en vastgelegd in het logboek.')
  }

  if (loading) return <Skeleton rows={6} />

  return (
    <div>
      <PageHeader
        title="E-mails"
        description="Kies een ontvanger en een template, pas de tekst aan en verstuur via de server."
      />
      <EmailCenterNav />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
        <div className="grid gap-4">
          <section className="border border-[var(--admin-line)] bg-[var(--admin-panel)] p-4 sm:p-5">
            <h2 className="text-sm font-semibold">Ontvanger</h2>
            {picked && to ? (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border border-[var(--admin-line)] px-3 py-3">
                <div className="min-w-0">
                  <p className="font-semibold">{recipientName || to}</p>
                  <p className="text-sm text-[var(--admin-muted)]">{to}</p>
                </div>
                <button
                  type="button"
                  className="min-h-10 text-sm font-medium underline"
                  onClick={() => {
                    setPicked(false)
                    setTo('')
                    setRecipientName('')
                  }}
                >
                  Wijzigen
                </button>
              </div>
            ) : (
              <div className="mt-3">
                <label htmlFor="recipient-search" className="sr-only">
                  Zoek klant of contact
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    strokeWidth={1.75}
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--admin-muted)]"
                    aria-hidden="true"
                  />
                  <input
                    id="recipient-search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Zoek op naam, e-mail of telefoon"
                    className="min-h-11 w-full border border-[var(--admin-line)] bg-white py-2 pr-3 pl-10 text-sm"
                  />
                </div>
                <p className="mt-2 text-xs text-[var(--admin-muted)]">
                  Zoek in klanten, offertes en contactaanvragen, of vul hieronder zelf een adres in.
                </p>
                {searching ? <p className="mt-2 text-sm text-[var(--admin-muted)]">Zoeken…</p> : null}
                {people.length > 0 ? (
                  <ul className="mt-2 divide-y divide-[var(--admin-line)] border border-[var(--admin-line)]">
                    {people.map((person) => (
                      <li key={`${person.source}-${person.email}`}>
                        <button
                          type="button"
                          className="flex min-h-14 w-full flex-col items-start px-3 py-2 text-left transition-colors hover:bg-[var(--admin-hover)]"
                          onClick={() => choosePerson(person)}
                        >
                          <span className="font-medium">{person.name}</span>
                          <span className="text-sm text-[var(--admin-muted)]">
                            {person.email}
                            {person.sourceLabel ? ` · ${person.sourceLabel}` : ''}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <Field id="manual-email" label="Of e-mailadres">
                  <TextInput
                    id="manual-email"
                    type="email"
                    value={to}
                    onChange={(event) => setTo(event.target.value)}
                    autoComplete="email"
                  />
                </Field>
                <Field id="manual-name" label="Naam (optioneel)">
                  <TextInput
                    id="manual-name"
                    value={recipientName}
                    onChange={(event) => setRecipientName(event.target.value)}
                  />
                </Field>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={!to.includes('@')}
                  onClick={() => setPicked(true)}
                >
                  Gebruik dit adres
                </Button>
              </div>
            )}
          </section>

          <section className="border border-[var(--admin-line)] bg-[var(--admin-panel)] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">Template</h2>
                <p className="mt-1 text-sm text-[var(--admin-muted)]">
                  {selectedTemplate
                    ? selectedTemplate.name
                    : 'Nog geen template gekozen. U kunt ook zelf tekst schrijven.'}
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={() => setPickerOpen(true)}>
                Kies template
              </Button>
            </div>
          </section>

          <form
            className="grid gap-4 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-4 sm:p-5"
            onSubmit={(event) => {
              event.preventDefault()
              setConfirm(true)
            }}
          >
            <h2 className="text-sm font-semibold">Bericht</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="service" label="Dienst (optioneel)">
                <TextInput
                  id="service"
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  placeholder="cv-ketel, airco, warmtepomp"
                />
              </Field>
              <Field id="quote-ref" label="Offertereferentie (optioneel)">
                <TextInput
                  id="quote-ref"
                  value={quoteReference}
                  onChange={(event) => setQuoteReference(event.target.value)}
                />
              </Field>
              <Field id="date" label="Datum (optioneel)">
                <TextInput id="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </Field>
              <Field id="time" label="Tijd (optioneel)">
                <TextInput id="time" type="time" value={time} onChange={(event) => setTime(event.target.value)} />
              </Field>
            </div>
            <Field id="subject" label="Onderwerp">
              <TextInput id="subject" required value={subject} onChange={(event) => setSubject(event.target.value)} />
            </Field>
            <Field
              id="body"
              label="Inhoud"
              hint="Wijzigingen hier gaan alleen naar deze e-mail. Het template zelf blijft ongewijzigd."
            >
              <TextArea id="body" rows={12} required value={text} onChange={(event) => setText(event.target.value)} />
            </Field>
            {error ? <Notice tone="error">{error}</Notice> : null}
            {success ? <Notice tone="success">{success}</Notice> : null}
            <div className="sticky bottom-0 -mx-4 flex gap-2 border-t border-[var(--admin-line)] bg-[var(--admin-panel)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:mx-0 sm:border-0 sm:p-0">
              <Button type="submit" disabled={busy || !to || !subject || !text}>
                Controleren en versturen
              </Button>
            </div>
          </form>
        </div>

        <aside className="xl:sticky xl:top-20">
          <h2 className="mb-3 text-sm font-semibold">Voorbeeld</h2>
          {html ? (
            <EmailPreview html={html} subject={previewSubject || subject} to={to} />
          ) : (
            <EmptyState title="Nog geen voorbeeld" text="Kies een template of typ een bericht. Het voorbeeld volgt automatisch." />
          )}
        </aside>
      </div>

      {pickerOpen ? (
        <AdminDialog
          title="Kies een template"
          description="De inhoud wordt een concept. U kunt die daarna nog aanpassen."
          wide
          onClose={() => setPickerOpen(false)}
        >
          <ul className="grid gap-3">
            {(composeTemplates.length > 0 ? composeTemplates : templates).map((item) => (
              <li key={item.id} className="border border-[var(--admin-line)] p-4">
                <p className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
                  {item.purpose || 'Klantbericht'}
                </p>
                <p className="mt-1 font-semibold">{item.name}</p>
                <p className="mt-1 text-sm text-[var(--admin-muted)]">{item.description || item.purpose}</p>
                <div className="mt-3 overflow-hidden border border-[var(--admin-line)]">
                  <div className="h-1.5 bg-[#102418]" />
                  <p className="line-clamp-3 bg-[#fbf8f2] px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap">
                    {item.body_text}
                  </p>
                </div>
                <Button className="mt-3 min-h-11" type="button" onClick={() => applyTemplateDraft(item)}>
                  Gebruik template
                </Button>
              </li>
            ))}
          </ul>
        </AdminDialog>
      ) : null}

      {confirm ? (
        <AdminDialog
          title="Deze e-mail echt versturen?"
          description="Dit verstuurt een echte e-mail naar de ontvanger."
          wide
          busy={busy}
          onClose={() => setConfirm(false)}
          footer={
            <>
              <Button variant="secondary" disabled={busy} onClick={() => setConfirm(false)}>
                Terug
              </Button>
              <Button disabled={busy} onClick={() => void send()}>
                {busy ? 'Versturen…' : 'Versturen'}
              </Button>
            </>
          }
        >
          <dl className="grid gap-2 text-sm">
            <div>
              <dt className="text-[var(--admin-muted)]">Aan</dt>
              <dd className="font-medium">
                {recipientName ? `${recipientName} · ` : ''}
                {to}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--admin-muted)]">Onderwerp</dt>
              <dd className="font-medium">{previewSubject || subject}</dd>
            </div>
            <div>
              <dt className="text-[var(--admin-muted)]">Template</dt>
              <dd className="font-medium">{selectedTemplate?.name || 'Zonder template'}</dd>
            </div>
          </dl>
          <div className="mt-4">
            {html ? (
              <EmailPreview html={html} compact subject={previewSubject || subject} to={to} />
            ) : null}
          </div>
        </AdminDialog>
      ) : null}
    </div>
  )
}

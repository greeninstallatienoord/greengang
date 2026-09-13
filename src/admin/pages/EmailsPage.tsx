import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
import { adminUrl } from '../adminPath'
import { serviceLabel } from '../labels'

const DRAFT_KEY = 'gin-admin-email-draft'
const COMPOSE_IDS = [
  'tpl-appointment-confirmed',
  'tpl-appointment-rescheduled',
  'tpl-appointment-cancelled',
  'tpl-appointment-reminder',
  'tpl-quote-received-customer',
  'tpl-quote-followup',
  'tpl-contact-response',
  'tpl-thank-you',
]

type Template = Record<string, string> & { compose?: number }
type Recipient = Record<string, string>
type Step = 'compose' | 'review' | 'sent'

type DraftState = {
  templateId: string
  subject: string
  text: string
  heading: string
  to: string
  recipientName: string
  service: string
  date: string
  time: string
  quoteReference: string
  relatedType: string
  relatedId: string
  picked: boolean
}

function loadDraft(): Partial<DraftState> | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Partial<DraftState>
  } catch {
    return null
  }
}

function saveDraft(draft: DraftState) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {
    /* private mode / quota */
  }
}

function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    /* ignore */
  }
}

export function EmailsPage() {
  const [params] = useSearchParams()
  const draft = useMemo(() => loadDraft(), [])
  const [templates, setTemplates] = useState<Template[]>([])
  const [variables, setVariables] = useState<Array<{ key: string; label: string; group?: string }>>(
    [],
  )
  const [step, setStep] = useState<Step>('compose')
  const [templateId, setTemplateId] = useState(params.get('template') ?? draft?.templateId ?? '')
  const [subject, setSubject] = useState(draft?.subject ?? '')
  const [text, setText] = useState(draft?.text ?? '')
  const [heading, setHeading] = useState(draft?.heading ?? '')
  const [html, setHtml] = useState('')
  const [previewSubject, setPreviewSubject] = useState('')
  const [previewFrom, setPreviewFrom] = useState('')
  const [to, setTo] = useState(params.get('to') ?? draft?.to ?? '')
  const [recipientName, setRecipientName] = useState(params.get('name') ?? draft?.recipientName ?? '')
  const [picked, setPicked] = useState(Boolean(params.get('to') || draft?.picked))
  const [query, setQuery] = useState('')
  const [people, setPeople] = useState<Recipient[]>([])
  const [searching, setSearching] = useState(false)
  const [service, setService] = useState(draft?.service ?? '')
  const [date, setDate] = useState(draft?.date ?? '')
  const [time, setTime] = useState(draft?.time ?? '')
  const [quoteReference, setQuoteReference] = useState(draft?.quoteReference ?? '')
  const [relatedType, setRelatedType] = useState(draft?.relatedType ?? '')
  const [relatedId, setRelatedId] = useState(draft?.relatedId ?? '')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [mobilePreview, setMobilePreview] = useState(false)
  const [useSample, setUseSample] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [sentId, setSentId] = useState('')
  const sendingLock = useRef(false)

  const selectedTemplate = templates.find((item) => item.id === templateId || item.slug === templateId)

  const composeTemplates = useMemo(() => {
    const marked = templates.filter((item) => Number(item.compose) === 1)
    if (marked.length > 0) return marked
    return templates.filter((item) => COMPOSE_IDS.includes(item.id ?? ''))
  }, [templates])

  const showAppointmentContext =
    Boolean(date || time || service) ||
    (selectedTemplate?.id ?? '').includes('appointment') ||
    relatedType === 'appointment'

  const showQuoteContext =
    Boolean(quoteReference) ||
    (selectedTemplate?.id ?? '').includes('quote') ||
    relatedType === 'quote'

  const vars = useMemo(
    () => ({
      'customer.name': recipientName,
      'customer.fullName': recipientName,
      'customer.firstName': recipientName.trim().split(/\s+/).find(Boolean) ?? recipientName,
      'customer.email': to,
      'appointment.date': date,
      'appointment.time': time,
      'appointment.service': service,
      'service.name': service,
      'quote.reference': quoteReference,
    }),
    [recipientName, to, date, time, service, quoteReference],
  )

  const contextualVariables = useMemo(() => {
    return variables.filter((item) => {
      if (item.group === 'appointment' || item.key.includes('appointment')) return showAppointmentContext
      if (item.group === 'quote' || item.key.includes('quote')) return showQuoteContext
      if (item.group === 'service' || item.key.includes('service')) {
        return showAppointmentContext || showQuoteContext
      }
      return true
    })
  }, [variables, showAppointmentContext, showQuoteContext])

  useEffect(() => {
    const preset = params.get('template')
    void api.admin.templates().then((result) => {
      setLoading(false)
      if (!result.ok) {
        setError(result.message)
        return
      }
      setTemplates(result.data.items)
      setVariables(result.data.variables ?? [])
      const selected = result.data.items.find((item) => item.id === preset || item.slug === preset)
      if (selected && !draft?.subject) applyTemplateDraft(selected)
    })
  }, [params, draft?.subject])

  useEffect(() => {
    if (step === 'sent') return
    saveDraft({
      templateId,
      subject,
      text,
      heading,
      to,
      recipientName,
      service,
      date,
      time,
      quoteReference,
      relatedType,
      relatedId,
      picked,
    })
  }, [
    templateId,
    subject,
    text,
    heading,
    to,
    recipientName,
    service,
    date,
    time,
    quoteReference,
    relatedType,
    relatedId,
    picked,
    step,
  ])

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
        .previewEmail({
          subject,
          text,
          heading,
          vars,
          templateId: selectedTemplate?.id,
          useSampleVars: useSample,
        })
        .then((result) => {
          if (result.ok) {
            setHtml(result.data.html)
            setPreviewSubject(result.data.subject)
            setPreviewFrom(result.data.from ?? '')
          }
        })
    }, 400)
    return () => window.clearTimeout(handle)
  }, [subject, text, heading, vars, selectedTemplate?.id, useSample])

  function applyTemplateDraft(template: Template) {
    setTemplateId(template.id ?? '')
    setSubject(template.subject ?? '')
    setText(template.body_text ?? '')
    setHeading(template.heading ?? '')
    setPickerOpen(false)
    setStep('compose')
    setSuccess('')
    setError('')
  }

  function choosePerson(person: Recipient) {
    setTo(person.email ?? '')
    setRecipientName(person.name ?? '')
    setService(person.service ?? '')
    setDate(person.appointment_date ?? '')
    setTime(person.appointment_time ?? '')
    setQuoteReference(person.quote_reference ?? '')
    setRelatedType(person.related_type ?? '')
    setRelatedId(person.related_id ?? '')
    setQuery('')
    setPeople([])
    setPicked(true)
  }

  function goReview() {
    setError('')
    if (!to.includes('@') || !subject.trim() || !text.trim()) {
      setError('Vul ontvanger, onderwerp en inhoud in.')
      return
    }
    setStep('review')
  }

  async function send() {
    if (sendingLock.current || busy) return
    sendingLock.current = true
    setBusy(true)
    setError('')
    const result = await api.admin.sendEmail({
      to,
      subject,
      text,
      heading,
      templateId: selectedTemplate?.id,
      recipientName,
      vars,
      relatedType: relatedType || undefined,
      relatedId: relatedId || undefined,
    })
    setBusy(false)
    sendingLock.current = false
    if (!result.ok) {
      setSuccess('')
      setError(result.message)
      setStep('review')
      return
    }
    clearDraft()
    setSentId(result.data.id ?? '')
    setSuccess('E-mail is verstuurd.')
    setStep('sent')
  }

  if (loading) return <Skeleton rows={6} />

  if (step === 'sent') {
    return (
      <div>
        <PageHeader title="E-mail verstuurd" description="Het bericht is aangeboden aan de e-mailprovider." />
        <EmailCenterNav />
        <Notice tone="success">{success || 'E-mail is verstuurd.'}</Notice>
        <div className="mt-4 flex flex-wrap gap-2">
          {sentId ? (
            <Link
              to={adminUrl(`emails/logs/${sentId}`)}
              className="inline-flex min-h-11 items-center bg-[var(--admin-sidebar)] px-4 text-sm font-semibold text-white"
            >
              Open in Verzonden
            </Link>
          ) : (
            <Link
              to={adminUrl('emails/logs')}
              className="inline-flex min-h-11 items-center bg-[var(--admin-sidebar)] px-4 text-sm font-semibold text-white"
            >
              Naar Verzonden
            </Link>
          )}
          <Button
            variant="secondary"
            onClick={() => {
              setStep('compose')
              setSuccess('')
              setSentId('')
            }}
          >
            Nieuwe e-mail
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'review') {
    return (
      <div className="pb-24 lg:pb-0">
        <PageHeader
          title="Controleren"
          description="Controleer ontvanger en inhoud voordat u verstuurt."
        />
        <EmailCenterNav />
        {error ? (
          <div className="mb-4">
            <Notice tone="error">{error}</Notice>
          </div>
        ) : null}
        <dl className="admin-panel grid gap-3 p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
              Ontvanger
            </dt>
            <dd className="mt-1 font-semibold">
              {recipientName ? `${recipientName} · ` : ''}
              {to}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
              Template
            </dt>
            <dd className="mt-1 font-semibold">{selectedTemplate?.name || 'Zonder template'}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
              Onderwerp
            </dt>
            <dd className="mt-1 font-semibold">{previewSubject || subject}</dd>
          </div>
        </dl>
        <div className="mt-4 hidden lg:block">
          {html ? (
            <EmailPreview
              html={html}
              subject={previewSubject || subject}
              to={to}
              from={previewFrom}
              compact
            />
          ) : null}
        </div>
        <div className="mt-4 lg:hidden">
          <p className="mb-2 text-sm text-[var(--admin-muted)]">
            {(previewSubject || subject).slice(0, 120)}
          </p>
          <p className="line-clamp-6 whitespace-pre-wrap text-sm">{text}</p>
          <Button className="mt-3" variant="secondary" onClick={() => setMobilePreview(true)}>
            Volledig voorbeeld
          </Button>
        </div>
        <div className="sticky bottom-[calc(var(--admin-nav-h)+0.5rem)] z-20 mt-6 flex flex-wrap gap-2 border-t border-[var(--admin-line)] bg-[var(--admin-panel)]/95 py-3 backdrop-blur-sm lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <Button variant="secondary" disabled={busy} onClick={() => setStep('compose')}>
            Terug
          </Button>
          <Button loading={busy} onClick={() => void send()}>
            {busy ? 'E-mail versturen…' : 'E-mail versturen'}
          </Button>
        </div>
        {mobilePreview && html ? (
          <EmailPreview
            html={html}
            subject={previewSubject || subject}
            to={to}
            from={previewFrom}
            fullscreen
            onClose={() => setMobilePreview(false)}
          />
        ) : null}
      </div>
    )
  }

  return (
    <div className="pb-24 lg:pb-0">
      <PageHeader
        title="E-mails"
        description="Stel een klantbericht op, bekijk het voorbeeld en verstuur via Resend."
      />
      <EmailCenterNav />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,30rem)]">
        <div className="grid gap-3">
          <section className="admin-panel p-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 className="text-sm font-semibold">Ontvanger</h2>
              {picked && to ? (
                <button
                  type="button"
                  className="text-sm font-semibold underline-offset-2 hover:underline"
                  onClick={() => {
                    setPicked(false)
                    setTo('')
                    setRecipientName('')
                  }}
                >
                  Wijzigen
                </button>
              ) : null}
            </div>

            {picked && to ? (
              <div className="mt-3 border border-[var(--admin-line)] px-3 py-3">
                <p className="font-semibold">{recipientName || to}</p>
                <p className="text-sm text-[var(--admin-muted)]">{to}</p>
                {(service || date || quoteReference) && (
                  <p className="mt-1 text-xs text-[var(--admin-muted)]">
                    {[
                      service ? serviceLabel[service] ?? service : '',
                      date ? `datum ${date}` : '',
                      time || '',
                      quoteReference ? `ref. ${quoteReference}` : '',
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-3 grid gap-3">
                <div className="relative">
                  <Search
                    size={16}
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--admin-muted)]"
                    aria-hidden="true"
                  />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Zoek klant, offerte, afspraak of contact"
                    className="min-h-11 w-full border border-[var(--admin-line)] bg-white py-2 pr-3 pl-10 text-sm"
                  />
                </div>
                {searching ? <p className="text-sm text-[var(--admin-muted)]">Zoeken…</p> : null}
                {people.length > 0 ? (
                  <ul className="divide-y divide-[var(--admin-line)] border border-[var(--admin-line)]">
                    {people.map((person) => (
                      <li key={`${person.source}-${person.email}-${person.related_id}`}>
                        <button
                          type="button"
                          className="flex min-h-12 w-full flex-col items-start px-3 py-2 text-left hover:bg-[var(--admin-hover)]"
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
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field id="manual-email" label="E-mailadres">
                    <TextInput
                      id="manual-email"
                      type="email"
                      value={to}
                      onChange={(event) => setTo(event.target.value)}
                    />
                  </Field>
                  <Field id="manual-name" label="Naam">
                    <TextInput
                      id="manual-name"
                      value={recipientName}
                      onChange={(event) => setRecipientName(event.target.value)}
                    />
                  </Field>
                </div>
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

          <section className="admin-panel grid gap-3 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold">Template</h2>
                <p className="mt-0.5 text-sm text-[var(--admin-muted)]">
                  {selectedTemplate?.name || 'Geen template — vrij bericht'}
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={() => setPickerOpen(true)}>
                Kies
              </Button>
            </div>

            {(showAppointmentContext || showQuoteContext) && (
              <div className="grid gap-3 border-t border-[var(--admin-line)] pt-3 sm:grid-cols-2">
                {showAppointmentContext || showQuoteContext ? (
                  <Field id="service" label="Dienst">
                    <TextInput
                      id="service"
                      value={service}
                      onChange={(event) => setService(event.target.value)}
                      placeholder="cv-ketel, airco…"
                    />
                  </Field>
                ) : null}
                {showQuoteContext ? (
                  <Field id="quote-ref" label="Offertereferentie">
                    <TextInput
                      id="quote-ref"
                      value={quoteReference}
                      onChange={(event) => setQuoteReference(event.target.value)}
                    />
                  </Field>
                ) : null}
                {showAppointmentContext ? (
                  <>
                    <Field id="date" label="Datum">
                      <TextInput
                        id="date"
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                      />
                    </Field>
                    <Field id="time" label="Tijd">
                      <TextInput
                        id="time"
                        type="time"
                        value={time}
                        onChange={(event) => setTime(event.target.value)}
                      />
                    </Field>
                  </>
                ) : null}
              </div>
            )}

            <Field id="subject" label="Onderwerp">
              <TextInput
                id="subject"
                required
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </Field>
            <Field id="heading" label="Kop in e-mail (optioneel)">
              <TextInput
                id="heading"
                value={heading}
                onChange={(event) => setHeading(event.target.value)}
              />
            </Field>
            <Field id="body" label="Inhoud" hint="Alleen tekst. Variabelen zoals {{customer.firstName}} worden veilig ingevuld.">
              <TextArea
                id="body"
                rows={10}
                required
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
            </Field>

            {contextualVariables.length > 0 ? (
              <div>
                <p className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
                  Variabelen
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {contextualVariables.slice(0, 10).map((item) => (
                    <li key={item.key}>
                      <button
                        type="button"
                        className="border border-[var(--admin-line)] px-2 py-1 text-xs font-medium hover:bg-[var(--admin-hover)]"
                        onClick={() => setText((current) => `${current}{{${item.key}}}`)}
                      >
                        {`{{${item.key}}}`}
                      </button>
                    </li>
                  ))}
                </ul>
                <label className="mt-3 flex min-h-10 items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={useSample}
                    onChange={(event) => setUseSample(event.target.checked)}
                  />
                  Voorbeeldgegevens gebruiken (alleen preview)
                </label>
              </div>
            ) : null}

            {error ? <Notice tone="error">{error}</Notice> : null}
          </section>

          <div className="sticky bottom-[calc(var(--admin-nav-h)+0.5rem)] z-20 flex flex-wrap gap-2 border-t border-[var(--admin-line)] bg-[var(--admin-panel)]/95 py-3 backdrop-blur-sm lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <Button
              type="button"
              className="min-h-11 flex-1 lg:hidden"
              variant="secondary"
              disabled={!html}
              onClick={() => setMobilePreview(true)}
            >
              Voorbeeld
            </Button>
            <Button
              type="button"
              className="min-h-11 flex-1 sm:flex-none"
              disabled={!to || !subject || !text}
              onClick={goReview}
            >
              Controleren
            </Button>
          </div>
        </div>

        <aside className="hidden xl:sticky xl:top-20 xl:block">
          <h2 className="mb-3 text-sm font-semibold">Voorbeeld</h2>
          {html ? (
            <EmailPreview
              html={html}
              subject={previewSubject || subject}
              to={to}
              from={previewFrom}
            />
          ) : (
            <EmptyState
              title="Nog geen voorbeeld"
              text="Kies een template of typ een bericht."
            />
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
                <p className="mt-1 text-sm text-[var(--admin-muted)]">
                  {item.description || item.purpose}
                </p>
                <Button className="mt-3 min-h-11" type="button" onClick={() => applyTemplateDraft(item)}>
                  Gebruik template
                </Button>
              </li>
            ))}
          </ul>
        </AdminDialog>
      ) : null}

      {mobilePreview && html ? (
        <EmailPreview
          html={html}
          subject={previewSubject || subject}
          to={to}
          from={previewFrom}
          fullscreen
          onClose={() => setMobilePreview(false)}
        />
      ) : null}
    </div>
  )
}

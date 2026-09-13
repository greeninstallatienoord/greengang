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

const FALLBACK_SAMPLE = {
  'customer.name': 'Jan Jansen',
  'customer.fullName': 'Jan Jansen',
  'customer.firstName': 'Jan',
  'customer.email': 'voorbeeld@greeninstallatienoord.nl',
  'appointment.date': '20-09-2026',
  'appointment.time': '09:00',
  'appointment.service': 'cv-ketel',
  'service.name': 'cv-ketel',
  'quote.reference': 'OFF-2041',
}

export function TemplateDetailPage() {
  const { id = '' } = useParams()
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [subject, setSubject] = useState('')
  const [heading, setHeading] = useState('')
  const [intro, setIntro] = useState('')
  const [body, setBody] = useState('')
  const [closing, setClosing] = useState('')
  const [ctaLabel, setCtaLabel] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [html, setHtml] = useState('')
  const [previewFrom, setPreviewFrom] = useState('')
  const [variables, setVariables] = useState<Array<{ key: string; label: string; group?: string }>>(
    [],
  )
  const [sampleVars, setSampleVars] = useState<Record<string, string>>(FALLBACK_SAMPLE)
  const [useSample, setUseSample] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [mobilePreview, setMobilePreview] = useState(false)

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
      setHeading(result.data.heading ?? '')
      setIntro(result.data.intro ?? '')
      setClosing(result.data.closing ?? '')
      setCtaLabel(result.data.cta_label ?? '')
      setCtaUrl(result.data.cta_url ?? '')
      // When structured parts exist, body_text is the assembled whole — edit via body only.
      if (result.data.intro || result.data.closing) {
        setIntro('')
        setClosing('')
      }
      setBody(result.data.body_text ?? '')
      setVariables(result.data.variables ?? [])
      if (result.data.sampleVars) setSampleVars(result.data.sampleVars)
    })
  }, [id])

  const vars = useMemo(() => (useSample ? sampleVars : {}), [useSample, sampleVars])
  const previewText = useMemo(() => {
    const parts = [intro.trim(), body.trim(), closing.trim()].filter(Boolean)
    return parts.length > 0 ? parts.join('\n\n') : body
  }, [intro, body, closing])

  useEffect(() => {
    if (!subject && !previewText) return
    const handle = window.setTimeout(() => {
      void api.admin
        .previewEmail({
          subject,
          text: previewText,
          heading,
          ctaLabel,
          ctaHref: ctaUrl,
          vars,
          templateId: id,
          useSampleVars: useSample,
        })
        .then((result) => {
          if (result.ok) {
            setHtml(result.data.html)
            setPreviewFrom(result.data.from ?? '')
          }
        })
    }, 400)
    return () => window.clearTimeout(handle)
  }, [subject, previewText, heading, ctaLabel, ctaUrl, vars, id, useSample])

  async function save() {
    setBusy(true)
    const result = await api.admin.updateTemplate(id, {
      subject,
      heading,
      intro,
      body,
      closing,
      cta_label: ctaLabel,
      cta_url: ctaUrl,
      body_text: previewText,
    })
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
    <div className="pb-24 lg:pb-0">
      <BackLink to={adminUrl('templates')}>Terug naar templates</BackLink>
      <PageHeader
        title={name || 'Template'}
        description={purpose || 'Veilige tekstvelden — geen HTML-editor.'}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="grid gap-3 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-4 sm:p-5">
          <Field id="subject" label="Onderwerp">
            <TextInput id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </Field>
          <Field id="heading" label="Kop in e-mail">
            <TextInput id="heading" value={heading} onChange={(e) => setHeading(e.target.value)} />
          </Field>
          <Field id="intro" label="Intro (optioneel)">
            <TextArea id="intro" rows={3} value={intro} onChange={(e) => setIntro(e.target.value)} />
          </Field>
          <Field id="body" label="Inhoud">
            <TextArea id="body" rows={10} value={body} onChange={(e) => setBody(e.target.value)} />
          </Field>
          <Field id="closing" label="Afsluiting / handtekening (optioneel)">
            <TextArea
              id="closing"
              rows={3}
              value={closing}
              onChange={(e) => setClosing(e.target.value)}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id="cta-label" label="CTA-label (optioneel)">
              <TextInput
                id="cta-label"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="Bel ons bij vragen"
              />
            </Field>
            <Field id="cta-url" label="CTA-URL (optioneel)">
              <TextInput
                id="cta-url"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="tel:+31505690997"
              />
            </Field>
          </div>

          <div>
            <p className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
              Beschikbare variabelen
            </p>
            <ul className="mt-2 flex flex-wrap gap-2 text-xs">
              {(variables.length > 0
                ? variables
                : [
                    { key: 'customer.firstName', label: 'Voornaam' },
                    { key: 'customer.fullName', label: 'Naam' },
                    { key: 'appointment.date', label: 'Datum' },
                    { key: 'appointment.time', label: 'Tijd' },
                    { key: 'service.name', label: 'Dienst' },
                    { key: 'quote.reference', label: 'Referentie' },
                    { key: 'company.phone', label: 'Telefoon' },
                  ]
              ).map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    className="border border-[var(--admin-line)] px-2 py-1 hover:bg-[var(--admin-hover)]"
                    title={item.label}
                    onClick={() => setBody((current) => `${current}{{${item.key}}}`)}
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

          {error ? <Notice tone="error">{error}</Notice> : null}
          {saved ? <Notice tone="success">{saved}</Notice> : null}
          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled={busy} onClick={() => void save()}>
              {busy ? 'Bezig…' : 'Opslaan'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="xl:hidden"
              disabled={!html}
              onClick={() => setMobilePreview(true)}
            >
              Voorbeeld
            </Button>
          </div>
        </div>
        <div className="hidden xl:block">
          <h2 className="mb-3 text-sm font-semibold">Voorbeeld</h2>
          {html ? (
            <EmailPreview html={html} subject={subject} from={previewFrom} />
          ) : (
            <p className="text-sm text-[var(--admin-muted)]">Voorbeeld wordt geladen…</p>
          )}
        </div>
      </div>
      {mobilePreview && html ? (
        <EmailPreview
          html={html}
          subject={subject}
          from={previewFrom}
          fullscreen
          onClose={() => setMobilePreview(false)}
        />
      ) : null}
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { contactSubjects } from '../../data/forms'
import { useSessionDraft } from '../../hooks/useSessionDraft'
import { submitContact } from '../../lib/contactService'
import { focusFirstError } from '../../lib/focusError'
import { FIELD_MAX } from '../../lib/formLimits'
import { required, validateEmail, validatePhone } from '../../lib/validation'
import type { ContactRequest, FormStatus } from '../../types'
import { Button } from '../Button'
import { Field, SelectInput, TextArea, TextInput } from './Field'
import { FormSuccess } from './FormSuccess'

function newKey(): string {
  return crypto.randomUUID()
}

const empty: ContactRequest = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  privacyAccepted: false,
  website: '',
  idempotencyKey: '',
}

function freshContact(): ContactRequest {
  return { ...empty, idempotencyKey: newKey() }
}

export function ContactForm() {
  const [form, setForm, clearDraft] = useSessionDraft('gin-contact-draft', freshContact())
  const [status, setStatus] = useState<FormStatus>('idle')
  const [emailWarning, setEmailWarning] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [honeypot, setHoneypot] = useState('')
  const lock = useRef(false)

  useEffect(() => {
    setForm((current) =>
      current.idempotencyKey ? current : { ...current, idempotencyKey: newKey() },
    )
  }, [setForm])

  function update<K extends keyof ContactRequest>(key: K, value: ContactRequest[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function onSubmit() {
    if (lock.current || status === 'submitting') return
    const next = {
      name: required(form.name, 'Naam'),
      email: validateEmail(form.email),
      phone: form.phone.trim() ? validatePhone(form.phone) : undefined,
      message: required(form.message, 'Bericht'),
      privacy: form.privacyAccepted
        ? undefined
        : 'Bevestig dat u de privacyverklaring heeft gelezen.',
    }
    setErrors(next)
    if (Object.values(next).some(Boolean) || honeypot) {
      focusFirstError({
        name: next.name,
        email: next.email,
        phone: next.phone,
        message: next.message,
        privacy: next.privacy,
      })
      return
    }
    lock.current = true
    setStatus('submitting')
    setSubmitError('')
    const result = await submitContact({
      ...form,
      website: honeypot,
      idempotencyKey: form.idempotencyKey || newKey(),
    })
    if (result.ok) {
      clearDraft()
      setEmailWarning(result.emailWarning ?? '')
      setStatus('success')
      return
    }
    lock.current = false
    setSubmitError(result.message)
    setStatus('error')
  }

  if (status === 'success') {
    return (
      <FormSuccess
        title="Bericht ontvangen"
        confirmedByServer
        previewText=""
        confirmedText="Bedankt voor uw bericht bij Green Installatie Noord. We hebben het ontvangen en nemen contact met u op."
        warning={emailWarning || undefined}
      />
    )
  }

  const subjectOptions = contactSubjects.some((item) => item.value === form.subject)
    ? contactSubjects
    : [
        ...contactSubjects,
        ...(form.subject
          ? [{ value: form.subject, label: form.subject } as const]
          : []),
      ]

  return (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void onSubmit()
      }}
    >
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="company">Bedrijf</label>
        <input
          id="company"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label="Naam" error={errors.name}>
          <TextInput
            id="name"
            autoComplete="name"
            required
            value={form.name}
            error={errors.name}
            maxLength={FIELD_MAX.name}
            onChange={(event) => update('name', event.target.value)}
          />
        </Field>
        <Field id="email" label="E-mail" error={errors.email}>
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            error={errors.email}
            maxLength={FIELD_MAX.email}
            onChange={(event) => update('email', event.target.value)}
          />
        </Field>
        <Field id="phone" label="Telefoon (optioneel)" error={errors.phone}>
          <TextInput
            id="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            error={errors.phone}
            maxLength={FIELD_MAX.phone}
            onChange={(event) => update('phone', event.target.value)}
          />
        </Field>
        <Field id="subject" label="Onderwerp (optioneel)">
          <SelectInput
            id="subject"
            value={form.subject}
            onChange={(event) => update('subject', event.target.value)}
          >
            {subjectOptions.map((item) => (
              <option key={item.value || 'none'} value={item.value}>
                {item.label}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <Field
        id="message"
        label="Bericht"
        hint="Beschrijf kort uw vraag. Deel geen BSN of andere gevoelige persoonsgegevens."
        error={errors.message}
      >
        <TextArea
          id="message"
          className="min-h-[8.5rem] resize-y"
          rows={6}
          required
          value={form.message}
          error={errors.message}
          maxLength={FIELD_MAX.message}
          onChange={(event) => update('message', event.target.value)}
        />
      </Field>

      <p className="text-sm text-ink-muted">
        We gebruiken uw gegevens alleen om uw vraag te beantwoorden. Lees onze{' '}
        <Link to="/privacy" className="font-semibold text-ink underline underline-offset-2">
          privacyverklaring
        </Link>
        . Onze{' '}
        <Link
          to="/algemene-voorwaarden"
          className="font-semibold text-ink underline underline-offset-2"
        >
          algemene voorwaarden
        </Link>{' '}
        gelden pas bij een latere overeenkomst; u kunt ze nu al inzien.
      </p>

      <label className="flex min-h-11 items-start gap-3 text-sm">
        <input
          id="privacy"
          type="checkbox"
          className="mt-1 size-5 shrink-0 accent-brand"
          checked={form.privacyAccepted}
          aria-invalid={Boolean(errors.privacy)}
          aria-describedby={errors.privacy ? 'privacy-error' : undefined}
          onChange={(event) => update('privacyAccepted', event.target.checked)}
        />
        <span>
          Ik heb de{' '}
          <Link to="/privacy" className="underline underline-offset-2">
            privacyverklaring
          </Link>{' '}
          gelezen.
        </span>
      </label>
      {errors.privacy ? (
        <p id="privacy-error" className="text-sm text-danger" role="alert">
          {errors.privacy}
        </p>
      ) : null}
      {submitError ? (
        <p className="text-sm text-danger" role="alert">
          {submitError}
        </p>
      ) : null}

      <div>
        <Button
          type="submit"
          className="w-full min-[400px]:w-auto"
          loading={status === 'submitting'}
        >
          {status === 'submitting' ? 'Bericht versturen…' : 'Bericht versturen'}
        </Button>
      </div>
    </form>
  )
}

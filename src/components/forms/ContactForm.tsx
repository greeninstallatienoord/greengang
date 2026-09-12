import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSessionDraft } from '../../hooks/useSessionDraft'
import { submitContact } from '../../lib/contactService'
import { focusFirstError } from '../../lib/focusError'
import { FIELD_MAX } from '../../lib/formLimits'
import { required, validateEmail, validatePhone } from '../../lib/validation'
import type { ContactRequest, FormStatus } from '../../types'
import { Button } from '../Button'
import { Field, TextArea, TextInput } from './Field'
import { FormPrivacyNote } from './FormPrivacyNote'
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
      <FormPrivacyNote purpose="Naam, e-mail en bericht zijn nodig om te antwoorden. Telefoon en onderwerp zijn optioneel." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label="Naam" error={errors.name}>
          <TextInput
            id="name"
            autoComplete="name"
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
            value={form.email}
            error={errors.email}
            maxLength={FIELD_MAX.email}
            onChange={(event) => update('email', event.target.value)}
          />
        </Field>
        <Field id="phone" label="Telefoon" hint="Optioneel" error={errors.phone}>
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
        <Field id="subject" label="Onderwerp" hint="Optioneel">
          <TextInput
            id="subject"
            value={form.subject}
            error={errors.subject}
            maxLength={FIELD_MAX.subject}
            onChange={(event) => update('subject', event.target.value)}
          />
        </Field>
      </div>
      <Field
        id="message"
        label="Bericht"
        hint="Beschrijf uw vraag. Geen BSN of extra persoonsgegevens."
        error={errors.message}
      >
        <TextArea
          id="message"
          className="min-h-40"
          value={form.message}
          error={errors.message}
          maxLength={FIELD_MAX.message}
          onChange={(event) => update('message', event.target.value)}
        />
      </Field>
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
          Ik heb de <Link to="/privacy" className="underline">privacyverklaring</Link> gelezen.
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
      <Button type="submit" className="w-full sm:w-auto" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Verwerken…' : 'Bericht versturen'}
      </Button>
    </form>
  )
}

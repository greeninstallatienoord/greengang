import { useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../../data/site'
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

const empty: ContactRequest = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  privacyAccepted: false,
}

export function ContactForm() {
  const [form, setForm, clearDraft] = useSessionDraft('gin-contact-draft', empty)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [confirmedByServer, setConfirmedByServer] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [honeypot, setHoneypot] = useState('')

  function update<K extends keyof ContactRequest>(key: K, value: ContactRequest[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function onSubmit() {
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
    setStatus('submitting')
    const result = await submitContact(form)
    if (result.ok) {
      clearDraft()
      setConfirmedByServer(result.confirmedByServer)
      setStatus('success')
      return
    }
    setStatus('error')
  }

  if (status === 'success') {
    return (
      <FormSuccess
        title="Bericht voorbereid"
        confirmedByServer={confirmedByServer}
        previewText={`De velden zijn gecontroleerd. ${site.name} heeft dit bericht nog niet ontvangen, omdat de serverkoppeling nog ontbreekt.`}
        confirmedText="We hebben uw bericht ontvangen en nemen contact met u op."
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
      <FormPrivacyNote purpose="We vragen een naam, e-mailadres en bericht om te kunnen antwoorden. Telefoon en onderwerp zijn niet verplicht." />
      <Field
        id="name"
        label="Naam"
        hint="Zodat we weten hoe we u kunnen aanspreken."
        error={errors.name}
      >
        <TextInput
          id="name"
          autoComplete="name"
          value={form.name}
          error={errors.name}
          maxLength={FIELD_MAX.name}
          onChange={(event) => update('name', event.target.value)}
        />
      </Field>
      <Field
        id="email"
        label="E-mail"
        hint="Om te antwoorden op uw bericht."
        error={errors.email}
      >
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
      <Field
        id="phone"
        label="Telefoon (optioneel)"
        hint="Alleen als u liever gebeld wordt."
        error={errors.phone}
      >
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
        <TextInput
          id="subject"
          value={form.subject}
          error={errors.subject}
          maxLength={FIELD_MAX.subject}
          onChange={(event) => update('subject', event.target.value)}
        />
      </Field>
      <Field
        id="message"
        label="Bericht"
        hint="Beschrijf uw vraag. We vragen geen burgerservicenummer of andere extra persoonsgegevens."
        error={errors.message}
      >
        <TextArea
          id="message"
          value={form.message}
          error={errors.message}
          maxLength={FIELD_MAX.message}
          onChange={(event) => update('message', event.target.value)}
        />
      </Field>
      <label className="flex items-start gap-3 text-sm">
        <input
          id="privacy"
          type="checkbox"
          className="mt-1 accent-brand"
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
      {status === 'error' ? (
        <p className="text-sm text-danger">Versturen is niet gelukt. Probeer het opnieuw.</p>
      ) : null}
      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Verwerken…' : 'Bericht versturen'}
      </Button>
    </form>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSessionDraft } from '../../hooks/useSessionDraft'
import { focusFirstError } from '../../lib/focusError'
import { FIELD_MAX } from '../../lib/formLimits'
import {
  contactMethods,
  quoteServiceOptions,
  situationsFor,
} from '../../data/forms'
import { submitLead } from '../../lib/leadService'
import { photoHint } from '../../lib/photos'
import {
  required,
  validateEmail,
  validatePhone,
  validatePostalCode,
} from '../../lib/validation'
import type {
  ContactMethod,
  FormStatus,
  LeadRequest,
  PhotoAttachment,
  QuoteServiceOption,
  QuoteSituation,
} from '../../types'
import { Button } from '../Button'
import { Field, TextArea, TextInput } from './Field'
import { FormSuccess } from './FormSuccess'
import { FormPrivacyNote } from './FormPrivacyNote'
import { PhotoUpload } from './PhotoUpload'
import { ProgressSteps } from './ProgressSteps'

const steps = ['Dienst', 'Situatie', 'Gegevens', 'Controle']

function newKey(): string {
  return crypto.randomUUID()
}

const emptyLead: LeadRequest = {
  service: 'cv-ketel',
  situation: 'weet-ik-niet',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  city: '',
  message: '',
  preferredContact: 'geen-voorkeur',
  photos: [],
  privacyAccepted: false,
  website: '',
  idempotencyKey: '',
}

function freshLead(service: QuoteServiceOption = 'cv-ketel'): LeadRequest {
  return { ...emptyLead, service, photos: [], idempotencyKey: newKey() }
}

function isServiceOption(value: string): value is QuoteServiceOption {
  return quoteServiceOptions.some((option) => option.value === value)
}

function isSituationOption(value: string): value is QuoteSituation {
  return situationsFor('overig').some((option) => option.value === value)
}

function ReviewRow({
  label,
  value,
  onEdit,
}: {
  label: string
  value: string
  onEdit: () => void
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="max-w-[70%] text-right">
        <span className="block font-medium break-words whitespace-pre-wrap">{value || '-'}</span>
        <button type="button" className="mt-1 text-sm underline underline-offset-2" onClick={onEdit}>
          Wijzigen
        </button>
      </dd>
    </div>
  )
}

export function QuoteForm() {
  const [params] = useSearchParams()
  const preset = params.get('dienst')
  const situationPreset = params.get('situatie')
  const systemPreset = params.get('systeem')
  const gasPreset = params.get('gasverbruik')
  const packagePreset = params.get('pakket')
  const frequencyPreset = params.get('frequentie')
  const initialService =
    preset && isServiceOption(preset) && preset !== 'overig' ? preset : null
  const initialSituation =
    situationPreset && isSituationOption(situationPreset) ? situationPreset : null

  const prefillMessage = useMemo(() => {
    const parts: string[] = []
    if (systemPreset === 'hybrid' || systemPreset === 'hybride') {
      parts.push('Voorkeur systeem: hybride')
    } else if (systemPreset === 'all-electric') {
      parts.push('Voorkeur systeem: all-electric')
    }
    if (gasPreset && Number.isFinite(Number(gasPreset))) {
      parts.push(`Huidig gasverbruik: ${Number(gasPreset)} m³/jaar`)
    }
    if (packagePreset) {
      parts.push(`Onderhoudspakket: ${packagePreset}`)
    }
    if (frequencyPreset === 'annual') {
      parts.push('Onderhoudsfrequentie: jaarlijks')
    } else if (frequencyPreset === 'biennial') {
      parts.push('Onderhoudsfrequentie: eens per 2 jaar')
    }
    return parts.join('\n')
  }, [systemPreset, gasPreset, packagePreset, frequencyPreset])

  const [step, setStep] = useState(initialService && initialSituation ? 2 : initialService ? 1 : 0)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [emailWarning, setEmailWarning] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [photoError, setPhotoError] = useState<string | undefined>()
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const lock = useRef(false)
  const [form, setForm, clearDraft] = useSessionDraft<LeadRequest>('gin-quote-draft', {
    ...freshLead(initialService ?? 'cv-ketel'),
    situation: initialSituation ?? 'weet-ik-niet',
    message: prefillMessage,
  })

  useEffect(() => {
    if (!prefillMessage) return
    setForm((current) =>
      current.message.trim() ? current : { ...current, message: prefillMessage },
    )
  }, [prefillMessage, setForm])

  useEffect(() => {
    setForm((current) =>
      current.idempotencyKey ? current : { ...current, idempotencyKey: newKey() },
    )
  }, [setForm])

  const primaryServices = quoteServiceOptions.filter((item) => item.value !== 'overig')
  const situations = situationsFor(form.service)
  const serviceLabel = useMemo(
    () =>
      quoteServiceOptions.find((item) => item.value === form.service)?.label ??
      form.service,
    [form.service],
  )
  const situationLabel =
    situations.find((item) => item.value === form.situation)?.label ?? form.situation
  const address = [form.street, form.houseNumber, form.postalCode, form.city]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ')

  function update<K extends keyof LeadRequest>(key: K, value: LeadRequest[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function chooseService(value: QuoteServiceOption) {
    const nextSituations = situationsFor(value)
    const situation = nextSituations.some((item) => item.value === form.situation)
      ? form.situation
      : (nextSituations[0]?.value ?? 'weet-ik-niet')
    setForm((current) => ({ ...current, service: value, situation }))
    setStep(1)
  }

  function validateStep(current: number): boolean {
    if (current === 2) {
      const next = {
        firstName: required(form.firstName, 'Voornaam'),
        lastName: required(form.lastName, 'Achternaam'),
        phone: validatePhone(form.phone),
        email: validateEmail(form.email),
        postalCode: form.postalCode.trim()
          ? validatePostalCode(form.postalCode)
          : undefined,
      }
      setErrors(next)
      const ok = !Object.values(next).some(Boolean)
      if (!ok) focusFirstError(next)
      return ok
    }
    if (current === 3 && !form.privacyAccepted) {
      setErrors({ privacy: 'Bevestig dat u de privacyverklaring heeft gelezen.' })
      focusFirstError({ privacy: 'Bevestig dat u de privacyverklaring heeft gelezen.' })
      return false
    }
    setErrors({})
    return true
  }

  async function handleSubmit() {
    if (lock.current || status === 'submitting') return
    if (!validateStep(3) || honeypot || photoError) return
    lock.current = true
    setStatus('submitting')
    setSubmitError('')
    const result = await submitLead({
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
        title="Offerteaanvraag ontvangen"
        confirmedByServer
        previewText=""
        confirmedText="Bedankt voor uw aanvraag bij Green Installatie Noord. We hebben uw bericht ontvangen en nemen contact met u op."
        warning={emailWarning || undefined}
        onReset={() => {
          clearDraft()
          lock.current = false
          setStatus('idle')
          setStep(0)
          setEmailWarning('')
          setForm(freshLead())
        }}
      />
    )
  }

  return (
    <form
      className="border border-line bg-paper p-5 sm:p-7"
      onSubmit={(event) => {
        event.preventDefault()
        if (step === 3) void handleSubmit()
      }}
      noValidate
    >
      <ProgressSteps steps={steps} current={step} />

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      {step === 0 ? (
        <fieldset>
          <legend className="mb-4 text-lg font-semibold">
            Wat wilt u laten doen?
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {primaryServices.map((option) => (
              <button
                key={option.value}
                type="button"
                className="min-h-14 rounded-md border border-line p-4 text-left text-base hover:border-brand hover:bg-brand-soft/60"
                onClick={() => chooseService(option.value)}
              >
                <span className="block font-semibold">{option.label}</span>
                <span className="mt-1 block text-sm text-ink-muted">{option.hint}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm">
            <button
              type="button"
              className="inline-flex min-h-11 items-center underline underline-offset-2"
              onClick={() => chooseService('overig')}
            >
              Ik weet het nog niet / andere vraag
            </button>
          </p>
        </fieldset>
      ) : null}

      {step === 1 ? (
        <fieldset>
          <legend className="mb-4 text-lg font-semibold">Wat is de situatie?</legend>
          <p className="mb-4 text-sm text-ink-muted">Gekozen: {serviceLabel}</p>
          <div className="grid gap-3">
            {situations.map((option) => (
              <button
                key={option.value}
                type="button"
                className="min-h-12 rounded-md border border-line p-3.5 text-left text-base font-medium hover:border-brand hover:bg-brand-soft/60"
                onClick={() => {
                  update('situation', option.value as QuoteSituation)
                  setStep(2)
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4">
          <FormPrivacyNote purpose="We vragen naam, telefoon en e-mail om u te kunnen terugbellen of mailen over deze offerteaanvraag. Adres is niet verplicht." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="firstName" label="Voornaam" error={errors.firstName}>
              <TextInput
                id="firstName"
                autoComplete="given-name"
                value={form.firstName}
                error={errors.firstName}
                maxLength={FIELD_MAX.name}
                onChange={(event) => update('firstName', event.target.value)}
              />
            </Field>
            <Field id="lastName" label="Achternaam" error={errors.lastName}>
              <TextInput
                id="lastName"
                autoComplete="family-name"
                value={form.lastName}
                error={errors.lastName}
                maxLength={FIELD_MAX.name}
                onChange={(event) => update('lastName', event.target.value)}
              />
            </Field>
            <Field
              id="phone"
              label="Telefoon"
              hint="Om u te bellen over de aanvraag."
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
            <Field
              id="email"
              label="E-mail"
              hint="Om de ontvangst van de aanvraag te bevestigen."
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
          </div>
          <details className="rounded-md border border-line p-3" open={Boolean(address)}>
            <summary className="cursor-pointer font-semibold">
              Adres toevoegen (optioneel)
            </summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field id="street" label="Straat">
                <TextInput
                  id="street"
                  autoComplete="address-line1"
                  value={form.street}
                  maxLength={FIELD_MAX.street}
                  onChange={(event) => update('street', event.target.value)}
                />
              </Field>
              <Field id="houseNumber" label="Huisnummer">
                <TextInput
                  id="houseNumber"
                  value={form.houseNumber}
                  maxLength={FIELD_MAX.houseNumber}
                  onChange={(event) => update('houseNumber', event.target.value)}
                />
              </Field>
              <Field id="postalCode" label="Postcode" error={errors.postalCode}>
                <TextInput
                  id="postalCode"
                  autoComplete="postal-code"
                  value={form.postalCode}
                  error={errors.postalCode}
                  maxLength={FIELD_MAX.postalCode}
                  onChange={(event) => update('postalCode', event.target.value)}
                />
              </Field>
              <Field id="city" label="Plaats">
                <TextInput
                  id="city"
                  autoComplete="address-level2"
                  value={form.city}
                  maxLength={FIELD_MAX.city}
                  onChange={(event) => update('city', event.target.value)}
                />
              </Field>
            </div>
          </details>
          <Field
            id="message"
            label="Is er nog iets dat we moeten weten?"
            hint="Optioneel. Bijzonderheden van de woning, toegang of wat u al heeft laten kijken."
          >
            <TextArea
              id="message"
              className="min-h-40"
              value={form.message}
              maxLength={FIELD_MAX.message}
              onChange={(event) => update('message', event.target.value)}
            />
          </Field>
          <PhotoUpload
            hint={photoHint(form.service)}
            photos={form.photos}
            error={photoError}
            onChange={(photos: PhotoAttachment[], error) => {
              update('photos', photos)
              setPhotoError(error)
            }}
          />
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">
              Hoe mogen we contact opnemen?
            </legend>
            <div className="grid gap-2">
              {contactMethods.map((method) => (
                <label key={method.value} className="flex min-h-11 items-center gap-3">
                  <input
                    type="radio"
                    name="contact"
                    className="size-5 accent-brand"
                    checked={form.preferredContact === method.value}
                    onChange={() =>
                      update('preferredContact', method.value as ContactMethod)
                    }
                  />
                  {method.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-4">
          <h2 className="text-lg font-semibold">Controleer uw aanvraag</h2>
          <p className="text-sm text-ink-muted">
            Na verzenden nemen we contact op over uw aanvraag.
          </p>
          <dl className="grid gap-2 text-sm">
            <ReviewRow label="Dienst" value={serviceLabel} onEdit={() => setStep(0)} />
            <ReviewRow label="Situatie" value={situationLabel} onEdit={() => setStep(1)} />
            <ReviewRow
              label="Naam"
              value={`${form.firstName} ${form.lastName}`.trim()}
              onEdit={() => setStep(2)}
            />
            <ReviewRow label="E-mail" value={form.email} onEdit={() => setStep(2)} />
            <ReviewRow label="Telefoon" value={form.phone} onEdit={() => setStep(2)} />
            {address ? <ReviewRow label="Adres" value={address} onEdit={() => setStep(2)} /> : null}
            {form.message ? (
              <ReviewRow label="Opmerking" value={form.message} onEdit={() => setStep(2)} />
            ) : null}
          </dl>
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
              <Link to="/privacy" className="underline">
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
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <Button
          variant="ghost"
          disabled={step === 0 || status === 'submitting'}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
        >
          Vorige
        </Button>
        {step < 3 ? (
          <Button
            onClick={() => {
              if (validateStep(step)) setStep((value) => value + 1)
            }}
          >
            Volgende
          </Button>
        ) : (
          <Button type="submit" disabled={status === 'submitting' || Boolean(photoError)}>
            {status === 'submitting' ? 'Versturen…' : 'Aanvraag versturen'}
          </Button>
        )}
      </div>
    </form>
  )
}

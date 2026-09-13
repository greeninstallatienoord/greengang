import { useEffect, useId, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  bookingServiceLabel,
  bookingServices,
  bookingTimeWindowLabel,
  bookingTimeWindows,
  formatBookingDateLong,
  formatBookingDateShort,
  maxBookingDate,
  nextBusinessDay,
  todayAmsterdam,
  upcomingBusinessDays,
  validatePreferredDate,
} from '../../data/booking'
import { useSessionDraft } from '../../hooks/useSessionDraft'
import { submitBooking } from '../../lib/bookingService'
import { focusFirstError } from '../../lib/focusError'
import { FIELD_MAX } from '../../lib/formLimits'
import { required, validateEmail, validatePhone } from '../../lib/validation'
import { site } from '../../data/site'
import type { BookingRequest, FormStatus, ServiceSlug } from '../../types'
import { Button } from '../Button'
import { ButtonLink } from '../ButtonLink'
import { Field, TextArea, TextInput } from './Field'
import { FormPrivacyNote } from './FormPrivacyNote'
import { ProgressSteps } from './ProgressSteps'
import { cn } from '../../lib/cn'

const steps = ['Dienst', 'Datum', 'Tijd', 'Gegevens', 'Controle']

function newKey(): string {
  return crypto.randomUUID()
}

const emptyBooking: BookingRequest = {
  service: 'cv-ketel',
  appointmentType: 'adviesgesprek',
  preferredDate: '',
  preferredTimeWindow: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  message: '',
  privacyAccepted: false,
  website: '',
  idempotencyKey: '',
}

function freshBooking(service: ServiceSlug = 'cv-ketel'): BookingRequest {
  return { ...emptyBooking, service, idempotencyKey: newKey() }
}

function isServiceSlug(value: string | null): value is ServiceSlug {
  return bookingServices.some((item) => item.slug === value)
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
    <div className="flex justify-between gap-4 border-b border-line py-2.5">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="max-w-[70%] text-right">
        <span className="block font-medium break-words whitespace-pre-wrap">{value}</span>
        <button
          type="button"
          className="mt-1 text-sm font-semibold underline underline-offset-2"
          onClick={onEdit}
        >
          Wijzigen
        </button>
      </dd>
    </div>
  )
}

export function AppointmentFlow() {
  const [params] = useSearchParams()
  const preset = params.get('dienst')
  const systemPreset = params.get('systeem')
  const gasPreset = params.get('gasverbruik')
  const typePreset = params.get('type')
  const prefillMessage = [
    typePreset === 'adviesgesprek' ? 'Type: warmtepompadvies' : null,
    systemPreset === 'hybrid' || systemPreset === 'hybride'
      ? 'Voorkeur systeem: hybride'
      : systemPreset === 'all-electric'
        ? 'Voorkeur systeem: all-electric'
        : null,
    gasPreset && Number.isFinite(Number(gasPreset))
      ? `Huidig gasverbruik: ${Number(gasPreset)} m³/jaar`
      : null,
  ]
    .filter(Boolean)
    .join('\n')

  const [step, setStep] = useState(isServiceSlug(preset) ? 1 : 0)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [submitError, setSubmitError] = useState('')
  const [emailWarning, setEmailWarning] = useState('')
  const [showCustomDate, setShowCustomDate] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const lock = useRef(false)
  const successRef = useRef<HTMLDivElement>(null)
  const [form, setForm, clearDraft] = useSessionDraft<BookingRequest>('gin-booking-draft', {
    ...freshBooking(isServiceSlug(preset) ? preset : 'cv-ketel'),
    message: prefillMessage,
  })
  const timeLegend = useId()
  const quickDates = upcomingBusinessDays(5)
  const minDate = nextBusinessDay()
  const maxDate = maxBookingDate()

  useEffect(() => {
    setForm((current) =>
      current.idempotencyKey ? current : { ...current, idempotencyKey: newKey() },
    )
  }, [setForm])

  useEffect(() => {
    if (!prefillMessage) return
    setForm((current) =>
      current.message.trim() ? current : { ...current, message: prefillMessage },
    )
  }, [prefillMessage, setForm])

  useEffect(() => {
    if (status !== 'success') return
    const node = successRef.current
    if (!node) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    requestAnimationFrame(() => {
      node.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      node.focus({ preventScroll: true })
    })
  }, [status])

  function update<K extends keyof BookingRequest>(key: K, value: BookingRequest[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function validate(current: number): boolean {
    if (current === 0 && !form.service) {
      setErrors({ service: 'Kies eerst een dienst.' })
      return false
    }
    if (current === 1) {
      const preferredDate = validatePreferredDate(form.preferredDate)
      setErrors({ preferredDate })
      if (preferredDate) focusFirstError({ preferredDate })
      return !preferredDate
    }
    if (current === 2) {
      const preferredTimeWindow = !form.preferredTimeWindow
        ? 'Kies een voorkeurstijd.'
        : undefined
      setErrors({ preferredTimeWindow })
      if (preferredTimeWindow) focusFirstError({ preferredTimeWindow })
      return !preferredTimeWindow
    }
    if (current === 3) {
      const next = {
        firstName: required(form.firstName, 'Voornaam'),
        lastName: required(form.lastName, 'Achternaam'),
        phone: validatePhone(form.phone),
        email: validateEmail(form.email),
        address: required(form.address, 'Adres'),
      }
      setErrors(next)
      const ok = !Object.values(next).some(Boolean)
      if (!ok) focusFirstError(next)
      return ok
    }
    if (current === 4 && !form.privacyAccepted) {
      const next = { privacy: 'Bevestig dat u de privacyverklaring heeft gelezen.' }
      setErrors(next)
      focusFirstError(next)
      return false
    }
    setErrors({})
    return true
  }

  async function handleSubmit() {
    if (lock.current || status === 'submitting') return
    if (!validate(4)) return
    lock.current = true
    setStatus('submitting')
    setSubmitError('')
    const result = await submitBooking({
      ...form,
      idempotencyKey: form.idempotencyKey || newKey(),
    })
    if (result.ok) {
      clearDraft()
      setEmailWarning(result.emailWarning ?? '')
      setStatus('success')
      return
    }
    lock.current = false
    setSubmitError(
      result.message ||
        'Het versturen is niet gelukt. Uw gegevens zijn bewaard. Probeer het opnieuw of neem telefonisch contact met ons op.',
    )
    setStatus('error')
  }

  if (status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="scroll-mt-[calc(var(--header-offset)+0.75rem)] border border-line bg-paper p-5 outline-none sm:p-7"
      >
        <p className="text-sm font-semibold text-brand-dark">Aanvraag ontvangen</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
          Uw afspraakaanvraag is ontvangen
        </h2>
        <p className="mt-3 text-ink-muted">
          Bedankt. We hebben uw voorkeursdatum en tijd ontvangen. Dit is nog geen
          definitieve afspraak. We nemen contact met u op om het moment te bevestigen.
        </p>
        <dl className="mt-5 grid gap-2 text-sm">
          <div className="flex justify-between gap-4 border-b border-line py-2">
            <dt className="text-ink-muted">Dienst</dt>
            <dd className="font-medium text-right">{bookingServiceLabel(form.service)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-line py-2">
            <dt className="text-ink-muted">Datum</dt>
            <dd className="font-medium text-right">
              {form.preferredDate ? formatBookingDateLong(form.preferredDate) : '—'}
            </dd>
          </div>
          <div className="flex justify-between gap-4 py-2">
            <dt className="text-ink-muted">Tijdvak</dt>
            <dd className="font-medium text-right">
              {bookingTimeWindowLabel(form.preferredTimeWindow)}
            </dd>
          </div>
        </dl>
        {emailWarning ? <p className="mt-4 text-sm text-ink-muted">{emailWarning}</p> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink to="/">Terug naar home</ButtonLink>
          <ButtonLink to="/contact" variant="secondary">
            Contact opnemen
          </ButtonLink>
        </div>
      </div>
    )
  }

  return (
    <form
      className="relative border border-line bg-paper p-5 sm:p-7"
      onSubmit={(event) => {
        event.preventDefault()
        if (step === 4) void handleSubmit()
      }}
      noValidate
    >
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website ?? ''}
          onChange={(event) => update('website', event.target.value)}
        />
      </div>

      <ProgressSteps steps={steps} current={step} />

      {step === 0 ? (
        <fieldset>
          <legend className="mb-4 text-lg font-semibold">Kies een dienst</legend>
          <div className="grid gap-3">
            {bookingServices.map((service) => {
              const selected = form.service === service.slug
              return (
                <button
                  key={service.slug}
                  type="button"
                  aria-pressed={selected}
                  className={cn(
                    'min-h-14 rounded-sm border p-4 text-left transition-colors',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                    selected
                      ? 'border-brand bg-brand-soft/70'
                      : 'border-line hover:border-brand/50 hover:bg-stone/40',
                  )}
                  onClick={() => {
                    update('service', service.slug)
                    setStep(1)
                  }}
                >
                  <span className="block font-semibold">{service.label}</span>
                  <span className="mt-1 block text-sm text-ink-muted">{service.hint}</span>
                </button>
              )
            })}
          </div>
          {errors.service ? (
            <p className="mt-2 text-sm text-danger" role="alert">
              {errors.service}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      {step === 1 ? (
        <div>
          <h2 className="mb-2 text-lg font-semibold">Kies een voorkeursdatum</h2>
          <p className="mb-4 text-sm text-ink-muted">
            Alleen werkdagen. Dit is een voorkeur, geen bevestigde afspraak.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {quickDates.map((day) => {
              const selected = form.preferredDate === day
              const suggested = day === minDate
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={selected}
                  className={cn(
                    'min-h-[4.5rem] rounded-sm border px-2 py-3 text-center transition-colors',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                    selected
                      ? 'border-brand bg-brand-soft/70'
                      : 'border-line hover:border-brand/50',
                  )}
                  onClick={() => {
                    update('preferredDate', day)
                    setShowCustomDate(false)
                    setErrors((current) => ({ ...current, preferredDate: undefined }))
                  }}
                >
                  <span className="block text-sm font-semibold capitalize">
                    {formatBookingDateShort(day)}
                  </span>
                  {suggested ? (
                    <span className="mt-1 block text-[0.7rem] text-ink-muted">Eerstvolgend</span>
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-2"
              onClick={() => setShowCustomDate((value) => !value)}
            >
              {showCustomDate ? 'Snelle datums tonen' : 'Andere datum kiezen'}
            </button>
          </div>

          {showCustomDate ? (
            <div className="mt-4">
              <Field
                id="preferredDate"
                label="Andere datum"
                error={errors.preferredDate}
              >
                <TextInput
                  id="preferredDate"
                  type="date"
                  className="min-h-12"
                  min={todayAmsterdam()}
                  max={maxDate}
                  value={form.preferredDate}
                  error={errors.preferredDate}
                  onChange={(event) => update('preferredDate', event.target.value)}
                />
              </Field>
            </div>
          ) : errors.preferredDate ? (
            <p className="mt-3 text-sm text-danger" role="alert">
              {errors.preferredDate}
            </p>
          ) : null}
        </div>
      ) : null}

      {step === 2 ? (
        <div>
          <h2 className="mb-1 text-lg font-semibold">Kies een voorkeurstijd</h2>
          <p className="mb-1 text-sm text-ink-muted">
            Datum: {form.preferredDate ? formatBookingDateLong(form.preferredDate) : '—'}
          </p>
          <p className="mb-4 text-sm text-ink-muted">
            Dit is uw voorkeursmoment. De afspraak is definitief nadat wij deze hebben
            bevestigd.
          </p>
          <div
            role="radiogroup"
            aria-labelledby={timeLegend}
            className="grid gap-3 sm:grid-cols-2"
          >
            <p id={timeLegend} className="sr-only">
              Voorkeurstijd
            </p>
            {bookingTimeWindows.map((window) => {
              const selected = form.preferredTimeWindow === window.value
              return (
                <button
                  key={window.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={cn(
                    'min-h-14 rounded-sm border p-4 text-left transition-colors',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
                    selected
                      ? 'border-brand bg-brand-soft/70'
                      : 'border-line hover:border-brand/50',
                  )}
                  onClick={() => update('preferredTimeWindow', window.value)}
                >
                  <span className="block font-semibold">{window.label}</span>
                  <span className="mt-1 block text-sm text-ink-muted">{window.range}</span>
                </button>
              )
            })}
          </div>
          {errors.preferredTimeWindow ? (
            <p className="mt-2 text-sm text-danger" role="alert">
              {errors.preferredTimeWindow}
            </p>
          ) : null}
        </div>
      ) : null}

      {step === 3 ? (
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
          <Field id="phone" label="Telefoon" error={errors.phone}>
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
          <div className="sm:col-span-2">
            <Field id="address" label="Adres" error={errors.address}>
              <TextInput
                id="address"
                autoComplete="street-address"
                value={form.address}
                error={errors.address}
                maxLength={200}
                onChange={(event) => update('address', event.target.value)}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field
              id="message"
              label="Opmerking (optioneel)"
              hint="Toegang, storing of wat we moeten weten."
            >
              <TextArea
                id="message"
                className="min-h-[8.5rem] resize-y"
                rows={5}
                value={form.message}
                maxLength={FIELD_MAX.message}
                onChange={(event) => update('message', event.target.value)}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <FormPrivacyNote purpose="We gebruiken naam, telefoon, e-mail en adres om uw afspraakaanvraag te beoordelen en contact met u op te nemen. Een gekozen moment is pas definitief na onze bevestiging." />
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="grid gap-3 text-sm">
          <h2 className="text-lg font-semibold">Controleer uw aanvraag</h2>
          <p className="text-ink-muted">
            Uw aanvraag is nog geen definitieve afspraak. Wij bevestigen het moment
            persoonlijk.
          </p>
          <dl className="grid gap-1">
            <ReviewRow
              label="Dienst"
              value={bookingServiceLabel(form.service)}
              onEdit={() => setStep(0)}
            />
            <ReviewRow
              label="Gewenste datum"
              value={form.preferredDate ? formatBookingDateLong(form.preferredDate) : ''}
              onEdit={() => setStep(1)}
            />
            <ReviewRow
              label="Voorkeurstijd"
              value={bookingTimeWindowLabel(form.preferredTimeWindow)}
              onEdit={() => setStep(2)}
            />
            <ReviewRow
              label="Naam"
              value={`${form.firstName} ${form.lastName}`.trim()}
              onEdit={() => setStep(3)}
            />
            <ReviewRow label="E-mail" value={form.email} onEdit={() => setStep(3)} />
            <ReviewRow label="Telefoon" value={form.phone} onEdit={() => setStep(3)} />
            <ReviewRow label="Adres" value={form.address} onEdit={() => setStep(3)} />
            {form.message ? (
              <ReviewRow label="Opmerking" value={form.message} onEdit={() => setStep(3)} />
            ) : null}
          </dl>
          <label className="mt-2 flex min-h-11 items-start gap-3">
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
              gelezen. De{' '}
              <Link to="/algemene-voorwaarden" className="underline underline-offset-2">
                algemene voorwaarden
              </Link>{' '}
              kan ik nu inzien; die gelden pas bij een latere overeenkomst.
            </span>
          </label>
          {errors.privacy ? (
            <p id="privacy-error" className="text-danger" role="alert">
              {errors.privacy}
            </p>
          ) : null}
          {submitError ? (
            <p className="text-danger" role="alert">
              {submitError} Bel desnoods{' '}
              <a href={site.contact.phoneHref} className="underline underline-offset-2">
                {site.contact.phone}
              </a>
              .
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="sticky bottom-[var(--cookie-banner-offset)] z-10 mt-6 flex justify-between gap-3 border-t border-line bg-paper py-3 pb-[max(0.75rem,env(safe-area-inset-bottom)+3.5rem)] sm:pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Button
          variant="ghost"
          disabled={step === 0 || status === 'submitting'}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
        >
          Vorige
        </Button>
        {step < 4 ? (
          <Button
            onClick={() => {
              if (validate(step)) setStep((value) => value + 1)
            }}
          >
            Volgende
          </Button>
        ) : (
          <Button type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Versturen…' : 'Afspraak aanvragen'}
          </Button>
        )}
      </div>
    </form>
  )
}

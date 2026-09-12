import { useEffect, useId, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { bookingServiceLabel, bookingServices, formatBookingDate } from '../../data/booking'
import { useSessionDraft } from '../../hooks/useSessionDraft'
import {
  getAvailability,
  getSlotConfig,
  submitBooking,
  type SlotConfig,
} from '../../lib/bookingService'
import { focusFirstError } from '../../lib/focusError'
import { FIELD_MAX } from '../../lib/formLimits'
import { required, validateEmail, validatePhone } from '../../lib/validation'
import type { BookingRequest, FormStatus, ServiceSlug } from '../../types'
import { Button } from '../Button'
import { ButtonLink } from '../ButtonLink'
import { Field, TextArea, TextInput } from './Field'
import { FormPrivacyNote } from './FormPrivacyNote'
import { ProgressSteps } from './ProgressSteps'

const steps = ['Dienst', 'Datum', 'Gegevens', 'Controleren']

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
}

function isServiceSlug(value: string | null): value is ServiceSlug {
  return bookingServices.some((item) => item.slug === value)
}

export function AppointmentFlow() {
  const [params] = useSearchParams()
  const preset = params.get('dienst')
  const [step, setStep] = useState(isServiceSlug(preset) ? 1 : 0)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [submitError, setSubmitError] = useState('')
  const [emailWarning, setEmailWarning] = useState('')
  const [slotConfig, setSlotConfig] = useState<SlotConfig | null>(null)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [availabilityMessage, setAvailabilityMessage] = useState(
    'Kies eerst een datum. Daarna ziet u alleen echte vrije tijden.',
  )
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [form, setForm, clearDraft] = useSessionDraft<BookingRequest>('gin-booking-draft', {
    ...emptyBooking,
    service: isServiceSlug(preset) ? preset : 'cv-ketel',
  })
  const slotsLegend = useId()

  useEffect(() => {
    void getSlotConfig().then(setSlotConfig)
  }, [])

  useEffect(() => {
    if (!form.preferredDate) return
    let active = true
    void getAvailability(form.preferredDate).then((result) => {
      if (!active) return
      setSlotsLoading(false)
      setAvailabilityMessage(result.message)
      setAvailableSlots(result.slots)
    })
    return () => {
      active = false
    }
  }, [form.preferredDate])

  function update<K extends keyof BookingRequest>(key: K, value: BookingRequest[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function dateError(value: string): string | undefined {
    if (!value) return 'Kies een datum.'
    if (slotConfig) {
      if (value < slotConfig.today) return 'Kies een datum in de toekomst.'
      if (value > slotConfig.maxDate) return 'Deze datum ligt te ver vooruit.'
      if (slotConfig.blockedDates.includes(value)) return 'Op deze datum plannen we geen afspraken.'
      const weekday = new Date(`${value}T12:00:00Z`).getUTCDay()
      const iso = weekday === 0 ? 7 : weekday
      if (!slotConfig.workingDays.includes(iso)) {
        return 'Op deze dag plannen we geen afspraken. Kies een werkdag.'
      }
    }
    return undefined
  }

  function validate(current: number): boolean {
    if (current === 1) {
      const next = {
        preferredDate: dateError(form.preferredDate),
        preferredTimeWindow: !form.preferredTimeWindow
          ? 'Kies een beschikbaar tijdstip.'
          : availableSlots.length > 0 && !availableSlots.includes(form.preferredTimeWindow)
            ? 'Dit tijdstip is niet meer beschikbaar. Kies een ander tijdstip.'
            : undefined,
      }
      setErrors(next)
      if (next.preferredDate || next.preferredTimeWindow) focusFirstError(next)
      return !next.preferredDate && !next.preferredTimeWindow
    }
    if (current === 2) {
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
    if (current === 3 && !form.privacyAccepted) {
      const next = { privacy: 'Bevestig dat u de privacyverklaring heeft gelezen.' }
      setErrors(next)
      focusFirstError(next)
      return false
    }
    setErrors({})
    return true
  }

  async function handleSubmit() {
    if (!validate(3)) return
    setStatus('submitting')
    setSubmitError('')
    const result = await submitBooking(form)
    if (result.ok) {
      clearDraft()
      setEmailWarning(result.emailWarning ?? '')
      setStatus('success')
      return
    }
    setSubmitError(result.message)
    setStatus('error')
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-line bg-paper p-5 shadow-card sm:p-7">
        <p className="text-sm font-semibold text-brand-dark">Aanvraag ontvangen</p>
        <h2 className="mt-2 text-2xl font-semibold">Bedankt, uw afspraakaanvraag is ontvangen.</h2>
        <p className="mt-3 text-ink-muted">
          We nemen uw aanvraag zo snel mogelijk in behandeling. Dit is nog geen bevestigde afspraak.
        </p>
        <dl className="mt-5 grid gap-2 text-sm">
          <div className="flex justify-between border-b border-line py-2">
            <dt className="text-ink-muted">Dienst</dt>
            <dd className="font-medium">{bookingServiceLabel(form.service)}</dd>
          </div>
          <div className="flex justify-between border-b border-line py-2">
            <dt className="text-ink-muted">Datum</dt>
            <dd className="font-medium">{formatBookingDate(form.preferredDate)}</dd>
          </div>
          <div className="flex justify-between py-2">
            <dt className="text-ink-muted">Tijd</dt>
            <dd className="font-medium">{form.preferredTimeWindow}</dd>
          </div>
        </dl>
        {emailWarning ? <p className="mt-4 text-sm text-ink-muted">{emailWarning}</p> : null}
        <div className="mt-6">
          <ButtonLink to="/">Terug naar de website</ButtonLink>
        </div>
      </div>
    )
  }

  return (
    <form
      className="relative rounded-lg border border-line bg-paper p-5 shadow-card sm:p-7"
      onSubmit={(event) => {
        event.preventDefault()
        if (step === 3) void handleSubmit()
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
            {bookingServices.map((service) => (
              <button
                key={service.slug}
                type="button"
                className={`min-h-14 rounded-md border p-4 text-left text-base font-semibold ${
                  form.service === service.slug
                    ? 'border-brand bg-brand-soft/70'
                    : 'border-line hover:border-brand hover:bg-brand-soft/60'
                }`}
                onClick={() => {
                  update('service', service.slug)
                  setStep(1)
                }}
              >
                {service.label}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-5">
          <Field
            id="preferredDate"
            label="Datum"
            hint="Alleen dagen waarop we plannen. Verleden is uitgeschakeld."
            error={errors.preferredDate}
          >
            <TextInput
              id="preferredDate"
              type="date"
              className="min-h-12"
              min={slotConfig?.today}
              max={slotConfig?.maxDate}
              value={form.preferredDate}
              error={errors.preferredDate}
              onChange={(event) => {
                update('preferredDate', event.target.value)
                update('preferredTimeWindow', '')
                setAvailableSlots([])
                setSlotsLoading(Boolean(event.target.value))
                setAvailabilityMessage(
                  event.target.value
                    ? 'Beschikbare tijden worden geladen…'
                    : 'Kies eerst een datum. Daarna ziet u alleen echte vrije tijden.',
                )
              }}
            />
          </Field>

          <div>
            <p id={slotsLegend} className="mb-2 text-sm font-semibold">
              Beschikbare tijden
            </p>
            <p className="mb-3 text-sm text-ink-muted" aria-live="polite">
              {availabilityMessage}
            </p>
            {slotsLoading ? (
              <p className="text-sm text-ink-muted" role="status">
                Laden…
              </p>
            ) : null}
            {!slotsLoading && form.preferredDate && availableSlots.length === 0 ? (
              <p className="rounded-md border border-dashed border-line px-3 py-4 text-sm text-ink-muted">
                Geen vrije tijden voor deze datum. Er worden geen voorbeeldtijden getoond.
              </p>
            ) : null}
            {availableSlots.length > 0 ? (
              <div
                role="radiogroup"
                aria-labelledby={slotsLegend}
                aria-invalid={Boolean(errors.preferredTimeWindow)}
                className="grid grid-cols-2 gap-2 sm:grid-cols-3"
              >
                {availableSlots.map((slot) => {
                  const selected = form.preferredTimeWindow === slot
                  return (
                    <button
                      key={slot}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`min-h-12 rounded-md border text-base font-semibold ${
                        selected
                          ? 'border-brand bg-brand-soft text-brand-dark'
                          : 'border-line bg-paper hover:border-brand'
                      }`}
                      onClick={() => update('preferredTimeWindow', slot)}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
            ) : null}
            {errors.preferredTimeWindow ? (
              <p className="mt-2 text-sm text-danger" role="alert">
                {errors.preferredTimeWindow}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormPrivacyNote purpose="We vragen naam, telefoon, e-mail en adres om de afspraakaanvraag te kunnen behandelen. Dit is nog geen bevestigde afspraak." />
          </div>
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
            <Field id="message" label="Bericht (optioneel)">
              <TextArea
                id="message"
                value={form.message}
                maxLength={FIELD_MAX.message}
                onChange={(event) => update('message', event.target.value)}
              />
            </Field>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-3 text-sm">
          <h2 className="text-lg font-semibold">Controleer uw aanvraag</h2>
          <dl className="grid gap-2">
            <Row label="Dienst" value={bookingServiceLabel(form.service)} />
            <Row
              label="Datum"
              value={form.preferredDate ? formatBookingDate(form.preferredDate) : ''}
            />
            <Row label="Tijd" value={form.preferredTimeWindow} />
            <Row label="Adres" value={form.address} />
            <Row
              label="Contact"
              value={`${form.firstName} ${form.lastName}\n${form.phone} · ${form.email}`}
            />
            {form.message ? <Row label="Bericht" value={form.message} /> : null}
          </dl>
          <label className="flex items-start gap-3">
            <input
              id="privacy"
              type="checkbox"
              className="mt-1 size-5 accent-brand"
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
              gelezen. Dit is een aanvraag, geen bevestigde afspraak.
            </span>
          </label>
          {errors.privacy ? (
            <p id="privacy-error" className="text-danger" role="alert">
              {errors.privacy}
            </p>
          ) : null}
          {submitError ? (
            <p className="text-danger" role="alert">
              {submitError}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="sticky bottom-0 z-10 mt-6 flex justify-between gap-3 border-t border-line bg-paper py-3">
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="max-w-[65%] text-right font-medium break-words whitespace-pre-wrap">{value}</dd>
    </div>
  )
}

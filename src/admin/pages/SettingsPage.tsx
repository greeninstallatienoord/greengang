import { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { Field, TextInput } from '../../components/forms/Field'
import { business } from '../../data/business'
import { api } from '../../lib/api'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Skeleton } from '../components/Skeleton'
import { useAdminAuth } from '../AdminAuth'

function presence(ok: boolean): string {
  return ok ? 'Ingesteld' : 'Niet ingesteld'
}

export function SettingsPage() {
  const { email } = useAdminAuth()
  const [horizon, setHorizon] = useState('28')
  const [workingDays, setWorkingDays] = useState('1,2,3,4,5')
  const [slotTimes, setSlotTimes] = useState('09:00,10:00,11:00,13:00,14:00,15:00,16:00')
  const [duration, setDuration] = useState('60')
  const [buffer, setBuffer] = useState('0')
  const [blocked, setBlocked] = useState('')
  const [fromEmail, setFromEmail] = useState<string>(business.email)
  const [emailConfigured, setEmailConfigured] = useState<boolean | null>(null)
  const [sessionConfigured, setSessionConfigured] = useState<boolean | null>(null)
  const [environment, setEnvironment] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [adminPath, setAdminPath] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void api.admin.settings().then((result) => {
      setLoading(false)
      if (!result.ok) {
        setError(result.message)
        return
      }
      setHorizon(result.data.appointments.slot_horizon_days ?? '28')
      setWorkingDays(result.data.appointments.working_days ?? '1,2,3,4,5')
      setSlotTimes(
        result.data.appointments.slot_times ?? '09:00,10:00,11:00,13:00,14:00,15:00,16:00',
      )
      setDuration(result.data.appointments.slot_duration_minutes ?? '60')
      setBuffer(result.data.appointments.buffer_minutes ?? '0')
      setBlocked(result.data.appointments.blocked_dates ?? '')
      setFromEmail(result.data.email.from_email ?? business.email)
      setEmailConfigured(result.data.email.configured)
      setSessionConfigured(result.data.system?.sessionConfigured ?? null)
      setEnvironment(result.data.system?.environment ?? '')
      setSiteUrl(result.data.system?.siteUrl ?? '')
      setAdminPath(result.data.system?.adminPath ?? '')
    })
  }, [])

  async function save() {
    setBusy(true)
    const result = await api.admin.updateSettings({
      slot_horizon_days: horizon,
      working_days: workingDays,
      slot_times: slotTimes,
      slot_duration_minutes: duration,
      buffer_minutes: buffer,
      blocked_dates: blocked,
      from_email: fromEmail,
    })
    setBusy(false)
    if (result.ok) {
      setSaved('Instellingen opgeslagen.')
      setError('')
    } else {
      setError(result.message)
    }
  }

  if (loading) return <Skeleton rows={6} />

  return (
    <div>
      <PageHeader title="Instellingen" description="Alleen bestaande configuratie. Geheimen worden niet getoond." />

      <section className="mb-6 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-5">
        <h2 className="font-semibold">Bedrijfsgegevens</h2>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">
          Komt uit de centrale configuratie. Wijzig deze niet hier als de publieke site moet wijzigen.
        </p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <Info label="Naam" value={business.businessName} />
          <Info label="Telefoon" value={business.phone} />
          <Info
            label="Adres"
            value={`${business.address.street}, ${business.address.postalCode} ${business.address.city}`}
          />
          <Info label="E-mail" value={business.email} />
          <Info label="KVK" value={business.kvk} />
        </dl>
      </section>

      <section className="mb-6 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-5">
        <h2 className="font-semibold">Afspraakinstellingen</h2>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">
          Deze tijden zijn instelbaar. Ze zijn geen bewijs van vaste openingstijden op de website.
        </p>
        <div className="mt-4 grid max-w-xl gap-4">
          <Field id="horizon" label="Dagen vooruit zichtbaar">
            <TextInput id="horizon" inputMode="numeric" value={horizon} onChange={(e) => setHorizon(e.target.value)} />
          </Field>
          <Field id="days" label="Werkdagen" hint="1=maandag … 7=zondag">
            <TextInput id="days" value={workingDays} onChange={(e) => setWorkingDays(e.target.value)} />
          </Field>
          <Field id="times" label="Tijdvakken" hint="Bijvoorbeeld 09:00,10:00,13:00">
            <TextInput id="times" value={slotTimes} onChange={(e) => setSlotTimes(e.target.value)} />
          </Field>
          <Field id="duration" label="Duur per afspraak (minuten)">
            <TextInput id="duration" inputMode="numeric" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </Field>
          <Field id="buffer" label="Buffer tussen afspraken (minuten)">
            <TextInput id="buffer" inputMode="numeric" value={buffer} onChange={(e) => setBuffer(e.target.value)} />
          </Field>
          <Field id="blocked" label="Geblokkeerde datums" hint="Optioneel, komma’s, formaat 2026-12-25">
            <TextInput id="blocked" value={blocked} onChange={(e) => setBlocked(e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="mb-6 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-5">
        <h2 className="font-semibold">E-mail</h2>
        <p className="mt-1 text-sm text-[var(--admin-muted)]">
          De API-sleutel zelf wordt niet getoond.
        </p>
        <dl className="mt-4 grid gap-3 text-sm">
          <Info label="Verzenden via Resend" value={emailConfigured === null ? '-' : presence(emailConfigured)} />
        </dl>
        <div className="mt-4 max-w-sm">
          <Field id="from" label="Afzender" hint="Moet in Resend geverifieerd zijn.">
            <TextInput id="from" type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="mb-6 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-5">
        <h2 className="font-semibold">Systeem</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <Info label="Omgeving" value={environment || '-'} />
          <Info label="Website-URL" value={siteUrl || '-'} />
          <Info label="Beheerpad" value={adminPath || '-'} />
          <Info
            label="Sessiebeveiliging"
            value={sessionConfigured === null ? '-' : presence(sessionConfigured)}
          />
          <Info label="Ingelogd als" value={email} />
        </dl>
        <p className="mt-4 text-sm text-[var(--admin-muted)]">
          Wachtwoorden staan gehashed in D1. Er is geen wachtwoord in de frontendbron.
        </p>
      </section>

      {error ? <div className="mb-3"><Notice tone="error">{error}</Notice></div> : null}
      {saved ? <div className="mb-3"><Notice tone="success">{saved}</Notice></div> : null}
      <Button type="button" disabled={busy} onClick={() => void save()}>
        {busy ? 'Bezig…' : 'Opslaan'}
      </Button>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold tracking-[0.06em] text-[var(--admin-muted)] uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-medium break-words">{value}</dd>
    </div>
  )
}

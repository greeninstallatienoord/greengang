import { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { Field, TextInput } from '../../components/forms/Field'
import { business } from '../../data/business'
import { api } from '../../lib/api'
import { PageHeader } from '../components/PageHeader'
import { useAdminAuth } from '../AdminAuth'

export function SettingsPage() {
  const { email } = useAdminAuth()
  const [horizon, setHorizon] = useState('28')
  const [workingDays, setWorkingDays] = useState('1,2,3,4,5')
  const [slotTimes, setSlotTimes] = useState('09:00,10:00,11:00,13:00,14:00,15:00,16:00')
  const [duration, setDuration] = useState('60')
  const [buffer, setBuffer] = useState('0')
  const [blocked, setBlocked] = useState('')
  const [fromEmail, setFromEmail] = useState<string>(business.email)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')

  useEffect(() => {
    void api.admin.settings().then((result) => {
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
    })
  }, [])

  async function save() {
    const result = await api.admin.updateSettings({
      slot_horizon_days: horizon,
      working_days: workingDays,
      slot_times: slotTimes,
      slot_duration_minutes: duration,
      buffer_minutes: buffer,
      blocked_dates: blocked,
      from_email: fromEmail,
    })
    if (result.ok) {
      setSaved('Instellingen opgeslagen.')
      setError('')
    } else {
      setError(result.message)
    }
  }

  return (
    <div>
      <PageHeader title="Instellingen" />

      <section className="mb-8 rounded-md border border-line bg-paper p-4">
        <h2 className="font-semibold">Bedrijfsgegevens</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Komt uit de centrale configuratie. Wijzig deze niet hier als de publieke site moet
          wijzigen.
        </p>
        <dl className="mt-4 grid gap-2 text-sm">
          <div>
            <dt className="text-ink-muted">Naam</dt>
            <dd className="font-medium">{business.businessName}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Adres</dt>
            <dd className="font-medium">
              {business.address.street}, {business.address.postalCode} {business.address.city}
            </dd>
          </div>
          <div>
            <dt className="text-ink-muted">Telefoon</dt>
            <dd className="font-medium">{business.phone}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">E-mail</dt>
            <dd className="font-medium">{business.email}</dd>
          </div>
        </dl>
      </section>

      <section className="mb-8 rounded-md border border-line bg-paper p-4">
        <h2 className="font-semibold">Afspraakinstellingen</h2>
        <p className="mt-1 text-sm text-ink-muted">
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

      <section className="mb-8 rounded-md border border-line bg-paper p-4">
        <h2 className="font-semibold">E-mailinstellingen</h2>
        <div className="mt-4 max-w-sm">
          <Field id="from" label="Afzender" hint="Moet in Resend geverifieerd zijn.">
            <TextInput id="from" type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="mb-8 rounded-md border border-line bg-paper p-4">
        <h2 className="font-semibold">Beheerder</h2>
        <p className="mt-2 text-sm">Ingelogd als {email}.</p>
        <p className="mt-2 text-sm text-ink-muted">
          Wachtwoorden staan gehashed in D1. Er is geen wachtwoord in de frontendbron.
        </p>
      </section>

      {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}
      {saved ? <p className="mb-3 text-sm text-brand-dark">{saved}</p> : null}
      <Button type="button" onClick={() => void save()}>
        Opslaan
      </Button>
    </div>
  )
}

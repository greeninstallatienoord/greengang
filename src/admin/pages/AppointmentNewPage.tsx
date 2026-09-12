import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Field, TextArea, TextInput } from '../../components/forms/Field'
import { api } from '../../lib/api'
import { BackLink } from '../components/BackLink'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { serviceLabel } from '../labels'
import { adminUrl } from '../adminPath'

const services = ['cv-ketel', 'airco', 'warmtepomp', 'service-onderhoud'] as const
const selectClass =
  'min-h-11 w-full border border-[var(--admin-line)] bg-[var(--admin-panel)] px-3 text-sm'

export function AppointmentNewPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    service: 'cv-ketel',
    appointment_date: '',
    appointment_time: '',
  })
  const [slots, setSlots] = useState<string[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!form.appointment_date) return
    let active = true
    void api.appointmentSlots(form.appointment_date).then((result) => {
      if (!active) return
      setSlots(result.ok ? result.data.slots : [])
    })
    return () => {
      active = false
    }
  }, [form.appointment_date])

  async function onSubmit() {
    setBusy(true)
    setError('')
    const result = await api.admin.createAppointment(form)
    setBusy(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate(adminUrl(`appointments/${result.data.id}`))
  }

  return (
    <div>
      <BackLink to={adminUrl('appointments')}>Terug naar afspraken</BackLink>
      <PageHeader
        title="Nieuwe afspraak"
        description="Wordt opgeslagen als aanvraag tot u bevestigt."
      />
      <form
        className="grid max-w-xl gap-4 border border-[var(--admin-line)] bg-[var(--admin-panel)] p-5"
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit()
        }}
      >
        <Field id="name" label="Naam">
          <TextInput id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field id="email" label="E-mail">
          <TextInput id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field id="phone" label="Telefoon">
          <TextInput id="phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
        <Field id="address" label="Adres (optioneel)">
          <TextInput id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </Field>
        <Field id="service" label="Dienst">
          <select
            id="service"
            className={selectClass}
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
          >
            {services.map((slug) => (
              <option key={slug} value={slug}>
                {serviceLabel[slug]}
              </option>
            ))}
          </select>
        </Field>
        <Field id="date" label="Datum">
          <TextInput
            id="date"
            type="date"
            required
            value={form.appointment_date}
            onChange={(e) => {
              setSlots([])
              setForm({ ...form, appointment_date: e.target.value, appointment_time: '' })
            }}
          />
        </Field>
        <Field id="time" label="Tijd">
          <select
            id="time"
            required
            className={selectClass}
            value={form.appointment_time}
            onChange={(e) => setForm({ ...form, appointment_time: e.target.value })}
          >
            <option value="">{form.appointment_date ? 'Kies een tijd' : 'Kies eerst een datum'}</option>
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </Field>
        <Field id="notes" label="Toelichting">
          <TextArea id="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </Field>
        {error ? <Notice tone="error">{error}</Notice> : null}
        <Button type="submit" disabled={busy}>
          {busy ? 'Bezig…' : 'Opslaan'}
        </Button>
      </form>
    </div>
  )
}

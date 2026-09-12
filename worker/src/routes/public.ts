import { findOrCreateCustomer } from '../customers'
import { adminRecordUrl, emailOutcome, sendEmail, type EmailStatus } from '../email'
import type { WorkerEnv } from '../env'
import { HttpError } from '../http'
import { readIdempotencyKey, releaseSubmission, reserveSubmission } from '../idempotency'
import { assertSlotFree, listSlots, publicSlotConfig } from '../slots'
import * as v from '../validation'

export { listSlots, publicSlotConfig }

const SERVICE_LABEL: Record<string, string> = {
  'cv-ketel': 'CV-ketel installatie',
  airco: 'Airconditioning installatie',
  warmtepomp: 'Warmtepomp installatie',
  'service-onderhoud': 'Service en onderhoud',
  overig: 'Overig',
}

const SITUATION_LABEL: Record<string, string> = {
  'nieuwe-installatie': 'Nieuwe installatie',
  vervanging: 'Vervanging',
  onderhoud: 'Onderhoud',
  'storing-reparatie': 'Storing of reparatie',
  'weet-ik-niet': 'Weet ik nog niet',
}

function nowIso(): string {
  return new Date().toISOString()
}

function formatStamp(iso: string): string {
  return new Intl.DateTimeFormat('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso))
}

function firstNameOf(name: string): string {
  return name.trim().split(/\s+/).find(Boolean) ?? name
}

function rejectBots(body: Record<string, unknown>) {
  v.rejectHoneypot(body.website)
  v.rejectHoneypot(body.company)
}

type PublicSubmission = {
  id: string
  status: string
  replayed?: boolean
  emails: { admin: EmailStatus; customer: EmailStatus }
  emailWarning?: string
}

async function replayContact(env: WorkerEnv, id: string) {
  const row = await env.DB.prepare('SELECT id, status FROM contact_submissions WHERE id = ?')
    .bind(id)
    .first<{ id: string; status: string }>()
  if (!row) throw new HttpError(409, 'Deze aanvraag kon niet opnieuw worden verwerkt. Probeer het opnieuw.')
  return {
    id: row.id,
    status: row.status,
    replayed: true,
    emails: { admin: 'skipped' as const, customer: 'skipped' as const },
  }
}

async function replayQuote(env: WorkerEnv, id: string) {
  const row = await env.DB.prepare('SELECT id, status FROM quote_requests WHERE id = ?')
    .bind(id)
    .first<{ id: string; status: string }>()
  if (!row) throw new HttpError(409, 'Deze aanvraag kon niet opnieuw worden verwerkt. Probeer het opnieuw.')
  return {
    id: row.id,
    status: row.status,
    replayed: true,
    emails: { admin: 'skipped' as const, customer: 'skipped' as const },
  }
}

async function replayAppointment(env: WorkerEnv, id: string) {
  const row = await env.DB.prepare('SELECT id, status FROM appointments WHERE id = ?')
    .bind(id)
    .first<{ id: string; status: string }>()
  if (!row) throw new HttpError(409, 'Deze aanvraag kon niet opnieuw worden verwerkt. Probeer het opnieuw.')
  return {
    id: row.id,
    status: row.status,
    replayed: true,
    emails: { admin: 'skipped' as const, customer: 'skipped' as const },
  }
}

export async function createContact(env: WorkerEnv, body: Record<string, unknown>): Promise<PublicSubmission> {
  rejectBots(body)
  v.privacyAccepted(body.privacyAccepted)
  const name = v.text(body.name, 'Naam', 80)
  const email = v.email(body.email)
  const phone = v.phone(body.phone, false)
  const message = v.text(body.message, 'Bericht', 4000)
  const subject = v.text(body.subject, 'Onderwerp', 120, false)
  const now = nowIso()
  const id = crypto.randomUUID()
  const key = readIdempotencyKey(body.idempotencyKey)
  const reserved = await reserveSubmission(env, 'contact', key, id, now)
  if ('replayId' in reserved) return replayContact(env, reserved.replayId)

  await findOrCreateCustomer(env, { name, email, phone })
  try {
    try {
      await env.DB.prepare(
        `INSERT INTO contact_submissions (id, name, email, phone, message, subject, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'new', ?)`,
      )
        .bind(id, name, email, phone || null, message, subject || null, now)
        .run()
    } catch {
      const storedMessage = subject ? `Onderwerp: ${subject}\n\n${message}` : message
      await env.DB.prepare(
        `INSERT INTO contact_submissions (id, name, email, phone, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, 'new', ?)`,
      )
        .bind(id, name, email, phone || null, storedMessage, now)
        .run()
    }
  } catch (error) {
    await releaseSubmission(env, key)
    throw error
  }

  const adminMail = await sendEmail(env, {
    to: 'info@greeninstallatienoord.nl',
    templateId: 'tpl-contact-admin',
    relatedType: 'contact',
    relatedId: id,
    subject: `Nieuw contactbericht - ${name}`,
    text: [
      'Er is een bericht via het contactformulier binnengekomen.',
      `Ontvangen: ${formatStamp(now)}`,
      `Naam: ${name}`,
      `E-mail: ${email}`,
      phone ? `Telefoon: ${phone}` : '',
      subject ? `Onderwerp: ${subject}` : '',
      '',
      message,
      '',
      `Beheer: ${adminRecordUrl(env, `/contact/${id}`)}`,
    ]
      .filter(Boolean)
      .join('\n'),
  })

  const customerMail = await sendEmail(env, {
    to: email,
    templateId: 'tpl-thank-you',
    relatedType: 'contact',
    relatedId: id,
    subject: 'We hebben uw bericht ontvangen',
    recipientName: name,
    text: [
      `Beste ${firstNameOf(name)},`,
      '',
      'Bedankt voor uw bericht bij Green Installatie Noord.',
      '',
      'We hebben uw bericht ontvangen en nemen het in behandeling. Dit is een ontvangstbevestiging.',
      '',
      'U kunt ons bereiken via 06 28 73 91 34 of info@greeninstallatienoord.nl.',
      '',
      'Met vriendelijke groet,',
      'Green Installatie Noord',
    ].join('\n'),
  })

  return { id, status: 'new', ...emailOutcome(adminMail, customerMail) }
}

export async function createQuote(env: WorkerEnv, body: Record<string, unknown>): Promise<PublicSubmission> {
  rejectBots(body)
  v.privacyAccepted(body.privacyAccepted)
  const firstName = v.text(body.firstName, 'Voornaam', 80)
  const lastName = v.text(body.lastName, 'Achternaam', 80)
  const name = `${firstName} ${lastName}`.trim()
  const email = v.email(body.email)
  const phone = v.phone(body.phone)
  const service =
    typeof body.service === 'string' && body.service === 'overig' ? 'overig' : v.service(body.service)
  const address = [
    v.text(body.street, 'Straat', 80, false),
    v.text(body.houseNumber, 'Huisnummer', 20, false),
    v.text(body.postalCode, 'Postcode', 10, false),
    v.text(body.city, 'Plaats', 80, false),
  ]
    .filter(Boolean)
    .join(' ')
  const message = v.text(body.message, 'Toelichting', 4000, false)
  const situation = v.text(body.situation, 'Situatie', 80, false)
  const preferredContact = v.text(body.preferredContact, 'Contactvoorkeur', 40, false)
  const storedMessage = [
    situation ? `Situatie: ${SITUATION_LABEL[situation] ?? situation}` : '',
    preferredContact && preferredContact !== 'geen-voorkeur'
      ? `Contactvoorkeur: ${preferredContact}`
      : '',
    message,
  ]
    .filter(Boolean)
    .join('\n')
  const now = nowIso()
  const id = crypto.randomUUID()
  const key = readIdempotencyKey(body.idempotencyKey)
  const reserved = await reserveSubmission(env, 'quote', key, id, now)
  if ('replayId' in reserved) return replayQuote(env, reserved.replayId)

  await findOrCreateCustomer(env, { name, email, phone, address })
  try {
    try {
      await env.DB.prepare(
        `INSERT INTO quote_requests (id, name, email, phone, address, service, situation, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
      )
        .bind(id, name, email, phone, address || null, service, situation || null, storedMessage || null, now)
        .run()
    } catch {
      await env.DB.prepare(
        `INSERT INTO quote_requests (id, name, email, phone, address, service, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
      )
        .bind(id, name, email, phone, address || null, service, storedMessage || null, now)
        .run()
    }
  } catch (error) {
    await releaseSubmission(env, key)
    throw error
  }

  const serviceName = SERVICE_LABEL[service] ?? service
  const situationName = situation ? (SITUATION_LABEL[situation] ?? situation) : ''
  const adminMail = await sendEmail(env, {
    to: 'info@greeninstallatienoord.nl',
    templateId: 'tpl-quote-admin',
    relatedType: 'quote',
    relatedId: id,
    subject: `Nieuwe offerteaanvraag - ${serviceName}`,
    text: [
      'Er is een offerteaanvraag binnengekomen. Dit is geen bestelling.',
      `Ontvangen: ${formatStamp(now)}`,
      `Klant: ${name}`,
      `Dienst: ${serviceName}`,
      situationName ? `Situatie: ${situationName}` : '',
      `E-mail: ${email}`,
      `Telefoon: ${phone}`,
      address ? `Adres: ${address}` : '',
      preferredContact ? `Contactvoorkeur: ${preferredContact}` : '',
      message ? `Opmerking: ${message}` : '',
      '',
      `Beheer: ${adminRecordUrl(env, `/quotes/${id}`)}`,
    ]
      .filter(Boolean)
      .join('\n'),
  })

  const customerMail = await sendEmail(env, {
    to: email,
    templateId: 'tpl-quote-received-customer',
    relatedType: 'quote',
    relatedId: id,
    subject: 'Uw offerteaanvraag is ontvangen',
    recipientName: name,
    text: [
      `Beste ${firstName},`,
      '',
      'Bedankt voor uw aanvraag bij Green Installatie Noord.',
      '',
      'We hebben uw offerteaanvraag ontvangen. Dit is een ontvangstbevestiging, nog geen offerte en geen opdracht.',
      `Dienst: ${serviceName}`,
      situationName ? `Situatie: ${situationName}` : '',
      '',
      'We bekijken uw aanvraag en nemen contact met u op.',
      '',
      'U kunt ons bereiken via 06 28 73 91 34 of info@greeninstallatienoord.nl.',
      '',
      'Met vriendelijke groet,',
      'Green Installatie Noord',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  return { id, status: 'new', ...emailOutcome(adminMail, customerMail) }
}

export async function createAppointment(env: WorkerEnv, body: Record<string, unknown>): Promise<PublicSubmission> {
  rejectBots(body)
  v.privacyAccepted(body.privacyAccepted)
  const firstName = v.text(body.firstName, 'Voornaam', 80)
  const lastName = v.text(body.lastName, 'Achternaam', 80)
  const name = `${firstName} ${lastName}`.trim()
  const email = v.email(body.email)
  const phone = v.phone(body.phone)
  const service = v.service(body.service)
  const date = v.dateOnly(body.preferredDate ?? body.appointment_date)
  const time = v.timeOnly(body.preferredTimeWindow ?? body.appointment_time)
  const notes = v.text(body.message ?? body.notes, 'Toelichting', 4000, false)
  const address = v.text(body.address, 'Adres', 200)
  const now = nowIso()
  const serviceName = SERVICE_LABEL[service] ?? service
  const appointmentId = crypto.randomUUID()
  const key = readIdempotencyKey(body.idempotencyKey)
  const reserved = await reserveSubmission(env, 'appointment', key, appointmentId, now)
  if ('replayId' in reserved) return replayAppointment(env, reserved.replayId)

  try {
    await assertSlotFree(env, date, time)
  } catch (error) {
    await releaseSubmission(env, key)
    throw error
  }

  const customerId = await findOrCreateCustomer(env, { name, email, phone, address })

  try {
    await env.DB.prepare(
      `INSERT INTO appointments (id, customer_id, service, appointment_date, appointment_time, status, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
    )
      .bind(appointmentId, customerId, service, date, time, notes || null, now, now)
      .run()
  } catch {
    await releaseSubmission(env, key)
    throw new HttpError(409, 'Dit tijdstip is helaas net bezet. Kies een ander tijdstip.')
  }

  const adminMail = await sendEmail(env, {
    to: 'info@greeninstallatienoord.nl',
    templateId: 'tpl-appointment-admin',
    relatedType: 'appointment',
    relatedId: appointmentId,
    subject: `Nieuwe afspraakaanvraag - ${serviceName} - ${date}`,
    text: [
      'Er is een afspraakaanvraag binnengekomen. Dit is nog geen bevestigde afspraak.',
      `Ontvangen: ${formatStamp(now)}`,
      `Klant: ${name}`,
      `Dienst: ${serviceName}`,
      `Datum: ${date}`,
      `Tijd: ${time}`,
      `Telefoon: ${phone}`,
      `E-mail: ${email}`,
      `Adres: ${address}`,
      notes ? `Opmerking: ${notes}` : '',
      '',
      `Beheer: ${adminRecordUrl(env, `/appointments/${appointmentId}`)}`,
    ]
      .filter(Boolean)
      .join('\n'),
  })

  const customerMail = await sendEmail(env, {
    to: email,
    templateId: 'tpl-appointment-customer',
    relatedType: 'appointment',
    relatedId: appointmentId,
    subject: 'Uw afspraakaanvraag bij Green Installatie Noord',
    recipientName: name,
    text: [
      `Beste ${firstName},`,
      '',
      'Bedankt voor uw aanvraag bij Green Installatie Noord.',
      '',
      'Uw afspraakaanvraag is ontvangen. Dit is nog geen bevestigde afspraak.',
      `Dienst: ${serviceName}`,
      `Gewenste datum: ${date}`,
      `Gewenste tijd: ${time}`,
      address ? `Adres: ${address}` : '',
      notes ? `Opmerking: ${notes}` : '',
      '',
      'We bekijken uw aanvraag en nemen contact met u op.',
      '',
      'U kunt ons bereiken via 06 28 73 91 34 of info@greeninstallatienoord.nl.',
      '',
      'Met vriendelijke groet,',
      'Green Installatie Noord',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  return {
    id: appointmentId,
    status: 'pending',
    ...emailOutcome(adminMail, customerMail),
  }
}

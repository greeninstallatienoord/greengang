import { findOrCreateCustomer } from '../customers'
import type { WorkerEnv } from '../env'
import { sendEmail } from '../email'
import { HttpError } from '../http'
import { assertSlotFree, listSlots, publicSlotConfig } from '../slots'
import * as v from '../validation'

export { listSlots, publicSlotConfig }

const SERVICE_LABEL: Record<string, string> = {
  'cv-ketel': 'CV-ketel',
  airco: 'Airco',
  warmtepomp: 'Warmtepomp',
  'service-onderhoud': 'CV-ketel service en onderhoud',
}

function nowIso(): string {
  return new Date().toISOString()
}

export async function createContact(env: WorkerEnv, body: Record<string, unknown>) {
  v.privacyAccepted(body.privacyAccepted)
  const name = v.text(body.name, 'Naam', 80)
  const email = v.email(body.email)
  const phone = v.phone(body.phone, false)
  const message = v.text(body.message, 'Bericht', 4000)
  const id = crypto.randomUUID()
  await findOrCreateCustomer(env, { name, email, phone })
  await env.DB.prepare(
    `INSERT INTO contact_submissions (id, name, email, phone, message, status, created_at)
     VALUES (?, ?, ?, ?, ?, 'new', ?)`,
  )
    .bind(id, name, email, phone || null, message, nowIso())
    .run()

  const mail = await sendEmail(env, {
    to: 'info@greeninstallatienoord.nl',
    templateId: 'tpl-contact-admin',
    subject: `Nieuw contactbericht – ${name}`,
    text: [
      'Er is een bericht via het contactformulier binnengekomen.',
      `Naam: ${name}`,
      `E-mail: ${email}`,
      phone ? `Telefoon: ${phone}` : '',
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n'),
  })

  return { id, status: 'new', emails: { admin: mail.status } }
}

export async function createQuote(env: WorkerEnv, body: Record<string, unknown>) {
  v.privacyAccepted(body.privacyAccepted)
  const firstName = v.text(body.firstName, 'Voornaam', 80)
  const lastName = v.text(body.lastName, 'Achternaam', 80)
  const name = `${firstName} ${lastName}`.trim()
  const email = v.email(body.email)
  const phone = v.phone(body.phone)
  const service = typeof body.service === 'string' && body.service === 'overig'
    ? 'overig'
    : v.service(body.service)
  const address = [
    v.text(body.street, 'Straat', 80, false),
    v.text(body.houseNumber, 'Huisnummer', 20, false),
    v.text(body.postalCode, 'Postcode', 10, false),
    v.text(body.city, 'Plaats', 80, false),
  ]
    .filter(Boolean)
    .join(' ')
  const message = v.text(body.message, 'Toelichting', 4000, false)
  const id = crypto.randomUUID()
  await findOrCreateCustomer(env, { name, email, phone, address })
  await env.DB.prepare(
    `INSERT INTO quote_requests (id, name, email, phone, address, service, message, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
  )
    .bind(id, name, email, phone, address || null, service, message || null, nowIso())
    .run()

  const mail = await sendEmail(env, {
    to: 'info@greeninstallatienoord.nl',
    templateId: 'tpl-quote-admin',
    subject: `Nieuwe offerteaanvraag – ${name}`,
    text: [
      'Er is een offerteaanvraag binnengekomen.',
      `Naam: ${name}`,
      `E-mail: ${email}`,
      `Telefoon: ${phone}`,
      `Dienst: ${service}`,
      address ? `Adres: ${address}` : '',
      message ? `Toelichting: ${message}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  return { id, status: 'new', emails: { admin: mail.status } }
}

export async function createAppointment(env: WorkerEnv, body: Record<string, unknown>) {
  v.rejectHoneypot(body.website)
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

  await assertSlotFree(env, date, time)

  const appointmentId = crypto.randomUUID()
  const customerId = await findOrCreateCustomer(env, { name, email, phone, address })

  try {
    await env.DB.prepare(
      `INSERT INTO appointments (id, customer_id, service, appointment_date, appointment_time, status, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
    )
      .bind(appointmentId, customerId, service, date, time, notes || null, now, now)
      .run()
  } catch {
    throw new HttpError(409, 'Dit tijdstip is helaas net bezet. Kies een ander tijdstip.')
  }

  const adminPath = env.ADMIN_BASE_PATH.replace(/\/$/, '')
  const adminMail = await sendEmail(env, {
    to: 'info@greeninstallatienoord.nl',
    templateId: 'tpl-appointment-admin',
    subject: `Nieuwe afspraakaanvraag – ${name} – ${date}`,
    text: [
      'Er is een afspraakaanvraag binnengekomen. Dit is nog geen bevestigde afspraak.',
      `Klant: ${name}`,
      `Dienst: ${serviceName}`,
      `Datum: ${date}`,
      `Tijd: ${time}`,
      `Telefoon: ${phone}`,
      `E-mail: ${email}`,
      `Adres: ${address}`,
      notes ? `Bericht: ${notes}` : '',
      `Beheer: ${env.PUBLIC_SITE_URL}${adminPath}/appointments/${appointmentId}`,
    ]
      .filter(Boolean)
      .join('\n'),
  })

  const customerMail = await sendEmail(env, {
    to: email,
    templateId: 'tpl-appointment-customer',
    subject: 'Uw afspraakaanvraag bij Green Installatie Noord',
    html: customerAppointmentHtml({
      firstName,
      serviceName,
      date,
      time,
    }),
    text: [
      `Beste ${firstName},`,
      '',
      'Uw afspraakaanvraag is ontvangen. Dit is nog geen definitieve afspraak.',
      `Dienst: ${serviceName}`,
      `Gewenste datum: ${date}`,
      `Gewenste tijd: ${time}`,
      '',
      'We nemen uw aanvraag zo snel mogelijk in behandeling.',
      '',
      'Green Installatie Noord',
      'Burgemeester van Weringstraat 23, 9665 GN Oude Pekela',
      '06 28 73 91 34',
      'info@greeninstallatienoord.nl',
    ].join('\n'),
  })

  const emails = { admin: adminMail.status, customer: customerMail.status }
  const emailFailed = adminMail.status === 'failed' || customerMail.status === 'failed'
  const emailSkipped = adminMail.status === 'skipped' || customerMail.status === 'skipped'
  return {
    id: appointmentId,
    status: 'pending',
    emails,
    emailWarning: emailFailed
      ? 'De aanvraag is opgeslagen, maar de e-mail kon niet worden verstuurd.'
      : emailSkipped
        ? 'De aanvraag is opgeslagen. E-mail is nog niet geconfigureerd, dus er is geen bevestiging verstuurd.'
        : undefined,
  }
}

function customerAppointmentHtml(input: {
  firstName: string
  serviceName: string
  date: string
  time: string
}): string {
  const escape = (value: string) =>
    value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  return `<!doctype html>
<html lang="nl">
  <body style="margin:0;background:#f3f5f2;font-family:Arial,sans-serif;color:#121417;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f5f2;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border:1px solid #d7ddd6;padding:24px;">
            <tr>
              <td>
                <p style="margin:0 0 16px;font-size:18px;font-weight:700;">Green Installatie Noord</p>
                <p style="margin:0 0 12px;">Beste ${escape(input.firstName)},</p>
                <p style="margin:0 0 12px;">Uw afspraakaanvraag is ontvangen. Dit is nog geen definitieve afspraak.</p>
                <p style="margin:0 0 8px;"><strong>Dienst:</strong> ${escape(input.serviceName)}</p>
                <p style="margin:0 0 8px;"><strong>Gewenste datum:</strong> ${escape(input.date)}</p>
                <p style="margin:0 0 16px;"><strong>Gewenste tijd:</strong> ${escape(input.time)}</p>
                <p style="margin:0 0 16px;">We nemen uw aanvraag zo snel mogelijk in behandeling.</p>
                <p style="margin:0;font-size:14px;line-height:1.5;">
                  Green Installatie Noord<br>
                  Burgemeester van Weringstraat 23, 9665 GN Oude Pekela<br>
                  06 28 73 91 34<br>
                  info@greeninstallatienoord.nl
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

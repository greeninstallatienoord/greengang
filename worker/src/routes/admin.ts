import {
  clearSessionCookie,
  hashPassword,
  randomHex,
  readSignedSessionToken,
  requireAdmin,
  sessionCookie,
  sessionExpiry,
} from '../auth'
import { findOrCreateCustomer } from '../customers'
import { sendEmail, textToHtml } from '../email'
import type { WorkerEnv } from '../env'
import { HttpError } from '../http'
import { applyTemplate, DEFAULT_TEMPLATES, varsFromCustomer, type TemplateVars } from '../templates'
import {
  dateOnly,
  email as parseEmail,
  phone,
  service,
  text,
  timeOnly,
} from '../validation'
import { assertSlotFree } from '../slots'

const APPOINTMENT_STATUSES = ['pending', 'requested', 'confirmed', 'cancelled', 'completed'] as const
const QUOTE_STATUSES = ['new', 'contacted', 'in_progress', 'completed', 'archived'] as const
const CONTACT_STATUSES = ['new', 'read', 'contacted', 'archived'] as const
const SETTINGS_KEYS = [
  'slot_horizon_days',
  'from_email',
  'working_days',
  'slot_times',
  'slot_duration_minutes',
  'buffer_minutes',
  'blocked_dates',
] as const

function nowIso(): string {
  return new Date().toISOString()
}

function asStatus<T extends string>(value: unknown, allowed: readonly T[], label: string): T {
  const next = text(value, label, 40)
  if (!allowed.includes(next as T)) throw new HttpError(400, 'Ongeldige status.')
  return next as T
}

export async function login(env: WorkerEnv, body: Record<string, unknown>) {
  if (!env.ADMIN_SESSION_SECRET) {
    throw new HttpError(503, 'Beheer is nog niet geconfigureerd.')
  }
  const email = parseEmail(body.email)
  const password = text(body.password, 'Wachtwoord', 200)
  const admin = await env.DB.prepare(
    'SELECT id, password_hash, password_salt FROM admins WHERE email = ?',
  )
    .bind(email)
    .first<{ id: string; password_hash: string; password_salt: string }>()

  if (!admin) throw new HttpError(401, 'Onjuiste inloggegevens.')
  const hashed = await hashPassword(password, admin.password_salt)
  if (hashed !== admin.password_hash) throw new HttpError(401, 'Onjuiste inloggegevens.')

  const token = randomHex(32)
  await env.DB.prepare(
    'INSERT INTO sessions (id, admin_id, expires_at, created_at) VALUES (?, ?, ?, ?)',
  )
    .bind(token, admin.id, sessionExpiry(), nowIso())
    .run()

  return {
    data: { ok: true },
    cookie: await sessionCookie(token, env, 12 * 60 * 60),
  }
}

export async function logout(env: WorkerEnv, request: Request) {
  const token = await readSignedSessionToken(env, request)
  if (token) {
    await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(token).run()
  }
  return { cookie: await clearSessionCookie(env) }
}

export async function session(env: WorkerEnv, request: Request) {
  const admin = await requireAdmin(env, request)
  return { email: admin.email }
}

export async function dashboard(env: WorkerEnv) {
  const today = new Date().toISOString().slice(0, 10)
  const [todayCount, upcoming, quotes, contacts, todayItems, upcomingItems, recent] =
    await Promise.all([
      env.DB.prepare(
        `SELECT COUNT(*) AS n FROM appointments
         WHERE appointment_date = ? AND status NOT IN ('cancelled')`,
      )
        .bind(today)
        .first<{ n: number }>(),
      env.DB.prepare(
        `SELECT COUNT(*) AS n FROM appointments
         WHERE appointment_date >= ? AND status IN ('pending', 'requested', 'confirmed')`,
      )
        .bind(today)
        .first<{ n: number }>(),
      env.DB.prepare(`SELECT COUNT(*) AS n FROM quote_requests WHERE status = 'new'`).first<{
        n: number
      }>(),
      env.DB.prepare(
        `SELECT COUNT(*) AS n FROM contact_submissions WHERE status = 'new'`,
      ).first<{ n: number }>(),
      env.DB.prepare(
        `SELECT appointments.id, appointments.appointment_time, appointments.service,
                appointments.status, customers.name
         FROM appointments
         JOIN customers ON customers.id = appointments.customer_id
         WHERE appointment_date = ? AND status NOT IN ('cancelled')
         ORDER BY appointment_time`,
      )
        .bind(today)
        .all(),
      env.DB.prepare(
        `SELECT appointments.id, appointments.appointment_date, appointments.appointment_time,
                appointments.service, appointments.status, customers.name
         FROM appointments
         JOIN customers ON customers.id = appointments.customer_id
         WHERE appointment_date >= ? AND status IN ('pending', 'requested', 'confirmed')
         ORDER BY appointment_date, appointment_time
         LIMIT 8`,
      )
        .bind(today)
        .all(),
      env.DB.prepare(
        `SELECT id, name, created_at, kind FROM (
           SELECT appointments.id AS id, customers.name AS name, appointments.created_at AS created_at, 'appointment' AS kind
           FROM appointments JOIN customers ON customers.id = appointments.customer_id
           UNION ALL
           SELECT id, name, created_at, 'quote' FROM quote_requests
           UNION ALL
           SELECT id, name, created_at, 'contact' FROM contact_submissions
         )
         ORDER BY created_at DESC
         LIMIT 8`,
      ).all(),
    ])

  return {
    appointmentsToday: todayCount?.n ?? 0,
    upcomingAppointments: upcoming?.n ?? 0,
    newQuotes: quotes?.n ?? 0,
    unreadContacts: contacts?.n ?? 0,
    todayItems: todayItems.results ?? [],
    upcomingItems: upcomingItems.results ?? [],
    recent: recent.results ?? [],
  }
}

export async function listAppointments(env: WorkerEnv) {
  const rows = await env.DB.prepare(
    `SELECT appointments.id, appointments.service, appointments.appointment_date,
            appointments.appointment_time, appointments.status, appointments.notes,
            appointments.created_at, customers.name, customers.email, customers.phone
     FROM appointments
     JOIN customers ON customers.id = appointments.customer_id
     ORDER BY appointment_date DESC, appointment_time DESC
     LIMIT 100`,
  ).all()
  return { items: rows.results ?? [] }
}

export async function getAppointment(env: WorkerEnv, id: string) {
  const row = await env.DB.prepare(
    `SELECT appointments.id, appointments.customer_id, appointments.service,
            appointments.appointment_date, appointments.appointment_time, appointments.status,
            appointments.notes, appointments.created_at, appointments.updated_at,
            customers.name, customers.email, customers.phone, customers.address
     FROM appointments
     JOIN customers ON customers.id = appointments.customer_id
     WHERE appointments.id = ?`,
  )
    .bind(id)
    .first()
  if (!row) throw new HttpError(404, 'Afspraak niet gevonden.')
  return row
}

export async function createAppointment(env: WorkerEnv, body: Record<string, unknown>) {
  const name = text(body.name, 'Naam', 120)
  const email = parseEmail(body.email)
  const tel = phone(body.phone)
  const address = text(body.address, 'Adres', 200, false)
  const notes = text(body.notes, 'Toelichting', 4000, false)
  const svc = service(body.service)
  const date = dateOnly(body.appointment_date)
  const time = timeOnly(body.appointment_time)
  await assertSlotFree(env, date, time)
  const customerId = await findOrCreateCustomer(env, { name, email, phone: tel, address })
  const id = crypto.randomUUID()
  const now = nowIso()
  try {
    await env.DB.prepare(
      `INSERT INTO appointments (id, customer_id, service, appointment_date, appointment_time, status, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
    )
      .bind(id, customerId, svc, date, time, notes || null, now, now)
      .run()
  } catch {
    throw new HttpError(409, 'Dit tijdstip is helaas net bezet. Kies een ander tijdstip.')
  }
  return { id, status: 'pending' }
}

export async function updateAppointment(
  env: WorkerEnv,
  id: string,
  body: Record<string, unknown>,
) {
  const status = asStatus(body.status, APPOINTMENT_STATUSES, 'Status')
  const current = await getAppointment(env, id)
  const now = nowIso()
  await env.DB.prepare('UPDATE appointments SET status = ?, updated_at = ? WHERE id = ?')
    .bind(status, now, id)
    .run()

  const vars = varsFromCustomer({
    name: String(current.name),
    email: String(current.email),
    date: String(current.appointment_date),
    time: String(current.appointment_time),
    service: String(current.service),
  })

  let emailStatus: string | undefined
  if (status === 'confirmed' && current.status !== 'confirmed') {
    emailStatus = (await sendTemplate(env, 'tpl-appointment-confirmed', String(current.email), vars))
      .status
  }
  if (status === 'cancelled' && current.status !== 'cancelled') {
    emailStatus = (await sendTemplate(env, 'tpl-appointment-cancelled', String(current.email), vars))
      .status
  }

  return { ok: true, status, emailStatus }
}

export async function listCustomers(env: WorkerEnv) {
  const rows = await env.DB.prepare(
    'SELECT id, name, email, phone, address, created_at FROM customers ORDER BY updated_at DESC LIMIT 100',
  ).all()
  return { items: rows.results ?? [] }
}

export async function getCustomer(env: WorkerEnv, id: string) {
  const customer = await env.DB.prepare(
    'SELECT id, name, email, phone, address, created_at, updated_at FROM customers WHERE id = ?',
  )
    .bind(id)
    .first<{
      id: string
      name: string
      email: string
      phone: string | null
      address: string | null
      created_at: string
      updated_at: string
    }>()
  if (!customer) throw new HttpError(404, 'Klant niet gevonden.')

  const [appointments, quotes] = await Promise.all([
    env.DB.prepare(
      `SELECT id, service, appointment_date, appointment_time, status, created_at
       FROM appointments WHERE customer_id = ? ORDER BY appointment_date DESC`,
    )
      .bind(id)
      .all(),
    env.DB.prepare(
      `SELECT id, service, status, created_at FROM quote_requests
       WHERE lower(email) = lower(?) ORDER BY created_at DESC`,
    )
      .bind(customer.email)
      .all(),
  ])

  return {
    ...customer,
    appointments: appointments.results ?? [],
    quotes: quotes.results ?? [],
  }
}

export async function listQuotes(env: WorkerEnv) {
  const rows = await env.DB.prepare(
    'SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT 100',
  ).all()
  return { items: rows.results ?? [] }
}

export async function getQuote(env: WorkerEnv, id: string) {
  const row = await env.DB.prepare('SELECT * FROM quote_requests WHERE id = ?').bind(id).first()
  if (!row) throw new HttpError(404, 'Offerteaanvraag niet gevonden.')
  return row
}

export async function updateQuote(env: WorkerEnv, id: string, body: Record<string, unknown>) {
  const status = asStatus(body.status, QUOTE_STATUSES, 'Status')
  await getQuote(env, id)
  await env.DB.prepare('UPDATE quote_requests SET status = ? WHERE id = ?').bind(status, id).run()
  return { ok: true, status }
}

export async function listContacts(env: WorkerEnv) {
  const rows = await env.DB.prepare(
    'SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 100',
  ).all()
  return { items: rows.results ?? [] }
}

export async function getContact(env: WorkerEnv, id: string) {
  const row = await env.DB.prepare('SELECT * FROM contact_submissions WHERE id = ?')
    .bind(id)
    .first()
  if (!row) throw new HttpError(404, 'Bericht niet gevonden.')
  return row
}

export async function updateContact(env: WorkerEnv, id: string, body: Record<string, unknown>) {
  const status = asStatus(body.status, CONTACT_STATUSES, 'Status')
  await getContact(env, id)
  await env.DB.prepare('UPDATE contact_submissions SET status = ? WHERE id = ?')
    .bind(status, id)
    .run()
  return { ok: true, status }
}

export async function listEmails(env: WorkerEnv) {
  const rows = await env.DB.prepare(
    'SELECT id, recipient, subject, status, created_at FROM email_logs ORDER BY created_at DESC LIMIT 100',
  ).all()
  return { items: rows.results ?? [] }
}

export async function previewEmail(body: Record<string, unknown>) {
  const subject = applyTemplate(text(body.subject, 'Onderwerp', 200), readVars(body.vars))
  const source = text(body.text, 'Inhoud', 8000)
  const rendered = applyTemplate(source, readVars(body.vars))
  return { subject, text: rendered, html: textToHtml(rendered) }
}

export async function sendAdminEmail(env: WorkerEnv, body: Record<string, unknown>) {
  const to = parseEmail(body.to)
  const vars = readVars(body.vars)
  const subject = applyTemplate(text(body.subject, 'Onderwerp', 200), vars)
  const source = text(body.text, 'Inhoud', 8000)
  const rendered = applyTemplate(source, vars)
  const templateId = text(body.templateId, 'Template', 80, false) || undefined
  const result = await sendEmail(env, {
    to,
    subject,
    text: rendered,
    templateId,
  })
  if (result.status === 'failed') {
    throw new HttpError(502, 'Versturen via e-mail is niet gelukt. Probeer het later opnieuw.')
  }
  if (result.status === 'skipped') {
    throw new HttpError(503, 'E-mail is nog niet geconfigureerd op de server.')
  }
  return { ok: true, status: result.status }
}

export async function listTemplates(env: WorkerEnv) {
  const rows = await env.DB.prepare(
    'SELECT id, slug, name, subject, body_text, updated_at FROM email_templates ORDER BY name',
  ).all()
  const items = rows.results ?? []
  return { items: items.length > 0 ? items : DEFAULT_TEMPLATES }
}

export async function getTemplate(env: WorkerEnv, id: string) {
  const row = await env.DB.prepare(
    'SELECT id, slug, name, subject, body_text, updated_at FROM email_templates WHERE id = ? OR slug = ?',
  )
    .bind(id, id)
    .first()
  if (!row) throw new HttpError(404, 'Template niet gevonden.')
  return row
}

export async function updateTemplate(env: WorkerEnv, id: string, body: Record<string, unknown>) {
  await getTemplate(env, id)
  const subject = text(body.subject, 'Onderwerp', 200)
  const bodyText = text(body.body_text, 'Inhoud', 8000)
  await env.DB.prepare(
    'UPDATE email_templates SET subject = ?, body_text = ?, updated_at = ? WHERE id = ? OR slug = ?',
  )
    .bind(subject, bodyText, nowIso(), id, id)
    .run()
  return { ok: true }
}

export async function getSettings(env: WorkerEnv, request: Request) {
  const admin = await requireAdmin(env, request)
  const rows = await env.DB.prepare('SELECT key, value FROM settings').all<{
    key: string
    value: string
  }>()
  const stored = Object.fromEntries((rows.results ?? []).map((item) => [item.key, item.value]))
  return {
    business: {
      name: 'Green Installatie Noord',
      email: 'info@greeninstallatienoord.nl',
      phone: '06 28 73 91 34',
      address: 'Burgemeester van Weringstraat 23, 9665 GN Oude Pekela',
    },
    appointments: {
      slot_horizon_days: stored.slot_horizon_days ?? '28',
      working_days: stored.working_days ?? '1,2,3,4,5',
      slot_times: stored.slot_times ?? '09:00,10:00,11:00,13:00,14:00,15:00,16:00',
      slot_duration_minutes: stored.slot_duration_minutes ?? '60',
      buffer_minutes: stored.buffer_minutes ?? '0',
      blocked_dates: stored.blocked_dates ?? '',
    },
    email: {
      from_email: stored.from_email ?? 'info@greeninstallatienoord.nl',
    },
    admin: {
      email: admin.email,
    },
  }
}

export async function updateSettings(env: WorkerEnv, body: Record<string, unknown>) {
  const entries = body.values
  if (!entries || typeof entries !== 'object') throw new HttpError(400, 'Ongeldige instellingen.')
  const now = nowIso()
  for (const [key, value] of Object.entries(entries as Record<string, unknown>)) {
    if (!SETTINGS_KEYS.includes(key as (typeof SETTINGS_KEYS)[number])) {
      throw new HttpError(400, 'Deze instelling kan niet worden gewijzigd.')
    }
    const optional = key === 'blocked_dates'
    const next = text(value, key, key === 'slot_times' || key === 'blocked_dates' ? 800 : 120, !optional)
    if (key === 'from_email') parseEmail(next)
    if (key === 'slot_horizon_days' && !/^\d{1,3}$/.test(next)) {
      throw new HttpError(400, 'Vul een geldig aantal dagen in.')
    }
    if (key === 'working_days' && !/^[1-7](,[1-7])*$/.test(next.replace(/\s/g, ''))) {
      throw new HttpError(400, 'Werkdagen: 1 tot 7, gescheiden door komma’s.')
    }
    if (
      key === 'slot_times' &&
      !next.split(',').every((item) => /^([01]\d|2[0-3]):[0-5]\d$/.test(item.trim()))
    ) {
      throw new HttpError(400, 'Tijden moeten als 09:00,10:00 worden ingevuld.')
    }
    if (
      (key === 'slot_duration_minutes' || key === 'buffer_minutes') &&
      !/^\d{1,3}$/.test(next)
    ) {
      throw new HttpError(400, 'Vul een geldig aantal minuten in.')
    }
    if (
      key === 'blocked_dates' &&
      next &&
      !next.split(',').every((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.trim()))
    ) {
      throw new HttpError(400, 'Geblokkeerde datums als 2026-12-25,2026-12-26.')
    }
    await env.DB.prepare(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    )
      .bind(key, next, now)
      .run()
  }
  return { ok: true }
}

async function sendTemplate(
  env: WorkerEnv,
  templateId: string,
  to: string,
  vars: TemplateVars,
) {
  const template = await env.DB.prepare(
    'SELECT id, subject, body_text FROM email_templates WHERE id = ?',
  )
    .bind(templateId)
    .first<{ id: string; subject: string; body_text: string }>()
  if (!template) return { status: 'skipped' as const }
  return sendEmail(env, {
    to,
    templateId: template.id,
    subject: applyTemplate(template.subject, vars),
    text: applyTemplate(template.body_text, vars),
  })
}

function readVars(value: unknown): TemplateVars {
  if (!value || typeof value !== 'object') return {}
  const input = value as Record<string, unknown>
  return varsFromCustomer({
    name: typeof input['customer.name'] === 'string' ? input['customer.name'] : String(input.name ?? ''),
    email: typeof input['customer.email'] === 'string' ? input['customer.email'] : String(input.email ?? ''),
    date:
      typeof input['appointment.date'] === 'string'
        ? input['appointment.date']
        : String(input.date ?? ''),
    time:
      typeof input['appointment.time'] === 'string'
        ? input['appointment.time']
        : String(input.time ?? ''),
    service:
      typeof input['appointment.service'] === 'string'
        ? input['appointment.service']
        : String(input.service ?? ''),
  })
}

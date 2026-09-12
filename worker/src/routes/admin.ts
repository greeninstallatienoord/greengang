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
import { inferCta, renderBrandedEmail } from '../emailLayout'
import type { WorkerEnv } from '../env'
import { HttpError } from '../http'
import {
  applyTemplate,
  COMPOSE_TEMPLATE_META,
  DEFAULT_TEMPLATES,
  TEMPLATE_VARIABLES,
  varsFromCustomer,
  type TemplateVars,
} from '../templates'
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
const QUOTE_STATUSES = [
  'new',
  'in_progress',
  'contacted',
  'quoted',
  'completed',
  'cancelled',
  'archived',
] as const
const CONTACT_STATUSES = [
  'new',
  'in_progress',
  'answered',
  'completed',
  'read',
  'contacted',
  'archived',
] as const
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

function statusCounts(rows: Array<{ status: string; n: number }> | undefined) {
  return Object.fromEntries((rows ?? []).map((row) => [row.status, Number(row.n) || 0]))
}

export async function dashboard(env: WorkerEnv) {
  const today = new Date().toISOString().slice(0, 10)
  const [
    todayCount,
    upcoming,
    quotes,
    contacts,
    pending,
    todayItems,
    upcomingItems,
    recent,
    pendingQuotes,
    recentContacts,
    recentEmails,
    appointmentStatuses,
    quoteStatuses,
  ] = await Promise.all([
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
    env.DB.prepare(`SELECT COUNT(*) AS n FROM contact_submissions WHERE status = 'new'`).first<{
      n: number
    }>(),
    env.DB.prepare(
      `SELECT COUNT(*) AS n FROM appointments WHERE status IN ('pending', 'requested')`,
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
    env.DB.prepare(
      `SELECT id, name, service, status, created_at FROM quote_requests
       WHERE status = 'new' ORDER BY created_at DESC LIMIT 6`,
    ).all(),
    env.DB.prepare(
      `SELECT id, name, message, status, created_at FROM contact_submissions
       ORDER BY created_at DESC LIMIT 6`,
    ).all(),
    env.DB.prepare(
      `SELECT email_logs.id, email_logs.recipient, email_logs.subject, email_logs.status,
              email_logs.created_at, email_templates.name AS template_name
       FROM email_logs
       LEFT JOIN email_templates
         ON email_templates.id = email_logs.template_id
         OR email_templates.slug = email_logs.template_id
       ORDER BY email_logs.created_at DESC
       LIMIT 6`,
    ).all(),
    env.DB.prepare(`SELECT status, COUNT(*) AS n FROM appointments GROUP BY status`).all<{
      status: string
      n: number
    }>(),
    env.DB.prepare(`SELECT status, COUNT(*) AS n FROM quote_requests GROUP BY status`).all<{
      status: string
      n: number
    }>(),
  ])

  return {
    appointmentsToday: todayCount?.n ?? 0,
    upcomingAppointments: upcoming?.n ?? 0,
    newQuotes: quotes?.n ?? 0,
    unreadContacts: contacts?.n ?? 0,
    pendingAppointments: pending?.n ?? 0,
    todayItems: todayItems.results ?? [],
    upcomingItems: upcomingItems.results ?? [],
    recent: recent.results ?? [],
    pendingQuoteItems: pendingQuotes.results ?? [],
    recentContacts: recentContacts.results ?? [],
    recentEmails: recentEmails.results ?? [],
    appointmentStatusCounts: statusCounts(appointmentStatuses.results),
    quoteStatusCounts: statusCounts(quoteStatuses.results),
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

type AppointmentRow = {
  id: string
  customer_id: string
  service: string
  appointment_date: string
  appointment_time: string
  status: string
  notes: string | null
  created_at: string
  updated_at: string
  name: string
  email: string
  phone: string | null
  address: string | null
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
    .first<AppointmentRow>()
  if (!row) throw new HttpError(404, 'Afspraak niet gevonden.')
  return {
    ...row,
    emails: await listRelatedEmails(env, 'appointment', id, row.email),
  }
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
    emailStatus = (
      await sendTemplate(env, 'tpl-appointment-confirmed', String(current.email), vars, {
        type: 'appointment',
        id,
      })
    ).status
  }
  if (status === 'cancelled' && current.status !== 'cancelled') {
    emailStatus = (
      await sendTemplate(env, 'tpl-appointment-cancelled', String(current.email), vars, {
        type: 'appointment',
        id,
      })
    ).status
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

  const [appointments, quotes, contacts] = await Promise.all([
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
    env.DB.prepare(
      `SELECT id, message, status, created_at FROM contact_submissions
       WHERE lower(email) = lower(?) ORDER BY created_at DESC`,
    )
      .bind(customer.email)
      .all(),
  ])

  return {
    ...customer,
    appointments: appointments.results ?? [],
    quotes: quotes.results ?? [],
    contacts: contacts.results ?? [],
  }
}

export async function listQuotes(env: WorkerEnv) {
  const rows = await env.DB.prepare(
    'SELECT * FROM quote_requests ORDER BY created_at DESC LIMIT 100',
  ).all()
  return { items: rows.results ?? [] }
}

export async function getQuote(env: WorkerEnv, id: string) {
  const row = await env.DB.prepare('SELECT * FROM quote_requests WHERE id = ?')
    .bind(id)
    .first<{ id: string; email: string; [key: string]: unknown }>()
  if (!row) throw new HttpError(404, 'Offerteaanvraag niet gevonden.')
  return {
    ...row,
    emails: await listRelatedEmails(env, 'quote', id, row.email),
  }
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
    .first<{ id: string; email: string; [key: string]: unknown }>()
  if (!row) throw new HttpError(404, 'Bericht niet gevonden.')
  return {
    ...row,
    emails: await listRelatedEmails(env, 'contact', id, row.email),
  }
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
  try {
    const rows = await env.DB.prepare(
      `SELECT email_logs.id, email_logs.recipient, email_logs.subject, email_logs.status,
              email_logs.created_at, email_logs.template_id, email_logs.provider_message_id,
              email_logs.recipient_name, email_logs.sender,
              email_templates.name AS template_name
       FROM email_logs
       LEFT JOIN email_templates
         ON email_templates.id = email_logs.template_id
         OR email_templates.slug = email_logs.template_id
       ORDER BY email_logs.created_at DESC
       LIMIT 100`,
    ).all()
    return { items: rows.results ?? [] }
  } catch {
    const rows = await env.DB.prepare(
      `SELECT email_logs.id, email_logs.recipient, email_logs.subject, email_logs.status,
              email_logs.created_at, email_logs.template_id,
              email_templates.name AS template_name
       FROM email_logs
       LEFT JOIN email_templates
         ON email_templates.id = email_logs.template_id
         OR email_templates.slug = email_logs.template_id
       ORDER BY email_logs.created_at DESC
       LIMIT 100`,
    ).all()
    return { items: rows.results ?? [] }
  }
}

export async function getEmail(env: WorkerEnv, id: string) {
  const row = await env.DB.prepare(
    `SELECT email_logs.*, email_templates.name AS template_name
     FROM email_logs
     LEFT JOIN email_templates
       ON email_templates.id = email_logs.template_id
       OR email_templates.slug = email_logs.template_id
     WHERE email_logs.id = ?`,
  )
    .bind(id)
    .first()
  if (!row) throw new HttpError(404, 'E-mail niet gevonden.')
  const record = row as Record<string, string | null>
  if (!record.body_html && record.body_text) {
    record.body_html = textToHtml(env, record.body_text, record.template_id ?? undefined)
  }
  return record
}

export async function listRecipients(env: WorkerEnv, query: string) {
  const needle = `%${query.trim()}%`
  const [customers, contacts, quotes] = await Promise.all([
    env.DB.prepare(
      `SELECT customers.id, customers.name, customers.email, customers.phone,
              (
                SELECT appointments.service FROM appointments
                WHERE appointments.customer_id = customers.id
                ORDER BY appointments.appointment_date DESC, appointments.appointment_time DESC
                LIMIT 1
              ) AS service,
              (
                SELECT appointments.appointment_date FROM appointments
                WHERE appointments.customer_id = customers.id
                ORDER BY appointments.appointment_date DESC, appointments.appointment_time DESC
                LIMIT 1
              ) AS appointment_date,
              (
                SELECT appointments.appointment_time FROM appointments
                WHERE appointments.customer_id = customers.id
                ORDER BY appointments.appointment_date DESC, appointments.appointment_time DESC
                LIMIT 1
              ) AS appointment_time
       FROM customers
       WHERE customers.name LIKE ? OR customers.email LIKE ? OR ifnull(customers.phone, '') LIKE ?
       ORDER BY customers.updated_at DESC
       LIMIT 12`,
    )
      .bind(needle, needle, needle)
      .all(),
    env.DB.prepare(
      `SELECT id, name, email, phone FROM contact_submissions
       WHERE name LIKE ? OR email LIKE ? OR ifnull(phone, '') LIKE ?
       ORDER BY created_at DESC LIMIT 8`,
    )
      .bind(needle, needle, needle)
      .all(),
    env.DB.prepare(
      `SELECT id, name, email, phone, service FROM quote_requests
       WHERE name LIKE ? OR email LIKE ? OR ifnull(phone, '') LIKE ?
       ORDER BY created_at DESC LIMIT 8`,
    )
      .bind(needle, needle, needle)
      .all(),
  ])

  const seen = new Set<string>()
  const items: Array<Record<string, string>> = []
  function push(
    source: string,
    sourceLabel: string,
    row: Record<string, unknown>,
    extra: Record<string, string> = {},
  ) {
    const email = String(row.email ?? '').toLowerCase()
    if (!email || seen.has(email)) return
    seen.add(email)
    items.push({
      name: String(row.name ?? ''),
      email: String(row.email ?? ''),
      phone: String(row.phone ?? ''),
      source,
      sourceLabel,
      service: String(row.service ?? extra.service ?? ''),
      appointment_date: String(row.appointment_date ?? ''),
      appointment_time: String(row.appointment_time ?? ''),
      quote_reference: extra.quote_reference ?? '',
    })
  }

  for (const row of customers.results ?? []) {
    push('customer', 'Klant', row as Record<string, unknown>)
  }
  for (const row of quotes.results ?? []) {
    const record = row as Record<string, unknown>
    push('quote', 'Offerte', record, {
      quote_reference: String(record.id ?? '').slice(0, 8),
      service: String(record.service ?? ''),
    })
  }
  for (const row of contacts.results ?? []) {
    push('contact', 'Contact', row as Record<string, unknown>)
  }
  return { items }
}

export async function previewEmail(env: WorkerEnv, body: Record<string, unknown>) {
  const vars = readVars(body.vars)
  const subject = applyTemplate(text(body.subject, 'Onderwerp', 200), vars, env)
  const source = text(body.text, 'Inhoud', 8000)
  const rendered = applyTemplate(source, vars, env)
  const templateId = text(body.templateId, 'Template', 80, false) || undefined
  const cta = inferCta(env, templateId)
  return {
    subject,
    text: rendered,
    html: renderBrandedEmail(env, { title: subject, text: rendered, ...cta }),
  }
}

export async function sendAdminEmail(env: WorkerEnv, body: Record<string, unknown>) {
  const to = parseEmail(body.to)
  const vars = readVars(body.vars)
  const subject = applyTemplate(text(body.subject, 'Onderwerp', 200), vars, env)
  const source = text(body.text, 'Inhoud', 8000)
  const rendered = applyTemplate(source, vars, env)
  const templateId = text(body.templateId, 'Template', 80, false) || undefined
  const recipientName = text(body.recipientName, 'Naam', 120, false)
  const cta = inferCta(env, templateId)
  const html = renderBrandedEmail(env, { title: subject, text: rendered, ...cta })
  const result = await sendEmail(env, {
    to,
    subject,
    text: rendered,
    html,
    templateId,
    recipientName: recipientName || undefined,
  })
  if (result.status === 'failed') {
    throw new HttpError(502, 'Versturen via e-mail is niet gelukt. Probeer het later opnieuw.')
  }
  if (result.status === 'skipped') {
    throw new HttpError(503, 'E-mail is nog niet geconfigureerd op de server.')
  }
  return { ok: true, status: result.status, id: result.id }
}

export async function listTemplates(env: WorkerEnv) {
  let items: Array<Record<string, unknown>> = []
  try {
    const rows = await env.DB.prepare(
      `SELECT id, slug, name, subject, body_text, updated_at, purpose, description, compose
       FROM email_templates ORDER BY compose DESC, name`,
    ).all()
    items = (rows.results ?? []) as Array<Record<string, unknown>>
  } catch {
    const rows = await env.DB.prepare(
      'SELECT id, slug, name, subject, body_text, updated_at FROM email_templates ORDER BY name',
    ).all()
    items = (rows.results ?? []) as Array<Record<string, unknown>>
  }
  if (items.length === 0) items = DEFAULT_TEMPLATES
  const enriched = items.map((item) => {
    const meta = COMPOSE_TEMPLATE_META.find((entry) => entry.id === item.id || entry.slug === item.slug)
    return {
      ...item,
      purpose: item.purpose || meta?.purpose || '',
      description: item.description || meta?.description || '',
      compose: Number(item.compose ?? (meta?.compose ? 1 : 0)),
    }
  })
  return { items: enriched, variables: TEMPLATE_VARIABLES }
}

export async function getTemplate(env: WorkerEnv, id: string) {
  const row = await env.DB.prepare(
    'SELECT * FROM email_templates WHERE id = ? OR slug = ?',
  )
    .bind(id, id)
    .first()
  if (!row) throw new HttpError(404, 'Template niet gevonden.')
  const meta = COMPOSE_TEMPLATE_META.find((entry) => entry.id === id || entry.slug === id || entry.id === (row as { id: string }).id)
  return {
    ...row,
    purpose: (row as { purpose?: string }).purpose || meta?.purpose || '',
    description: (row as { description?: string }).description || meta?.description || '',
    variables: TEMPLATE_VARIABLES,
  }
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
      configured: Boolean(env.RESEND_API_KEY),
    },
    admin: {
      email: admin.email,
    },
    system: {
      environment: env.ENVIRONMENT,
      siteUrl: env.PUBLIC_SITE_URL,
      adminPath: env.ADMIN_BASE_PATH,
      sessionConfigured: Boolean(env.ADMIN_SESSION_SECRET),
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

async function listRelatedEmails(
  env: WorkerEnv,
  type: 'quote' | 'contact' | 'appointment',
  id: string,
  recipient?: string,
) {
  try {
    const rows = await env.DB.prepare(
      `SELECT id, recipient, subject, template_id, status, created_at, provider_message_id
       FROM email_logs
       WHERE related_type = ? AND related_id = ?
       ORDER BY created_at DESC
       LIMIT 20`,
    )
      .bind(type, id)
      .all()
    if ((rows.results ?? []).length > 0) return rows.results ?? []
  } catch {
    /* related columns may not exist yet */
  }

  if (!recipient) return []
  try {
    const rows = await env.DB.prepare(
      `SELECT id, recipient, subject, template_id, status, created_at, provider_message_id
       FROM email_logs
       WHERE lower(recipient) = lower(?)
       ORDER BY created_at DESC
       LIMIT 12`,
    )
      .bind(recipient)
      .all()
    return rows.results ?? []
  } catch {
    return []
  }
}

async function sendTemplate(
  env: WorkerEnv,
  templateId: string,
  to: string,
  vars: TemplateVars,
  related?: { type: 'quote' | 'contact' | 'appointment'; id: string },
) {
  const template = await env.DB.prepare(
    'SELECT id, subject, body_text FROM email_templates WHERE id = ?',
  )
    .bind(templateId)
    .first<{ id: string; subject: string; body_text: string }>()
  if (!template) {
    const fallback = DEFAULT_TEMPLATES.find((item) => item.id === templateId)
    if (!fallback) return { status: 'skipped' as const }
    return sendEmail(env, {
      to,
      templateId: fallback.id,
      subject: applyTemplate(fallback.subject, vars, env),
      text: applyTemplate(fallback.body_text, vars, env),
      relatedType: related?.type,
      relatedId: related?.id,
    })
  }
  return sendEmail(env, {
    to,
    templateId: template.id,
    subject: applyTemplate(template.subject, vars, env),
    text: applyTemplate(template.body_text, vars, env),
    relatedType: related?.type,
    relatedId: related?.id,
  })
}

function readString(input: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = input[key]
    if (typeof value === 'string' && value.trim()) return value
  }
  return ''
}

function readVars(value: unknown): TemplateVars {
  if (!value || typeof value !== 'object') return {}
  const input = value as Record<string, unknown>
  return varsFromCustomer({
    name: readString(input, 'customer.name', 'customer_name', 'name'),
    email: readString(input, 'customer.email', 'customer_email', 'email'),
    date: readString(input, 'appointment.date', 'appointment_date', 'date'),
    time: readString(input, 'appointment.time', 'appointment_time', 'time'),
    service: readString(input, 'appointment.service', 'service'),
    quoteReference: readString(input, 'quote.reference', 'quote_reference'),
  })
}

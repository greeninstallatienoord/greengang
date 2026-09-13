import {
  clearSessionCookie,
  hashPassword,
  LOGIN_DUMMY_SALT,
  randomHex,
  readSignedSessionToken,
  requireAdmin,
  sessionCookie,
  sessionExpiry,
  timingSafeEqualHex,
} from '../auth'
import { buildCustomerTimeline, recordActivity } from '../activity'
import { findOrCreateCustomer } from '../customers'
import { sendEmail, textToHtml } from '../email'
import { inferCta, renderBrandedEmail } from '../emailLayout'
import type { WorkerEnv } from '../env'
import { HttpError } from '../http'
import {
  assertLoginAllowed,
  clearLoginFailures,
  recordSecurityEvent,
  registerLoginFailure,
} from '../security'
import {
  applyTemplate,
  assembleBodyText,
  COMPOSE_TEMPLATE_META,
  DEFAULT_TEMPLATES,
  SAMPLE_PREVIEW_VARS,
  sanitizeTemplateText,
  TEMPLATE_VARIABLES,
  varsFromCustomer,
  type TemplateVars,
} from '../templates'
import {
  dateOnly,
  email as parseEmail,
  emailHeader,
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

export async function login(env: WorkerEnv, request: Request, body: Record<string, unknown>) {
  if (!env.ADMIN_SESSION_SECRET) {
    throw new HttpError(503, 'Beheer is nog niet geconfigureerd.')
  }

  await assertLoginAllowed(env, request)

  const email = parseEmail(body.email)
  const password = text(body.password, 'Wachtwoord', 200)

  const admin = await env.DB.prepare(
    'SELECT id, password_hash, password_salt FROM admins WHERE email = ?',
  )
    .bind(email)
    .first<{ id: string; password_hash: string; password_salt: string }>()

  // Always run PBKDF2 so missing users do not respond faster than wrong passwords.
  const hashed = await hashPassword(password, admin?.password_salt ?? LOGIN_DUMMY_SALT)
  const expected = admin?.password_hash ?? '0'.repeat(64)
  const passwordOk = Boolean(admin) && timingSafeEqualHex(hashed, expected)

  if (!passwordOk || !admin) {
    await registerLoginFailure(env, request)
    await recordSecurityEvent(env, 'admin.login_failed', request, 'invalid_credentials')
    throw new HttpError(401, 'Onjuiste inloggegevens.')
  }

  await clearLoginFailures(env, request)

  // Fresh session only — revoke any previous sessions for this admin.
  await env.DB.prepare('DELETE FROM sessions WHERE admin_id = ?').bind(admin.id).run()

  const token = randomHex(32)
  const created = nowIso()
  await env.DB.prepare(
    `INSERT INTO sessions (id, admin_id, expires_at, created_at, last_seen_at)
     VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(token, admin.id, sessionExpiry(), created, created)
    .run()

  await recordSecurityEvent(env, 'admin.login_success', request, undefined, admin.id)

  return {
    data: { ok: true },
    cookie: await sessionCookie(token, env, 12 * 60 * 60),
  }
}

export async function logout(env: WorkerEnv, request: Request) {
  const token = await readSignedSessionToken(env, request)
  let adminId: string | undefined
  if (token) {
    const row = await env.DB.prepare('SELECT admin_id AS adminId FROM sessions WHERE id = ?')
      .bind(token)
      .first<{ adminId: string }>()
    adminId = row?.adminId
    await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(token).run()
  }
  await recordSecurityEvent(env, 'admin.logout', request, undefined, adminId)
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

export async function listAppointments(env: WorkerEnv, request?: Request) {
  const url = request ? new URL(request.url) : null
  const from = url?.searchParams.get('from')
  const to = url?.searchParams.get('to')

  if (from && to) {
    const fromDate = dateOnly(from)
    const toDate = dateOnly(to)
    const rows = await env.DB.prepare(
      `SELECT appointments.id, appointments.customer_id, appointments.service,
              appointments.appointment_date, appointments.appointment_time, appointments.status,
              appointments.notes, appointments.created_at,
              customers.name, customers.email, customers.phone
       FROM appointments
       JOIN customers ON customers.id = appointments.customer_id
       WHERE appointments.appointment_date >= ?
         AND appointments.appointment_date <= ?
         AND appointments.status NOT IN ('cancelled')
       ORDER BY appointments.appointment_date ASC, appointments.appointment_time ASC
       LIMIT 400`,
    )
      .bind(fromDate, toDate)
      .all()
    return { items: rows.results ?? [], from: fromDate, to: toDate }
  }

  const rows = await env.DB.prepare(
    `SELECT appointments.id, appointments.customer_id, appointments.service,
            appointments.appointment_date, appointments.appointment_time, appointments.status,
            appointments.notes, appointments.created_at,
            customers.name, customers.email, customers.phone
     FROM appointments
     JOIN customers ON customers.id = appointments.customer_id
     ORDER BY appointment_date DESC, appointment_time DESC
     LIMIT 200`,
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
  internal_notes: string | null
  created_at: string
  updated_at: string
  name: string
  email: string
  phone: string | null
  address: string | null
}

export async function getAppointment(env: WorkerEnv, id: string) {
  let row =
    (await env.DB.prepare(
      `SELECT appointments.id, appointments.customer_id, appointments.service,
              appointments.appointment_date, appointments.appointment_time, appointments.status,
              appointments.notes, appointments.internal_notes,
              appointments.created_at, appointments.updated_at,
              customers.name, customers.email, customers.phone, customers.address
       FROM appointments
       JOIN customers ON customers.id = appointments.customer_id
       WHERE appointments.id = ?`,
    )
      .bind(id)
      .first<AppointmentRow>()
      .catch(() => null)) ??
    (await env.DB.prepare(
      `SELECT appointments.id, appointments.customer_id, appointments.service,
              appointments.appointment_date, appointments.appointment_time, appointments.status,
              appointments.notes, NULL AS internal_notes,
              appointments.created_at, appointments.updated_at,
              customers.name, customers.email, customers.phone, customers.address
       FROM appointments
       JOIN customers ON customers.id = appointments.customer_id
       WHERE appointments.id = ?`,
    )
      .bind(id)
      .first<AppointmentRow>())

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
  const internalNotes = text(body.internal_notes, 'Interne notitie', 4000, false)
  const svc = service(body.service)
  const date = dateOnly(body.appointment_date)
  const time = timeOnly(body.appointment_time)
  await assertSlotFree(env, date, time)
  const customerId = await findOrCreateCustomer(env, { name, email, phone: tel, address })
  const id = crypto.randomUUID()
  const now = nowIso()
  try {
    await env.DB.prepare(
      `INSERT INTO appointments
         (id, customer_id, service, appointment_date, appointment_time, status, notes, internal_notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`,
    )
      .bind(id, customerId, svc, date, time, notes || null, internalNotes || null, now, now)
      .run()
  } catch {
    throw new HttpError(409, 'Dit tijdstip is helaas net bezet. Kies een ander tijdstip.')
  }

  await recordActivity(env, {
    customerId,
    entityType: 'appointment',
    entityId: id,
    eventType: 'appointment_created',
    title: 'Afspraak aangemaakt',
    detail: `${date} ${time} · ${svc}`,
  })

  return { id, status: 'pending', customer_id: customerId }
}

export async function updateAppointment(
  env: WorkerEnv,
  id: string,
  body: Record<string, unknown>,
) {
  const current = await getAppointment(env, id)
  const now = nowIso()

  const nextStatus =
    body.status !== undefined
      ? asStatus(body.status, APPOINTMENT_STATUSES, 'Status')
      : current.status
  const nextDate =
    body.appointment_date !== undefined
      ? dateOnly(body.appointment_date)
      : current.appointment_date
  const nextTime =
    body.appointment_time !== undefined
      ? timeOnly(body.appointment_time)
      : current.appointment_time
  const nextInternal =
    body.internal_notes !== undefined
      ? text(body.internal_notes, 'Interne notitie', 4000, false) || null
      : current.internal_notes

  const scheduleChanged =
    nextDate !== current.appointment_date || nextTime !== current.appointment_time
  if (scheduleChanged) {
    await assertSlotFree(env, nextDate, nextTime, id)
  }

  await env.DB.prepare(
    `UPDATE appointments
     SET status = ?, appointment_date = ?, appointment_time = ?, internal_notes = ?, updated_at = ?
     WHERE id = ?`,
  )
    .bind(nextStatus, nextDate, nextTime, nextInternal, now, id)
    .run()

  const vars = varsFromCustomer({
    name: String(current.name),
    email: String(current.email),
    date: String(nextDate),
    time: String(nextTime),
    service: String(current.service),
  })

  let emailStatus: string | undefined
  if (nextStatus === 'confirmed' && current.status !== 'confirmed') {
    emailStatus = (
      await sendTemplate(env, 'tpl-appointment-confirmed', String(current.email), vars, {
        type: 'appointment',
        id,
      })
    ).status
    await recordActivity(env, {
      customerId: current.customer_id,
      entityType: 'appointment',
      entityId: id,
      eventType: 'appointment_confirmed',
      title: 'Afspraak bevestigd',
      detail: `${nextDate} ${nextTime}`,
    })
  } else if (nextStatus === 'cancelled' && current.status !== 'cancelled') {
    emailStatus = (
      await sendTemplate(env, 'tpl-appointment-cancelled', String(current.email), vars, {
        type: 'appointment',
        id,
      })
    ).status
    await recordActivity(env, {
      customerId: current.customer_id,
      entityType: 'appointment',
      entityId: id,
      eventType: 'appointment_cancelled',
      title: 'Afspraak geannuleerd',
      detail: `${nextDate} ${nextTime}`,
    })
  } else if (nextStatus === 'completed' && current.status !== 'completed') {
    await recordActivity(env, {
      customerId: current.customer_id,
      entityType: 'appointment',
      entityId: id,
      eventType: 'appointment_completed',
      title: 'Afspraak afgerond',
      detail: `${nextDate} ${nextTime}`,
    })
  } else if (scheduleChanged) {
    await recordActivity(env, {
      customerId: current.customer_id,
      entityType: 'appointment',
      entityId: id,
      eventType: 'appointment_rescheduled',
      title: 'Afspraak verplaatst',
      detail: `${nextDate} ${nextTime}`,
    })
  } else if (nextStatus !== current.status) {
    await recordActivity(env, {
      customerId: current.customer_id,
      entityType: 'appointment',
      entityId: id,
      eventType: 'status_changed',
      title: 'Afspraakstatus gewijzigd',
      detail: `${current.status} → ${nextStatus}`,
    })
  }

  return { ok: true, status: nextStatus, emailStatus }
}

export async function listCustomers(env: WorkerEnv) {
  const rows = await env.DB.prepare(
    'SELECT id, name, email, phone, address, created_at, updated_at FROM customers ORDER BY updated_at DESC LIMIT 100',
  ).all()
  return { items: rows.results ?? [] }
}

export async function getCustomer(env: WorkerEnv, id: string) {
  const customer =
    (await env.DB.prepare(
      `SELECT id, name, email, phone, address, internal_notes, created_at, updated_at
       FROM customers WHERE id = ?`,
    )
      .bind(id)
      .first<{
        id: string
        name: string
        email: string
        phone: string | null
        address: string | null
        internal_notes: string | null
        created_at: string
        updated_at: string
      }>()
      .catch(() => null)) ??
    (await env.DB.prepare(
      `SELECT id, name, email, phone, address, NULL AS internal_notes, created_at, updated_at
       FROM customers WHERE id = ?`,
    )
      .bind(id)
      .first<{
        id: string
        name: string
        email: string
        phone: string | null
        address: string | null
        internal_notes: string | null
        created_at: string
        updated_at: string
      }>())
  if (!customer) throw new HttpError(404, 'Klant niet gevonden.')

  const [appointments, quotes, contacts, emails, activity] = await Promise.all([
    env.DB.prepare(
      `SELECT id, service, appointment_date, appointment_time, status, created_at, updated_at
       FROM appointments WHERE customer_id = ? ORDER BY appointment_date DESC`,
    )
      .bind(id)
      .all(),
    env.DB.prepare(
      `SELECT id, service, status, situation, message, created_at
       FROM quote_requests
       WHERE customer_id = ? OR lower(email) = lower(?)
       ORDER BY created_at DESC`,
    )
      .bind(id, customer.email)
      .all(),
    env.DB.prepare(
      `SELECT id, subject, message, status, created_at
       FROM contact_submissions
       WHERE customer_id = ? OR lower(email) = lower(?)
       ORDER BY created_at DESC`,
    )
      .bind(id, customer.email)
      .all(),
    env.DB.prepare(
      `SELECT id, subject, status, created_at, template_id
       FROM email_logs
       WHERE lower(recipient) = lower(?)
       ORDER BY created_at DESC
       LIMIT 30`,
    )
      .bind(customer.email)
      .all(),
    buildCustomerTimeline(env, customer),
  ])

  const lastActivity =
    activity[0]?.createdAt ??
    customer.updated_at ??
    customer.created_at

  return {
    ...customer,
    last_activity: lastActivity,
    appointments: appointments.results ?? [],
    quotes: quotes.results ?? [],
    contacts: contacts.results ?? [],
    emails: emails.results ?? [],
    activity,
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
    .first<{
      id: string
      email: string
      name: string
      customer_id: string | null
      status: string
      [key: string]: unknown
    }>()
  if (!row) throw new HttpError(404, 'Offerteaanvraag niet gevonden.')

  let customerId = row.customer_id
  if (!customerId) {
    customerId = await findOrCreateCustomer(env, {
      name: row.name,
      email: row.email,
      phone: typeof row.phone === 'string' ? row.phone : undefined,
      address: typeof row.address === 'string' ? row.address : undefined,
    })
    await env.DB.prepare('UPDATE quote_requests SET customer_id = ? WHERE id = ?')
      .bind(customerId, id)
      .run()
  }

  return {
    ...row,
    customer_id: customerId,
    emails: await listRelatedEmails(env, 'quote', id, row.email),
  }
}

export async function updateQuote(env: WorkerEnv, id: string, body: Record<string, unknown>) {
  const current = await getQuote(env, id)
  const currentRow = current as Record<string, unknown>
  const now = nowIso()
  const nextStatus =
    body.status !== undefined ? asStatus(body.status, QUOTE_STATUSES, 'Status') : current.status
  const nextInternal =
    body.internal_notes !== undefined
      ? text(body.internal_notes, 'Interne notitie', 4000, false) || null
      : typeof currentRow.internal_notes === 'string'
        ? currentRow.internal_notes
        : null

  await env.DB.prepare(
    `UPDATE quote_requests SET status = ?, internal_notes = ?, updated_at = ?, customer_id = COALESCE(customer_id, ?)
     WHERE id = ?`,
  )
    .bind(nextStatus, nextInternal, now, current.customer_id, id)
    .run()

  if (nextStatus !== current.status) {
    await recordActivity(env, {
      customerId: current.customer_id as string,
      entityType: 'quote',
      entityId: id,
      eventType: 'status_changed',
      title: 'Offertestatus gewijzigd',
      detail: `${current.status} → ${nextStatus}`,
    })
  }

  return { ok: true, status: nextStatus }
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
    .first<{
      id: string
      email: string
      name: string
      status: string
      customer_id: string | null
      phone: string | null
      [key: string]: unknown
    }>()
  if (!row) throw new HttpError(404, 'Bericht niet gevonden.')

  let customerId = row.customer_id
  if (!customerId) {
    customerId = await findOrCreateCustomer(env, {
      name: row.name,
      email: row.email,
      phone: row.phone ?? undefined,
    })
    await env.DB.prepare('UPDATE contact_submissions SET customer_id = ? WHERE id = ?')
      .bind(customerId, id)
      .run()
  }

  // Inbox behavior: opening a new message marks it in progress once.
  let status = row.status
  if (status === 'new') {
    const now = nowIso()
    await env.DB.prepare(
      `UPDATE contact_submissions SET status = 'in_progress', updated_at = ?, customer_id = COALESCE(customer_id, ?)
       WHERE id = ? AND status = 'new'`,
    )
      .bind(now, customerId, id)
      .run()
    status = 'in_progress'
    await recordActivity(env, {
      customerId,
      entityType: 'contact',
      entityId: id,
      eventType: 'status_changed',
      title: 'Contactbericht geopend',
      detail: 'new → in_progress',
    })
  }

  return {
    ...row,
    status,
    customer_id: customerId,
    emails: await listRelatedEmails(env, 'contact', id, row.email),
  }
}

export async function updateContact(env: WorkerEnv, id: string, body: Record<string, unknown>) {
  const current = await getContact(env, id)
  const currentRow = current as Record<string, unknown>
  const now = nowIso()
  const nextStatus =
    body.status !== undefined ? asStatus(body.status, CONTACT_STATUSES, 'Status') : current.status
  const nextInternal =
    body.internal_notes !== undefined
      ? text(body.internal_notes, 'Interne notitie', 4000, false) || null
      : typeof currentRow.internal_notes === 'string'
        ? currentRow.internal_notes
        : null

  await env.DB.prepare(
    `UPDATE contact_submissions
     SET status = ?, internal_notes = ?, updated_at = ?, customer_id = COALESCE(customer_id, ?)
     WHERE id = ?`,
  )
    .bind(nextStatus, nextInternal, now, current.customer_id, id)
    .run()

  if (nextStatus !== current.status) {
    await recordActivity(env, {
      customerId: current.customer_id as string,
      entityType: 'contact',
      entityId: id,
      eventType: 'status_changed',
      title: 'Contactstatus gewijzigd',
      detail: `${current.status} → ${nextStatus}`,
    })
  }

  return { ok: true, status: nextStatus }
}

export async function listEmails(env: WorkerEnv) {
  try {
    const rows = await env.DB.prepare(
      `SELECT email_logs.id, email_logs.recipient, email_logs.subject, email_logs.status,
              email_logs.created_at, email_logs.template_id, email_logs.provider_message_id,
              email_logs.recipient_name, email_logs.sender,
              email_logs.related_type, email_logs.related_id,
              email_templates.name AS template_name,
              customers.id AS customer_id,
              customers.name AS customer_name
       FROM email_logs
       LEFT JOIN email_templates
         ON email_templates.id = email_logs.template_id
         OR email_templates.slug = email_logs.template_id
       LEFT JOIN customers
         ON lower(customers.email) = lower(email_logs.recipient)
       ORDER BY email_logs.created_at DESC
       LIMIT 100`,
    ).all()
    return { items: rows.results ?? [] }
  } catch {
    try {
      const rows = await env.DB.prepare(
        `SELECT email_logs.id, email_logs.recipient, email_logs.subject, email_logs.status,
                email_logs.created_at, email_logs.template_id, email_logs.provider_message_id,
                email_logs.recipient_name, email_logs.sender,
                email_logs.related_type, email_logs.related_id,
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

  if (record.recipient) {
    const customer = await env.DB.prepare(
      'SELECT id, name FROM customers WHERE lower(email) = lower(?) LIMIT 1',
    )
      .bind(record.recipient)
      .first<{ id: string; name: string }>()
    if (customer) {
      record.customer_id = customer.id
      record.customer_name = customer.name
    }
  }

  return record
}

export async function listRecipients(env: WorkerEnv, query: string) {
  const needle = `%${query.trim()}%`
  const [customers, contacts, quotes, appointments] = await Promise.all([
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
              ) AS appointment_time,
              (
                SELECT appointments.id FROM appointments
                WHERE appointments.customer_id = customers.id
                ORDER BY appointments.appointment_date DESC, appointments.appointment_time DESC
                LIMIT 1
              ) AS appointment_id
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
    env.DB.prepare(
      `SELECT appointments.id, appointments.service, appointments.appointment_date,
              appointments.appointment_time, customers.name, customers.email, customers.phone
       FROM appointments
       JOIN customers ON customers.id = appointments.customer_id
       WHERE customers.name LIKE ? OR customers.email LIKE ? OR ifnull(customers.phone, '') LIKE ?
       ORDER BY appointments.appointment_date DESC
       LIMIT 8`,
    )
      .bind(needle, needle, needle)
      .all()
      .catch(() => ({ results: [] })),
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
    if (!email || seen.has(`${source}:${email}:${extra.related_id ?? ''}`)) return
    if (source === 'customer' && seen.has(`email:${email}`)) return
    seen.add(`${source}:${email}:${extra.related_id ?? ''}`)
    if (source === 'customer') seen.add(`email:${email}`)
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
      related_type: extra.related_type ?? '',
      related_id: extra.related_id ?? '',
      customer_id: String(row.id ?? extra.customer_id ?? ''),
    })
  }

  for (const row of customers.results ?? []) {
    const record = row as Record<string, unknown>
    push('customer', 'Klant', record, {
      related_type: record.appointment_id ? 'appointment' : '',
      related_id: String(record.appointment_id ?? ''),
    })
  }
  for (const row of appointments.results ?? []) {
    const record = row as Record<string, unknown>
    push('appointment', 'Afspraak', record, {
      related_type: 'appointment',
      related_id: String(record.id ?? ''),
    })
  }
  for (const row of quotes.results ?? []) {
    const record = row as Record<string, unknown>
    push('quote', 'Offerte', record, {
      quote_reference: String(record.id ?? '').slice(0, 8),
      service: String(record.service ?? ''),
      related_type: 'quote',
      related_id: String(record.id ?? ''),
    })
  }
  for (const row of contacts.results ?? []) {
    const record = row as Record<string, unknown>
    push('contact', 'Contact', record, {
      related_type: 'contact',
      related_id: String(record.id ?? ''),
    })
  }
  return { items }
}

async function loadTemplateCta(
  env: WorkerEnv,
  templateId?: string,
): Promise<{ heading?: string; ctaLabel?: string; ctaHref?: string }> {
  if (!templateId) return inferCta(env, templateId)
  try {
    const row = await env.DB.prepare(
      `SELECT heading, cta_label, cta_url FROM email_templates WHERE id = ? OR slug = ?`,
    )
      .bind(templateId, templateId)
      .first<{ heading: string | null; cta_label: string | null; cta_url: string | null }>()
    const fallback = inferCta(env, templateId)
    return {
      heading: row?.heading?.trim() || undefined,
      ctaLabel: row?.cta_label?.trim() || fallback.ctaLabel,
      ctaHref: row?.cta_url?.trim() || fallback.ctaHref,
    }
  } catch {
    return inferCta(env, templateId)
  }
}

export async function previewEmail(env: WorkerEnv, body: Record<string, unknown>) {
  const useSample = body.useSampleVars === true
  const vars = useSample
    ? { ...SAMPLE_PREVIEW_VARS, ...readVars(body.vars) }
    : readVars(body.vars)
  const subject = applyTemplate(emailHeader(body.subject, 'Onderwerp', 200), vars, env)
  const source = sanitizeTemplateText(text(body.text, 'Inhoud', 8000))
  const rendered = applyTemplate(source, vars, env)
  const templateId = text(body.templateId, 'Template', 80, false) || undefined
  const headingRaw = text(body.heading, 'Kop', 200, false)
  const templateMeta = await loadTemplateCta(env, templateId)
  const heading = applyTemplate(
    sanitizeTemplateText(headingRaw || templateMeta.heading || '', 200),
    vars,
    env,
  )
  const ctaLabel =
    text(body.ctaLabel, 'CTA-label', 80, false) || templateMeta.ctaLabel || undefined
  const ctaHref = text(body.ctaHref, 'CTA-URL', 300, false) || templateMeta.ctaHref || undefined
  const fromRow = await env.DB.prepare('SELECT value FROM settings WHERE key = ?')
    .bind('from_email')
    .first<{ value: string }>()
  const from = fromRow?.value || 'info@greeninstallatienoord.nl'

  return {
    subject,
    text: rendered,
    heading: heading || undefined,
    from: `Green Installatie Noord <${from}>`,
    html: renderBrandedEmail(env, {
      title: subject,
      heading: heading || undefined,
      text: rendered,
      ctaLabel,
      ctaHref,
    }),
  }
}

export async function sendAdminEmail(env: WorkerEnv, body: Record<string, unknown>) {
  const to = parseEmail(body.to)
  const vars = readVars(body.vars)
  const subject = applyTemplate(emailHeader(body.subject, 'Onderwerp', 200), vars, env)
  const source = sanitizeTemplateText(text(body.text, 'Inhoud', 8000))
  const rendered = applyTemplate(source, vars, env)
  const templateId = text(body.templateId, 'Template', 80, false) || undefined
  const recipientName = emailHeader(body.recipientName, 'Naam', 120, false)
  const relatedType = text(body.relatedType, 'Relatie type', 40, false) || undefined
  const relatedId = text(body.relatedId, 'Relatie id', 80, false) || undefined
  const headingRaw = text(body.heading, 'Kop', 200, false)
  const templateMeta = await loadTemplateCta(env, templateId)
  const heading = applyTemplate(
    sanitizeTemplateText(headingRaw || templateMeta.heading || '', 200),
    vars,
    env,
  )
  const ctaLabel =
    text(body.ctaLabel, 'CTA-label', 80, false) || templateMeta.ctaLabel || undefined
  const ctaHref = text(body.ctaHref, 'CTA-URL', 300, false) || templateMeta.ctaHref || undefined
  const html = renderBrandedEmail(env, {
    title: subject,
    heading: heading || undefined,
    text: rendered,
    ctaLabel,
    ctaHref,
  })
  const result = await sendEmail(env, {
    to,
    subject,
    text: rendered,
    html,
    templateId,
    recipientName: recipientName || undefined,
    relatedType: relatedType as 'appointment' | 'quote' | 'contact' | undefined,
    relatedId: relatedId || undefined,
  })
  if (result.status === 'failed') {
    throw new HttpError(502, 'Versturen via e-mail is niet gelukt. Probeer het later opnieuw.')
  }
  if (result.status === 'skipped') {
    throw new HttpError(503, 'E-mail is nog niet geconfigureerd op de server.')
  }

  const customer = await env.DB.prepare(
    'SELECT id FROM customers WHERE lower(email) = lower(?) LIMIT 1',
  )
    .bind(to)
    .first<{ id: string }>()
  if (customer) {
    await recordActivity(env, {
      customerId: customer.id,
      entityType: 'email',
      entityId: result.id ?? null,
      eventType: 'email_sent',
      title: 'E-mail verstuurd',
      detail: subject,
    })
  }

  return { ok: true, status: result.status, id: result.id }
}

export async function listTemplates(env: WorkerEnv) {
  let items: Array<Record<string, unknown>> = []
  try {
    const rows = await env.DB.prepare(
      `SELECT id, slug, name, subject, body_text, updated_at, purpose, description, compose,
              heading, intro, closing, cta_label, cta_url
       FROM email_templates ORDER BY compose DESC, name`,
    ).all()
    items = (rows.results ?? []) as Array<Record<string, unknown>>
  } catch {
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
  return { items: enriched, variables: TEMPLATE_VARIABLES, sampleVars: SAMPLE_PREVIEW_VARS }
}

export async function getTemplate(env: WorkerEnv, id: string) {
  const row = await env.DB.prepare(
    'SELECT * FROM email_templates WHERE id = ? OR slug = ?',
  )
    .bind(id, id)
    .first()
  if (!row) throw new HttpError(404, 'Template niet gevonden.')
  const meta = COMPOSE_TEMPLATE_META.find(
    (entry) => entry.id === id || entry.slug === id || entry.id === (row as { id: string }).id,
  )
  return {
    ...row,
    purpose: (row as { purpose?: string }).purpose || meta?.purpose || '',
    description: (row as { description?: string }).description || meta?.description || '',
    variables: TEMPLATE_VARIABLES,
    sampleVars: SAMPLE_PREVIEW_VARS,
  }
}

export async function updateTemplate(env: WorkerEnv, id: string, body: Record<string, unknown>) {
  await getTemplate(env, id)
  const subject = emailHeader(body.subject, 'Onderwerp', 200)
  const heading = sanitizeTemplateText(text(body.heading, 'Kop', 200, false), 200)
  const intro = sanitizeTemplateText(text(body.intro, 'Intro', 2000, false), 2000)
  const closing = sanitizeTemplateText(text(body.closing, 'Afsluiting', 2000, false), 2000)
  const rawBody =
    typeof body.body === 'string'
      ? body.body
      : typeof body.body_text === 'string'
        ? body.body_text
        : ''
  const bodyCopy = sanitizeTemplateText(
    intro || closing ? text(rawBody, 'Inhoud', 8000, false) : text(rawBody, 'Inhoud', 8000),
    8000,
  )
  const ctaLabel = sanitizeTemplateText(
    text(body.cta_label ?? body.ctaLabel, 'CTA-label', 80, false),
    80,
  )
  const ctaUrl = text(body.cta_url ?? body.ctaUrl, 'CTA-URL', 300, false)
  if (ctaUrl && !/^(https?:\/\/|tel:|mailto:)/i.test(ctaUrl)) {
    throw new HttpError(400, 'CTA-URL moet starten met https://, tel: of mailto:.')
  }

  const assembled =
    intro || closing
      ? assembleBodyText({ intro, body: bodyCopy, closing })
      : bodyCopy

  if (!assembled.trim()) throw new HttpError(400, 'Inhoud is verplicht.')

  try {
    await env.DB.prepare(
      `UPDATE email_templates
       SET subject = ?, body_text = ?, heading = ?, intro = ?, closing = ?,
           cta_label = ?, cta_url = ?, updated_at = ?
       WHERE id = ? OR slug = ?`,
    )
      .bind(
        subject,
        assembled,
        heading || null,
        intro || null,
        closing || null,
        ctaLabel || null,
        ctaUrl || null,
        nowIso(),
        id,
        id,
      )
      .run()
  } catch {
    await env.DB.prepare(
      'UPDATE email_templates SET subject = ?, body_text = ?, updated_at = ? WHERE id = ? OR slug = ?',
    )
      .bind(subject, assembled, nowIso(), id, id)
      .run()
  }
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
      phone: '050 569 0997',
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
  let source:
    | { id: string; subject: string; body_text: string; heading?: string | null }
    | undefined

  try {
    source =
      (await env.DB.prepare(
        'SELECT id, subject, body_text, heading FROM email_templates WHERE id = ?',
      )
        .bind(templateId)
        .first<{ id: string; subject: string; body_text: string; heading: string | null }>()) ??
      undefined
  } catch {
    source =
      (await env.DB.prepare('SELECT id, subject, body_text FROM email_templates WHERE id = ?')
        .bind(templateId)
        .first<{ id: string; subject: string; body_text: string }>()) ?? undefined
  }

  if (!source) {
    source = DEFAULT_TEMPLATES.find((item) => item.id === templateId)
  }
  if (!source) return { status: 'skipped' as const }

  const meta = await loadTemplateCta(env, templateId)
  const subject = applyTemplate(source.subject, vars, env)
  const textBody = applyTemplate(source.body_text, vars, env)
  const headingSource = source.heading || meta.heading || ''
  const heading = headingSource ? applyTemplate(headingSource, vars, env) : undefined
  const html = renderBrandedEmail(env, {
    title: subject,
    heading,
    text: textBody,
    ctaLabel: meta.ctaLabel,
    ctaHref: meta.ctaHref,
  })

  return sendEmail(env, {
    to,
    templateId: source.id,
    subject,
    text: textBody,
    html,
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
    name: readString(input, 'customer.fullName', 'customer.name', 'customer_name', 'name'),
    email: readString(input, 'customer.email', 'customer_email', 'email'),
    date: readString(input, 'appointment.date', 'appointment_date', 'date'),
    time: readString(input, 'appointment.time', 'appointment_time', 'time'),
    service: readString(input, 'service.name', 'appointment.service', 'service'),
    quoteReference: readString(input, 'quote.reference', 'quote_reference'),
  })
}

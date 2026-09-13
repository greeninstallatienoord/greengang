import { randomHex } from './auth'
import type { WorkerEnv } from './env'

export type ActivityEntityType = 'appointment' | 'quote' | 'contact' | 'email' | 'customer'

export type ActivityEventInput = {
  customerId?: string | null
  entityType: ActivityEntityType
  entityId?: string | null
  eventType: string
  title: string
  detail?: string | null
}

export async function recordActivity(
  env: WorkerEnv,
  input: ActivityEventInput,
): Promise<void> {
  try {
    await env.DB.prepare(
      `INSERT INTO activity_events
         (id, customer_id, entity_type, entity_id, event_type, title, detail, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        randomHex(16),
        input.customerId ?? null,
        input.entityType,
        input.entityId ?? null,
        input.eventType,
        input.title,
        input.detail ?? null,
        new Date().toISOString(),
      )
      .run()
  } catch {
    // Activity is additive; never fail the primary mutation.
  }
}

export type TimelineItem = {
  id: string
  source: 'activity' | 'appointment' | 'quote' | 'contact' | 'email'
  eventType: string
  title: string
  detail: string | null
  href: string | null
  createdAt: string
}

/**
 * Build a customer timeline from real rows only (no fabricated status history).
 * Merges activity_events with existing appointments/quotes/contacts/emails.
 */
export async function buildCustomerTimeline(
  env: WorkerEnv,
  customer: { id: string; email: string },
): Promise<TimelineItem[]> {
  const [activityRows, appointments, quotes, contacts, emails] = await Promise.all([
    env.DB.prepare(
      `SELECT id, event_type AS eventType, title, detail, entity_type AS entityType,
              entity_id AS entityId, created_at AS createdAt
       FROM activity_events
       WHERE customer_id = ?
       ORDER BY created_at DESC
       LIMIT 80`,
    )
      .bind(customer.id)
      .all<{
        id: string
        eventType: string
        title: string
        detail: string | null
        entityType: string
        entityId: string | null
        createdAt: string
      }>()
      .catch(() => ({ results: [] as Array<{
        id: string
        eventType: string
        title: string
        detail: string | null
        entityType: string
        entityId: string | null
        createdAt: string
      }> })),
    env.DB.prepare(
      `SELECT id, service, appointment_date, appointment_time, status, notes,
              created_at, updated_at
       FROM appointments WHERE customer_id = ?
       ORDER BY created_at DESC LIMIT 50`,
    )
      .bind(customer.id)
      .all<{
        id: string
        service: string
        appointment_date: string
        appointment_time: string
        status: string
        notes: string | null
        created_at: string
        updated_at: string
      }>(),
    env.DB.prepare(
      `SELECT id, service, status, situation, message, created_at
       FROM quote_requests
       WHERE customer_id = ? OR lower(email) = lower(?)
       ORDER BY created_at DESC LIMIT 50`,
    )
      .bind(customer.id, customer.email)
      .all<{
        id: string
        service: string
        status: string
        situation: string | null
        message: string | null
        created_at: string
      }>(),
    env.DB.prepare(
      `SELECT id, subject, message, status, created_at
       FROM contact_submissions
       WHERE customer_id = ? OR lower(email) = lower(?)
       ORDER BY created_at DESC LIMIT 50`,
    )
      .bind(customer.id, customer.email)
      .all<{
        id: string
        subject: string | null
        message: string
        status: string
        created_at: string
      }>(),
    env.DB.prepare(
      `SELECT id, subject, status, related_type, related_id, created_at
       FROM email_logs
       WHERE lower(recipient) = lower(?)
          OR (related_type = 'appointment' AND related_id IN (
                SELECT id FROM appointments WHERE customer_id = ?
              ))
          OR (related_type = 'quote' AND related_id IN (
                SELECT id FROM quote_requests
                WHERE customer_id = ? OR lower(email) = lower(?)
              ))
          OR (related_type = 'contact' AND related_id IN (
                SELECT id FROM contact_submissions
                WHERE customer_id = ? OR lower(email) = lower(?)
              ))
       ORDER BY created_at DESC
       LIMIT 50`,
    )
      .bind(
        customer.email,
        customer.id,
        customer.id,
        customer.email,
        customer.id,
        customer.email,
      )
      .all<{
        id: string
        subject: string
        status: string
        related_type: string | null
        related_id: string | null
        created_at: string
      }>(),
  ])

  const items: TimelineItem[] = []

  for (const row of activityRows.results ?? []) {
    items.push({
      id: `activity-${row.id}`,
      source: 'activity',
      eventType: row.eventType,
      title: row.title,
      detail: row.detail,
      href: entityHref(row.entityType, row.entityId),
      createdAt: row.createdAt,
    })
  }

  for (const row of appointments.results ?? []) {
    items.push({
      id: `appointment-created-${row.id}`,
      source: 'appointment',
      eventType: 'appointment_created',
      title: 'Afspraakaanvraag ontvangen',
      detail: `${row.appointment_date} ${row.appointment_time} · ${row.service} · ${row.status}`,
      href: `/appointments/${row.id}`,
      createdAt: row.created_at,
    })
    if (row.updated_at && row.updated_at !== row.created_at) {
      items.push({
        id: `appointment-updated-${row.id}-${row.updated_at}`,
        source: 'appointment',
        eventType: 'appointment_updated',
        title: 'Afspraak bijgewerkt',
        detail: `Status: ${row.status} · ${row.appointment_date} ${row.appointment_time}`,
        href: `/appointments/${row.id}`,
        createdAt: row.updated_at,
      })
    }
  }

  for (const row of quotes.results ?? []) {
    items.push({
      id: `quote-${row.id}`,
      source: 'quote',
      eventType: 'quote_created',
      title: 'Offerteaanvraag ontvangen',
      detail: `${row.service} · ${row.status}`,
      href: `/quotes/${row.id}`,
      createdAt: row.created_at,
    })
  }

  for (const row of contacts.results ?? []) {
    items.push({
      id: `contact-${row.id}`,
      source: 'contact',
      eventType: 'contact_created',
      title: 'Contactbericht ontvangen',
      detail: row.subject || row.message.slice(0, 120),
      href: `/contact/${row.id}`,
      createdAt: row.created_at,
    })
  }

  for (const row of emails.results ?? []) {
    items.push({
      id: `email-${row.id}`,
      source: 'email',
      eventType: 'email_sent',
      title: 'E-mail verzonden',
      detail: `${row.subject} · ${row.status}`,
      href: `/emails/logs/${row.id}`,
      createdAt: row.created_at,
    })
  }

  // Deduplicate near-identical activity_events vs source rows by title+timestamp minute.
  const seen = new Set<string>()
  const unique = items.filter((item) => {
    const key = `${item.eventType}|${item.href}|${item.createdAt.slice(0, 16)}|${item.title}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  unique.sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0))
  return unique.slice(0, 60)
}

function entityHref(type: string, id: string | null): string | null {
  if (!id) return null
  if (type === 'appointment') return `/appointments/${id}`
  if (type === 'quote') return `/quotes/${id}`
  if (type === 'contact') return `/contact/${id}`
  if (type === 'email') return `/emails/logs/${id}`
  if (type === 'customer') return `/customers/${id}`
  return null
}

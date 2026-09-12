import { inferCta, renderBrandedEmail } from './emailLayout'
import type { WorkerEnv } from './env'
import { logSafe } from './http'

export { escapeHtml } from './emailLayout'

export type EmailStatus = 'sent' | 'failed' | 'skipped'

export type EmailResult = {
  status: EmailStatus
  id?: string
  providerMessageId?: string | null
}

export type OutgoingEmail = {
  to: string
  subject: string
  text: string
  html?: string
  templateId?: string
  recipientName?: string
  sender?: string
  relatedType?: 'quote' | 'contact' | 'appointment'
  relatedId?: string
}

export function emailOutcome(
  admin: EmailResult,
  customer: EmailResult,
): {
  emails: { admin: EmailStatus; customer: EmailStatus }
  emailWarning?: string
} {
  const failed = admin.status === 'failed' || customer.status === 'failed'
  const skipped = admin.status === 'skipped' || customer.status === 'skipped'
  return {
    emails: { admin: admin.status, customer: customer.status },
    emailWarning: failed
      ? 'De aanvraag is opgeslagen, maar de e-mail kon niet worden verstuurd.'
      : skipped
        ? 'De aanvraag is opgeslagen. E-mail is nog niet geconfigureerd, dus er is geen bevestiging verstuurd.'
        : undefined,
  }
}

export function adminRecordUrl(env: WorkerEnv, path: string): string {
  return `${env.PUBLIC_SITE_URL.replace(/\/$/, '')}${env.ADMIN_BASE_PATH.replace(/\/$/, '')}${path}`
}

export function businessBlock(): string {
  return [
    'Green Installatie Noord',
    'Burgemeester van Weringstraat 23, 9665 GN Oude Pekela',
    '06 28 73 91 34',
    'info@greeninstallatienoord.nl',
  ].join('\n')
}

export function textToHtml(env: WorkerEnv, text: string, templateId?: string): string {
  const cta = inferCta(env, templateId)
  return renderBrandedEmail(env, { text, ...cta })
}

async function insertLog(
  env: WorkerEnv,
  row: {
    id: string
    to: string
    subject: string
    templateId: string | null
    status: EmailStatus
    providerMessageId: string | null
    createdAt: string
    recipientName?: string
    sender?: string
    bodyText?: string
    bodyHtml?: string
    relatedType?: string
    relatedId?: string
  },
) {
  try {
    await env.DB.prepare(
      `INSERT INTO email_logs (
         id, recipient, subject, template_id, status, provider_message_id, created_at,
         recipient_name, sender, body_text, body_html, related_type, related_id
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        row.id,
        row.to,
        row.subject,
        row.templateId,
        row.status,
        row.providerMessageId,
        row.createdAt,
        row.recipientName ?? null,
        row.sender ?? null,
        row.bodyText ?? null,
        row.bodyHtml ?? null,
        row.relatedType ?? null,
        row.relatedId ?? null,
      )
      .run()
  } catch {
    try {
      await env.DB.prepare(
        `INSERT INTO email_logs (
           id, recipient, subject, template_id, status, provider_message_id, created_at,
           recipient_name, sender, body_text, body_html
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          row.id,
          row.to,
          row.subject,
          row.templateId,
          row.status,
          row.providerMessageId,
          row.createdAt,
          row.recipientName ?? null,
          row.sender ?? null,
          row.bodyText ?? null,
          row.bodyHtml ?? null,
        )
        .run()
    } catch {
      await env.DB.prepare(
        `INSERT INTO email_logs (id, recipient, subject, template_id, status, provider_message_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(row.id, row.to, row.subject, row.templateId, row.status, row.providerMessageId, row.createdAt)
        .run()
    }
  }
}

export async function sendEmail(env: WorkerEnv, message: OutgoingEmail): Promise<EmailResult> {
  const fromRow = await env.DB.prepare('SELECT value FROM settings WHERE key = ?')
    .bind('from_email')
    .first<{ value: string }>()
  const from = fromRow?.value || 'info@greeninstallatienoord.nl'
  const html = message.html ?? textToHtml(env, message.text, message.templateId)
  const logId = crypto.randomUUID()
  const createdAt = new Date().toISOString()
  const baseLog = {
    id: logId,
    to: message.to,
    subject: message.subject,
    templateId: message.templateId ?? null,
    createdAt,
    recipientName: message.recipientName,
    sender: message.sender ?? from,
    bodyText: message.text,
    bodyHtml: html,
    relatedType: message.relatedType,
    relatedId: message.relatedId,
  }

  if (!env.RESEND_API_KEY) {
    await insertLog(env, { ...baseLog, status: 'skipped', providerMessageId: null })
    logSafe(env, 'email.skipped', { template: message.templateId ?? null })
    return { status: 'skipped', id: logId }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Green Installatie Noord <${from}>`,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html,
      }),
    })
    const body = (await response.json()) as { id?: string }
    const status: EmailStatus = response.ok ? 'sent' : 'failed'
    await insertLog(env, {
      ...baseLog,
      status,
      providerMessageId: body.id ?? null,
    })
    logSafe(env, response.ok ? 'email.sent' : 'email.failed', {
      template: message.templateId ?? null,
      status: response.status,
    })
    return { status, id: logId, providerMessageId: body.id ?? null }
  } catch {
    await insertLog(env, { ...baseLog, status: 'failed', providerMessageId: null })
    logSafe(env, 'email.failed', { template: message.templateId ?? null })
    return { status: 'failed', id: logId }
  }
}

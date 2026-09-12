import type { WorkerEnv } from './env'
import { logSafe } from './http'

export type EmailStatus = 'sent' | 'failed' | 'skipped'

export type EmailResult = {
  status: EmailStatus
}

export type OutgoingEmail = {
  to: string
  subject: string
  text: string
  html?: string
  templateId?: string
}

export function businessBlock(): string {
  return [
    'Green Installatie Noord',
    'Burgemeester van Weringstraat 23, 9665 GN Oude Pekela',
    '06 28 73 91 34',
    'info@greeninstallatienoord.nl',
  ].join('\n')
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function textToHtml(text: string): string {
  return `<!doctype html><html lang="nl"><body style="font-family:Arial,sans-serif;line-height:1.5;color:#121417">
  ${text.split('\n').map((line) => `<p style="margin:0 0 12px">${escapeHtml(line) || '&nbsp;'}</p>`).join('')}
</body></html>`
}

export async function sendEmail(env: WorkerEnv, message: OutgoingEmail): Promise<EmailResult> {
  const fromRow = await env.DB.prepare('SELECT value FROM settings WHERE key = ?')
    .bind('from_email')
    .first<{ value: string }>()
  const from = fromRow?.value || 'info@greeninstallatienoord.nl'
  const html = message.html ?? textToHtml(message.text)
  const logId = crypto.randomUUID()
  const createdAt = new Date().toISOString()

  if (!env.RESEND_API_KEY) {
    await env.DB.prepare(
      `INSERT INTO email_logs (id, recipient, subject, template_id, status, provider_message_id, created_at)
       VALUES (?, ?, ?, ?, 'skipped', NULL, ?)`,
    )
      .bind(logId, message.to, message.subject, message.templateId ?? null, createdAt)
      .run()
    logSafe(env, 'email.skipped', { template: message.templateId ?? null })
    return { status: 'skipped' }
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
    await env.DB.prepare(
      `INSERT INTO email_logs (id, recipient, subject, template_id, status, provider_message_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        logId,
        message.to,
        message.subject,
        message.templateId ?? null,
        response.ok ? 'sent' : 'failed',
        body.id ?? null,
        createdAt,
      )
      .run()
    logSafe(env, response.ok ? 'email.sent' : 'email.failed', {
      template: message.templateId ?? null,
      status: response.status,
    })
    return { status: response.ok ? 'sent' : 'failed' }
  } catch {
    await env.DB.prepare(
      `INSERT INTO email_logs (id, recipient, subject, template_id, status, provider_message_id, created_at)
       VALUES (?, ?, ?, ?, 'failed', NULL, ?)`,
    )
      .bind(logId, message.to, message.subject, message.templateId ?? null, createdAt)
      .run()
    logSafe(env, 'email.failed', { template: message.templateId ?? null })
    return { status: 'failed' }
  }
}

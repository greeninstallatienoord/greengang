import type { WorkerEnv } from './env'

const KEY = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function readIdempotencyKey(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const next = value.trim()
  return KEY.test(next) ? next : null
}

export async function reserveSubmission(
  env: WorkerEnv,
  kind: 'quote' | 'contact' | 'appointment',
  key: string | null,
  entityId: string,
  now: string,
): Promise<{ replayId: string } | { reserved: true }> {
  if (!key) return { reserved: true }
  try {
    await env.DB.prepare(
      `INSERT INTO submission_keys (id, kind, entity_id, created_at) VALUES (?, ?, ?, ?)`,
    )
      .bind(key, kind, entityId, now)
      .run()
    return { reserved: true }
  } catch {
    const existing = await env.DB.prepare(
      'SELECT entity_id FROM submission_keys WHERE id = ? AND kind = ?',
    )
      .bind(key, kind)
      .first<{ entity_id: string }>()
    if (existing?.entity_id) return { replayId: existing.entity_id }
    return { reserved: true }
  }
}

export async function releaseSubmission(
  env: WorkerEnv,
  key: string | null,
): Promise<void> {
  if (!key) return
  try {
    await env.DB.prepare('DELETE FROM submission_keys WHERE id = ?').bind(key).run()
  } catch {
    /* table may not exist yet */
  }
}

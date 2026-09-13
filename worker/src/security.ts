import { randomHex } from './auth'
import { isProduction, type WorkerEnv } from './env'
import { HttpError, logSafe } from './http'
import { clientKey } from './rateLimit'

const LOGIN_WINDOW_MS = 15 * 60_000
const LOGIN_MAX_ATTEMPTS = 8
const LOGIN_BASE_LOCK_MS = 30_000
const LOGIN_MAX_LOCK_MS = 15 * 60_000

function nowIso(): string {
  return new Date().toISOString()
}

async function hashIp(request: Request): Promise<string> {
  const raw =
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
    'unknown'
  const bits = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
  return [...new Uint8Array(bits)]
    .map((item) => item.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32)
}

export async function recordSecurityEvent(
  env: WorkerEnv,
  event: string,
  request: Request,
  detail?: string,
  adminId?: string,
): Promise<void> {
  try {
    const ipHash = await hashIp(request)
    await env.DB.prepare(
      `INSERT INTO security_events (id, event, ip_hash, admin_id, detail, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
      .bind(randomHex(16), event, ipHash, adminId ?? null, detail ?? null, nowIso())
      .run()
  } catch {
    logSafe(env, 'security_event.write_failed', { event })
  }
  logSafe(env, event, {
    adminId: adminId ?? null,
    detail: detail ?? null,
  })
}

/**
 * Durable login throttle in D1 (works across Worker isolates).
 * Progressive cooldown after repeated failures; cleared on success.
 */
export async function assertLoginAllowed(env: WorkerEnv, request: Request): Promise<void> {
  const key = clientKey(request, 'login')
  const row = await env.DB.prepare(
    `SELECT fail_count AS failCount, window_started_at AS windowStartedAt, locked_until AS lockedUntil
     FROM auth_rate_limits WHERE key = ?`,
  )
    .bind(key)
    .first<{ failCount: number; windowStartedAt: string; lockedUntil: string | null }>()

  const now = Date.now()
  if (row?.lockedUntil) {
    const until = new Date(row.lockedUntil).getTime()
    if (until > now) {
      throw new HttpError(429, 'Te veel mislukte pogingen. Probeer het later opnieuw.')
    }
  }

  if (row) {
    const windowStart = new Date(row.windowStartedAt).getTime()
    if (now - windowStart <= LOGIN_WINDOW_MS && row.failCount >= LOGIN_MAX_ATTEMPTS) {
      throw new HttpError(429, 'Te veel mislukte pogingen. Probeer het later opnieuw.')
    }
  }
}

export async function registerLoginFailure(env: WorkerEnv, request: Request): Promise<void> {
  const key = clientKey(request, 'login')
  const now = Date.now()
  const row = await env.DB.prepare(
    `SELECT fail_count AS failCount, window_started_at AS windowStartedAt
     FROM auth_rate_limits WHERE key = ?`,
  )
    .bind(key)
    .first<{ failCount: number; windowStartedAt: string }>()

  let failCount = 1
  let windowStartedAt = nowIso()

  if (row) {
    const windowStart = new Date(row.windowStartedAt).getTime()
    if (now - windowStart <= LOGIN_WINDOW_MS) {
      failCount = row.failCount + 1
      windowStartedAt = row.windowStartedAt
    }
  }

  let lockedUntil: string | null = null
  if (failCount >= LOGIN_MAX_ATTEMPTS) {
    const extra = Math.max(0, failCount - LOGIN_MAX_ATTEMPTS)
    const lockMs = Math.min(LOGIN_MAX_LOCK_MS, LOGIN_BASE_LOCK_MS * 2 ** extra)
    lockedUntil = new Date(now + lockMs).toISOString()
  }

  await env.DB.prepare(
    `INSERT INTO auth_rate_limits (key, fail_count, window_started_at, locked_until, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET
       fail_count = excluded.fail_count,
       window_started_at = excluded.window_started_at,
       locked_until = excluded.locked_until,
       updated_at = excluded.updated_at`,
  )
    .bind(key, failCount, windowStartedAt, lockedUntil, nowIso())
    .run()
}

export async function clearLoginFailures(env: WorkerEnv, request: Request): Promise<void> {
  const key = clientKey(request, 'login')
  await env.DB.prepare('DELETE FROM auth_rate_limits WHERE key = ?').bind(key).run()
}

/**
 * Reject unexpected cross-origin state-changing requests.
 * Same-origin SPA fetches send Origin; browsers also send Sec-Fetch-Site.
 */
export function assertTrustedMutation(env: WorkerEnv, request: Request): void {
  const method = request.method.toUpperCase()
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return

  const origin = request.headers.get('Origin')
  if (origin) {
    const allowed = allowedMutationOrigins(env)
    if (!allowed.includes(origin)) {
      throw new HttpError(403, 'Verzoek geweigerd.')
    }
    return
  }

  const site = request.headers.get('Sec-Fetch-Site')
  if (site === 'cross-site') {
    throw new HttpError(403, 'Verzoek geweigerd.')
  }
  if (site === 'same-origin' || site === 'none' || site === 'same-site') return

  // Non-browser clients without Origin/Sec-Fetch-Site: allow only outside production.
  if (isProduction(env)) {
    throw new HttpError(403, 'Verzoek geweigerd.')
  }
}

function allowedMutationOrigins(env: WorkerEnv): string[] {
  const origins = new Set<string>([
    env.PUBLIC_SITE_URL.replace(/\/$/, ''),
    'https://greeninstallatienoord.nl',
    'https://www.greeninstallatienoord.nl',
  ])
  if (!isProduction(env)) {
    origins.add('http://localhost:5173')
    origins.add('http://127.0.0.1:5173')
    origins.add('http://localhost:4173')
    origins.add('http://127.0.0.1:4173')
  }
  return [...origins]
}

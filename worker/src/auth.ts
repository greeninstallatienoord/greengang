import { COOKIE_NAME, SESSION_HOURS, SESSION_IDLE_HOURS, isProduction, type WorkerEnv } from './env'
import { HttpError } from './http'

function bytesToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((item) => item.toString(16).padStart(2, '0')).join('')
}

export async function hashPassword(password: string, saltHex: string): Promise<string> {
  const salt = Uint8Array.from(saltHex.match(/.{1,2}/g) ?? [], (part) => Number.parseInt(part, 16))
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    // Cloudflare Workers Web Crypto rejects PBKDF2 above 100_000 iterations.
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100_000 },
    key,
    256,
  )
  return bytesToHex(bits)
}

export function randomHex(bytes = 16): string {
  const view = new Uint8Array(bytes)
  crypto.getRandomValues(view)
  return bytesToHex(view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength))
}

export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let different = 0
  for (let i = 0; i < a.length; i += 1) {
    different |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return different === 0
}

async function hmacHex(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const bits = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  return bytesToHex(bits)
}

export async function sessionCookie(
  token: string,
  env: WorkerEnv,
  maxAgeSeconds: number,
): Promise<string> {
  const signed = token && env.ADMIN_SESSION_SECRET
    ? `${token}.${await hmacHex(env.ADMIN_SESSION_SECRET, token)}`
    : token
  const parts = [
    `${COOKIE_NAME}=${signed}`,
    'Path=/',
    'HttpOnly',
    // Strict is compatible with same-origin SPA + /api on greeninstallatienoord.nl.
    'SameSite=Strict',
    `Max-Age=${maxAgeSeconds}`,
  ]
  if (isProduction(env)) parts.push('Secure')
  return parts.join('; ')
}

export async function clearSessionCookie(env: WorkerEnv): Promise<string> {
  return sessionCookie('', env, 0)
}

export async function readSignedSessionToken(
  env: WorkerEnv,
  request: Request,
): Promise<string | null> {
  const cookie = request.headers.get('Cookie') ?? ''
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`))
  const raw = match?.[1]
  if (!raw) return null
  const [token, signature] = raw.split('.')
  if (!token || !signature || !env.ADMIN_SESSION_SECRET) return null
  const expected = await hmacHex(env.ADMIN_SESSION_SECRET, token)
  if (!timingSafeEqualHex(expected, signature)) return null
  return token
}

export async function requireAdmin(
  env: WorkerEnv,
  request: Request,
): Promise<{ adminId: string; email: string; sessionId: string }> {
  const token = await readSignedSessionToken(env, request)
  if (!token) throw new HttpError(401, 'Niet ingelogd.')

  const row = await env.DB.prepare(
    `SELECT sessions.admin_id AS adminId,
            sessions.expires_at AS expiresAt,
            sessions.created_at AS createdAt,
            sessions.last_seen_at AS lastSeenAt,
            admins.email AS email
     FROM sessions
     JOIN admins ON admins.id = sessions.admin_id
     WHERE sessions.id = ?`,
  )
    .bind(token)
    .first<{
      adminId: string
      expiresAt: string
      createdAt: string
      lastSeenAt: string | null
      email: string
    }>()

  if (!row) {
    throw new HttpError(401, 'Sessie verlopen. Log opnieuw in.')
  }

  const now = Date.now()
  const absoluteExpired = new Date(row.expiresAt).getTime() <= now
  const lastSeen = new Date(row.lastSeenAt ?? row.createdAt).getTime()
  const idleExpired = now - lastSeen > SESSION_IDLE_HOURS * 60 * 60 * 1000

  if (absoluteExpired || idleExpired) {
    await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(token).run()
    throw new HttpError(401, 'Sessie verlopen. Log opnieuw in.')
  }

  await env.DB.prepare('UPDATE sessions SET last_seen_at = ? WHERE id = ?')
    .bind(new Date().toISOString(), token)
    .run()

  return { adminId: row.adminId, email: row.email, sessionId: token }
}

export function sessionExpiry(): string {
  return new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000).toISOString()
}

/** Dummy salt used when no admin row exists so login always pays PBKDF2 cost. */
export const LOGIN_DUMMY_SALT = 'a1b2c3d4e5f60718293a4b5c6d7e8f90'

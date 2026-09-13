import { COOKIE_NAME, SESSION_HOURS, isProduction, type WorkerEnv } from './env'
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
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 210_000 },
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
    'SameSite=Lax',
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
  if (expected.length !== signature.length) return null
  let different = 0
  for (let i = 0; i < expected.length; i += 1) {
    different |= (expected.charCodeAt(i) ?? 0) ^ (signature.charCodeAt(i) ?? 0)
  }
  return different === 0 ? token : null
}

export async function requireAdmin(
  env: WorkerEnv,
  request: Request,
): Promise<{ adminId: string; email: string }> {
  const token = await readSignedSessionToken(env, request)
  if (!token) throw new HttpError(401, 'Niet ingelogd.')

  const row = await env.DB.prepare(
    `SELECT sessions.admin_id AS adminId, sessions.expires_at AS expiresAt, admins.email AS email
     FROM sessions
     JOIN admins ON admins.id = sessions.admin_id
     WHERE sessions.id = ?`,
  )
    .bind(token)
    .first<{ adminId: string; expiresAt: string; email: string }>()

  if (!row || new Date(row.expiresAt).getTime() <= Date.now()) {
    if (row) {
      await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(token).run()
    }
    throw new HttpError(401, 'Sessie verlopen. Log opnieuw in.')
  }

  return { adminId: row.adminId, email: row.email }
}

export function sessionExpiry(): string {
  return new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000).toISOString()
}

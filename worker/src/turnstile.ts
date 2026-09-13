import { isProduction, type WorkerEnv } from './env'
import { HttpError, logSafe } from './http'

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const VERIFY_TIMEOUT_MS = 8_000
export const TURNSTILE_ACTION = 'admin_login'

type SiteverifyResponse = {
  success?: boolean
  'error-codes'?: string[]
  action?: string
  hostname?: string
  challenge_ts?: string
}

/**
 * Server-side Turnstile verification. Fail closed when the secret is missing
 * or Cloudflare cannot be reached. Never returns Cloudflare internals to callers.
 */
export async function verifyTurnstileToken(
  env: WorkerEnv,
  token: unknown,
  request: Request,
): Promise<void> {
  const secret = env.TURNSTILE_SECRET_KEY?.trim()
  if (!secret) {
    throw new HttpError(
      503,
      isProduction(env)
        ? 'Beheer is nog niet geconfigureerd.'
        : 'Turnstile is niet geconfigureerd. Zet TURNSTILE_SECRET_KEY in .dev.vars.',
    )
  }

  if (typeof token !== 'string' || token.trim().length < 20 || token.length > 2048) {
    throw new HttpError(400, 'Bevestig dat u geen robot bent en probeer opnieuw.')
  }

  const ip =
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
    undefined

  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token.trim())
  if (ip) body.set('remoteip', ip)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS)

  let payload: SiteverifyResponse
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: controller.signal,
    })
    if (!response.ok) {
      throw new HttpError(503, 'Beveiligingscontrole tijdelijk niet beschikbaar. Probeer het zo opnieuw.')
    }
    payload = (await response.json()) as SiteverifyResponse
  } catch (error) {
    if (error instanceof HttpError) throw error
    throw new HttpError(503, 'Beveiligingscontrole tijdelijk niet beschikbaar. Probeer het zo opnieuw.')
  } finally {
    clearTimeout(timer)
  }

  if (!payload.success) {
    logSafe(env, 'turnstile.verify_failed', {
      hostname: payload.hostname ?? null,
      action: payload.action ?? null,
      errorCodes: (payload['error-codes'] ?? []).join(','),
    })
    throw new HttpError(400, 'Beveiligingscontrole mislukt. Vernieuw de pagina en probeer opnieuw.')
  }

  if (payload.action && payload.action !== TURNSTILE_ACTION) {
    logSafe(env, 'turnstile.action_mismatch', {
      action: payload.action ?? null,
      expected: TURNSTILE_ACTION,
    })
    throw new HttpError(400, 'Beveiligingscontrole mislukt. Vernieuw de pagina en probeer opnieuw.')
  }

  if (isProduction(env)) {
    const hostname = (payload.hostname ?? '').toLowerCase()
    const allowed = expectedHostnames(env)
    if (!hostname || !allowed.some((item) => hostname === item || hostname.endsWith(`.${item}`))) {
      logSafe(env, 'turnstile.hostname_mismatch', {
        hostname: hostname || null,
      })
      throw new HttpError(400, 'Beveiligingscontrole mislukt. Vernieuw de pagina en probeer opnieuw.')
    }
  }
}

function expectedHostnames(env: WorkerEnv): string[] {
  const fromEnv = env.TURNSTILE_EXPECTED_HOSTNAME?.trim().toLowerCase()
  const hosts = new Set<string>(['greeninstallatienoord.nl', 'www.greeninstallatienoord.nl'])
  if (fromEnv) hosts.add(fromEnv)
  try {
    hosts.add(new URL(env.PUBLIC_SITE_URL).hostname.toLowerCase())
  } catch {
    /* ignore invalid PUBLIC_SITE_URL */
  }
  return [...hosts]
}

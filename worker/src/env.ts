export type WorkerEnv = {
  ASSETS: Fetcher
  DB: D1Database
  ENVIRONMENT: string
  PUBLIC_SITE_URL: string
  ADMIN_BASE_PATH: string
  RESEND_API_KEY?: string
  ADMIN_SESSION_SECRET?: string
}

export const COOKIE_NAME = 'gin_admin_session'
export const SESSION_HOURS = 12
/** Idle timeout: session dies after this much inactivity (absolute max remains SESSION_HOURS). */
export const SESSION_IDLE_HOURS = 2
export const MAX_BODY_BYTES = 80_000

export function isProduction(env: WorkerEnv): boolean {
  return env.ENVIRONMENT === 'production'
}

export function allowedOrigins(env: WorkerEnv): string[] {
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

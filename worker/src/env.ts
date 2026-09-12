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
export const MAX_BODY_BYTES = 80_000

export function isProduction(env: WorkerEnv): boolean {
  return env.ENVIRONMENT === 'production'
}

export function allowedOrigins(env: WorkerEnv): string[] {
  const extras = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://development.greeninstallatienoord.nl',
    'https://developers.greeninstallatienoord.nl',
    'https://greeninstallatienoord.nl',
  ]
  return Array.from(new Set([env.PUBLIC_SITE_URL.replace(/\/$/, ''), ...extras]))
}

import { allowedOrigins, type WorkerEnv } from './env'

export class HttpError extends Error {
  status: number
  expose: boolean

  constructor(status: number, message: string, expose = true) {
    super(message)
    this.status = status
    this.expose = expose
  }
}

export function json(
  env: WorkerEnv,
  request: Request,
  data: unknown,
  status = 200,
  extraHeaders?: HeadersInit,
): Response {
  const headers = new Headers(extraHeaders)
  headers.set('Content-Type', 'application/json; charset=utf-8')
  headers.set('Cache-Control', 'no-store')
  applyCors(env, request, headers)
  return new Response(JSON.stringify(data), { status, headers })
}

export function applyCors(env: WorkerEnv, request: Request, headers: Headers): void {
  const origin = request.headers.get('Origin')
  const allowed = allowedOrigins(env)
  if (origin && allowed.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Vary', 'Origin')
    headers.set('Access-Control-Allow-Credentials', 'true')
    headers.set('Access-Control-Allow-Headers', 'Content-Type')
    headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, DELETE, OPTIONS',
    )
  }
}

export function optionsResponse(env: WorkerEnv, request: Request): Response {
  const headers = new Headers()
  applyCors(env, request, headers)
  return new Response(null, { status: 204, headers })
}

export function logSafe(
  env: WorkerEnv,
  event: string,
  extra?: Record<string, string | number | boolean | null>,
): void {
  const payload = {
    event,
    env: env.ENVIRONMENT,
    ...extra,
  }
  console.log(JSON.stringify(payload))
}

export async function readJson<T>(request: Request, maxBytes: number): Promise<T> {
  const length = Number(request.headers.get('content-length') ?? 0)
  if (length > maxBytes) {
    throw new HttpError(413, 'Het verzoek is te groot.')
  }
  const text = await request.text()
  if (text.length > maxBytes) {
    throw new HttpError(413, 'Het verzoek is te groot.')
  }
  if (!text.trim()) {
    throw new HttpError(400, 'Lege aanvraag.')
  }
  try {
    return JSON.parse(text) as T
  } catch {
    throw new HttpError(400, 'Ongeldige JSON.')
  }
}

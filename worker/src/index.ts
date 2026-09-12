import { requireAdmin } from './auth'
import { MAX_BODY_BYTES, type WorkerEnv } from './env'
import { HttpError, json, logSafe, optionsResponse, readJson } from './http'
import { clientKey, rateLimit } from './rateLimit'
import * as admin from './routes/admin'
import * as pub from './routes/public'

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    if (request.method === 'OPTIONS') return optionsResponse(env, request)

    try {
      return await handle(request, env)
    } catch (error) {
      if (error instanceof HttpError) {
        return json(env, request, { ok: false, error: error.message }, error.status)
      }
      logSafe(env, 'request.failed', { path: new URL(request.url).pathname })
      return json(env, request, { ok: false, error: 'Er ging iets mis. Probeer het later opnieuw.' }, 500)
    }
  },
}

async function handle(request: Request, env: WorkerEnv): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname.replace(/\/$/, '') || '/'

  if (request.method === 'GET' && path === '/api/health') {
    return json(env, request, { ok: true })
  }

  if (request.method === 'GET' && path === '/api/appointments/config') {
    return json(env, request, await pub.publicSlotConfig(env))
  }

  if (request.method === 'GET' && path === '/api/appointments/slots') {
    const date = url.searchParams.get('date')
    if (!date) throw new HttpError(400, 'Kies een datum.')
    return json(env, request, await pub.listSlots(env, date))
  }

  if (request.method === 'POST' && path === '/api/contact') {
    limit(request, 'contact', 8)
    const body = await readJson<Record<string, unknown>>(request, MAX_BODY_BYTES)
    return json(env, request, { ok: true, ...(await pub.createContact(env, body)) }, 201)
  }

  if (request.method === 'POST' && path === '/api/quotes') {
    limit(request, 'quotes', 8)
    const body = await readJson<Record<string, unknown>>(request, MAX_BODY_BYTES)
    return json(env, request, { ok: true, ...(await pub.createQuote(env, body)) }, 201)
  }

  if (request.method === 'POST' && path === '/api/appointments') {
    limit(request, 'appointments', 8)
    const body = await readJson<Record<string, unknown>>(request, MAX_BODY_BYTES)
    const result = await pub.createAppointment(env, body)
    logSafe(env, 'appointment.requested', {
      emailWarning: Boolean(result.emailWarning),
    })
    return json(env, request, { ok: true, ...result }, 201)
  }

  if (request.method === 'POST' && path === '/api/admin/login') {
    limit(request, 'login', 8, 15 * 60_000)
    const body = await readJson<Record<string, unknown>>(request, MAX_BODY_BYTES)
    const result = await admin.login(env, body)
    return json(env, request, result.data, 200, { 'Set-Cookie': result.cookie })
  }

  if (request.method === 'POST' && path === '/api/admin/logout') {
    const result = await admin.logout(env, request)
    return json(env, request, { ok: true }, 200, { 'Set-Cookie': result.cookie })
  }

  if (path.startsWith('/api/admin')) {
    await requireAdmin(env, request)
    return handleAdmin(request, env, path)
  }

  throw new HttpError(404, 'Niet gevonden.')
}

async function handleAdmin(request: Request, env: WorkerEnv, path: string): Promise<Response> {
  const parts = path.replace('/api/admin/', '').split('/')
  const resource = parts[0] ?? ''
  const id = parts[1]
  const extra = parts[2]

  if (request.method === 'GET' && resource === 'session') {
    return json(env, request, await admin.session(env, request))
  }
  if (request.method === 'GET' && resource === 'dashboard') {
    return json(env, request, await admin.dashboard(env))
  }

  if (resource === 'appointments') {
    if (request.method === 'GET' && !id) return json(env, request, await admin.listAppointments(env))
    if (request.method === 'GET' && id) return json(env, request, await admin.getAppointment(env, id))
    if (request.method === 'POST' && !id) {
      const body = await readJson<Record<string, unknown>>(request, MAX_BODY_BYTES)
      return json(env, request, await admin.createAppointment(env, body), 201)
    }
    if (request.method === 'PATCH' && id && !extra) {
      const body = await readJson<Record<string, unknown>>(request, MAX_BODY_BYTES)
      return json(env, request, await admin.updateAppointment(env, id, body))
    }
  }

  if (resource === 'customers') {
    if (request.method === 'GET' && !id) return json(env, request, await admin.listCustomers(env))
    if (request.method === 'GET' && id) return json(env, request, await admin.getCustomer(env, id))
  }

  if (resource === 'quotes') {
    if (request.method === 'GET' && !id) return json(env, request, await admin.listQuotes(env))
    if (request.method === 'GET' && id) return json(env, request, await admin.getQuote(env, id))
    if (request.method === 'PATCH' && id) {
      const body = await readJson<Record<string, unknown>>(request, MAX_BODY_BYTES)
      return json(env, request, await admin.updateQuote(env, id, body))
    }
  }

  if (resource === 'contact') {
    if (request.method === 'GET' && !id) return json(env, request, await admin.listContacts(env))
    if (request.method === 'GET' && id) return json(env, request, await admin.getContact(env, id))
    if (request.method === 'PATCH' && id) {
      const body = await readJson<Record<string, unknown>>(request, MAX_BODY_BYTES)
      return json(env, request, await admin.updateContact(env, id, body))
    }
  }

  if (resource === 'emails') {
    if (request.method === 'GET' && !id) return json(env, request, await admin.listEmails(env))
    if (request.method === 'POST' && id === 'preview') {
      const body = await readJson<Record<string, unknown>>(request, MAX_BODY_BYTES)
      return json(env, request, await admin.previewEmail(body))
    }
    if (request.method === 'POST' && !id) {
      limit(request, 'admin-email', 20)
      const body = await readJson<Record<string, unknown>>(request, MAX_BODY_BYTES)
      return json(env, request, await admin.sendAdminEmail(env, body))
    }
  }

  if (resource === 'templates') {
    if (request.method === 'GET' && !id) return json(env, request, await admin.listTemplates(env))
    if (request.method === 'GET' && id) return json(env, request, await admin.getTemplate(env, id))
    if (request.method === 'PATCH' && id) {
      const body = await readJson<Record<string, unknown>>(request, MAX_BODY_BYTES)
      return json(env, request, await admin.updateTemplate(env, id, body))
    }
  }

  if (resource === 'settings') {
    if (request.method === 'GET') return json(env, request, await admin.getSettings(env, request))
    if (request.method === 'PATCH') {
      const body = await readJson<Record<string, unknown>>(request, MAX_BODY_BYTES)
      return json(env, request, await admin.updateSettings(env, body))
    }
  }

  throw new HttpError(404, 'Niet gevonden.')
}

function limit(request: Request, scope: string, max: number, windowMs = 10 * 60_000) {
  const result = rateLimit(clientKey(request, scope), max, windowMs)
  if (!result.ok) {
    throw new HttpError(429, 'Te veel verzoeken. Probeer het later opnieuw.')
  }
}

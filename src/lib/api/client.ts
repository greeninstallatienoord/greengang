export type ApiResult<T> =
  | { ok: true; data: T; confirmedByServer: true }
  | { ok: false; message: string; unavailable?: boolean }

function apiBase(): string {
  return (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  const url = `${apiBase()}${path}`
  try {
    const response = await fetch(url, {
      ...init,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    })
    const type = response.headers.get('content-type') ?? ''
    if (!type.includes('application/json')) {
      return {
        ok: false,
        unavailable: true,
        message: 'De serverkoppeling is nog niet beschikbaar.',
      }
    }
    const data = (await response.json()) as T & { error?: string; ok?: boolean }
    if (!response.ok) {
      return {
        ok: false,
        message: data.error ?? 'Versturen is niet gelukt. Probeer het opnieuw.',
      }
    }
    return { ok: true, data, confirmedByServer: true }
  } catch {
    return {
      ok: false,
      unavailable: true,
      message: 'Geen verbinding met de server.',
    }
  }
}

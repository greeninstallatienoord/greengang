type Bucket = { count: number; reset: number }

const buckets = new Map<string, Bucket>()

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now()
  const current = buckets.get(key)
  if (!current || current.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return { ok: true }
  }
  if (current.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((current.reset - now) / 1000) }
  }
  current.count += 1
  return { ok: true }
}

export function clientKey(request: Request, scope: string): string {
  const ip =
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
    'unknown'
  return `${scope}:${ip}`
}

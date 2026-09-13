import { useEffect, useState } from 'react'

/** Honeypot field name used by public forms — never persist in session drafts. */
function withoutHoneypot<T extends object>(value: T): T {
  if (!('website' in value)) return value
  const next = { ...value }
  delete (next as { website?: string }).website
  return next
}

export function useSessionDraft<T extends object>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = sessionStorage.getItem(key)
      if (!raw) return initial
      const parsed = JSON.parse(raw) as Partial<T>
      return withoutHoneypot({ ...initial, ...parsed })
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(withoutHoneypot(value)))
    } catch {
      // Quota or private mode: keep the form usable without persistence.
    }
  }, [key, value])

  function clearDraft() {
    try {
      sessionStorage.removeItem(key)
    } catch {
      // Ignore storage failures.
    }
  }

  return [value, setValue, clearDraft] as const
}

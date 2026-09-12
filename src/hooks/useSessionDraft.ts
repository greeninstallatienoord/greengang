import { useEffect, useState } from 'react'

export function useSessionDraft<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = sessionStorage.getItem(key)
      if (!raw) return initial
      return { ...initial, ...JSON.parse(raw) } as T
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
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

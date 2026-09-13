import { useEffect, useId, useRef, useState } from 'react'
import { TURNSTILE_SITE_KEY } from '../../config/turnstilePublic'
import { TURNSTILE_ACTION } from '../turnstileAction'

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string
      action?: string
      theme?: 'light' | 'dark' | 'auto'
      size?: 'normal' | 'flexible' | 'compact'
      callback?: (token: string) => void
      'error-callback'?: () => void
      'expired-callback'?: () => void
      'timeout-callback'?: () => void
    },
  ) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

type TurnstileFieldProps = {
  onToken: (token: string | null) => void
  resetSignal?: number
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let scriptPromise: Promise<void> | null = null

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-gin-turnstile]')
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('turnstile_script')), { once: true })
      return
    }
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.dataset.ginTurnstile = '1'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('turnstile_script'))
    document.head.appendChild(script)
  })
  return scriptPromise
}

export function TurnstileField({ onToken, resetSignal = 0 }: TurnstileFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  const [error, setError] = useState('')
  const labelId = useId()
  // Prefer Vite env when present; fall back to committed public site key so
  // production builds never ship without a client Turnstile configuration.
  const siteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY ?? TURNSTILE_SITE_KEY).trim()

  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  useEffect(() => {
    if (!siteKey || !hostRef.current) {
      setError('Beveiligingscontrole is niet geconfigureerd.')
      onTokenRef.current(null)
      return
    }

    let cancelled = false

    void loadTurnstileScript()
      .then(() => {
        if (cancelled || !hostRef.current || !window.turnstile) return
        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
        }
        hostRef.current.innerHTML = ''
        widgetIdRef.current = window.turnstile.render(hostRef.current, {
          sitekey: siteKey,
          action: TURNSTILE_ACTION,
          theme: 'light',
          size: 'flexible',
          callback: (token) => {
            setError('')
            onTokenRef.current(token)
          },
          'error-callback': () => {
            setError('Beveiligingscontrole mislukt. Vernieuw de pagina.')
            onTokenRef.current(null)
          },
          'expired-callback': () => {
            onTokenRef.current(null)
          },
          'timeout-callback': () => {
            onTokenRef.current(null)
          },
        })
      })
      .catch(() => {
        if (!cancelled) {
          setError('Beveiligingscontrole kon niet worden geladen.')
          onTokenRef.current(null)
        }
      })

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [siteKey])

  useEffect(() => {
    if (!resetSignal || !widgetIdRef.current || !window.turnstile) return
    window.turnstile.reset(widgetIdRef.current)
    onTokenRef.current(null)
  }, [resetSignal])

  return (
    <div className="grid gap-2">
      <p id={labelId} className="text-sm font-medium text-[var(--admin-ink)]">
        Beveiligingscontrole
      </p>
      <div
        ref={hostRef}
        className="min-h-[65px] w-full max-w-full overflow-hidden"
        aria-labelledby={labelId}
      />
      {error ? (
        <p className="text-sm text-[var(--admin-danger,#9b2c2c)]" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

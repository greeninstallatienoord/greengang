import { useEffect, useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Field, TextInput } from '../components/forms/Field'
import logo from '../assets/images/branding/logo.png'
import { business } from '../data/business'
import { api } from '../lib/api'
import { Notice } from './components/Notice'
import { TurnstileField } from './components/TurnstileField'
import { adminUrl } from './adminPath'

function sanitizeLoginError(message: string, unavailable?: boolean): string {
  if (unavailable) return message

  const lower = message.toLowerCase()
  if (
    lower.includes('beveiliging') ||
    lower.includes('robot') ||
    lower.includes('turnstile')
  ) {
    return 'De beveiligingscontrole is mislukt. Probeer het opnieuw.'
  }

  if (lower.includes('inlog') || lower.includes('wachtwoord') || lower.includes('onjuist')) {
    return 'De inloggegevens zijn niet correct.'
  }

  if (lower.includes('te vaak') || lower.includes('rate') || lower.includes('probeer later')) {
    return 'Te veel pogingen. Probeer het later opnieuw.'
  }

  return 'Inloggen is niet gelukt. Probeer het opnieuw.'
}

export function AdminLoginPage() {
  const navigate = useNavigate()
  const passwordToggleId = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [resetSignal, setResetSignal] = useState(0)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    document.title = 'Inloggen – beheer'
    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      document.head.appendChild(robots)
    }
    robots.setAttribute('content', 'noindex, nofollow')
  }, [])

  async function onSubmit() {
    if (busy) return
    if (!turnstileToken) {
      setError('De beveiligingscontrole is mislukt. Probeer het opnieuw.')
      return
    }

    setBusy(true)
    setError('')
    const result = await api.admin.login(email, password, turnstileToken)
    setBusy(false)

    if (!result.ok) {
      setError(sanitizeLoginError(result.message, result.unavailable))
      setTurnstileToken(null)
      setResetSignal((value) => value + 1)
      return
    }

    navigate(adminUrl('dashboard'))
  }

  return (
    <div className="admin-app min-h-dvh px-4 py-8 min-[360px]:px-5 sm:px-6 sm:py-12">
      <form
        className="mx-auto w-full max-w-[34rem] border border-[var(--admin-line)] bg-[var(--admin-panel)] px-5 py-6 shadow-[var(--admin-shadow)] min-[360px]:px-6 min-[360px]:py-7 sm:px-8 sm:py-8"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit()
        }}
      >
        <img
          src={logo}
          alt={business.businessName}
          width={160}
          height={40}
          className="h-9 w-auto sm:h-10"
        />

        <p className="mt-6 text-[0.6875rem] font-semibold tracking-[0.12em] text-[var(--admin-muted)] uppercase">
          Intern beheer
        </p>
        <h1 className="mt-2 text-[1.625rem] leading-tight font-semibold tracking-[-0.03em] text-[var(--admin-ink)] sm:text-[1.75rem]">
          Inloggen
        </h1>
        <p className="mt-2 max-w-[32ch] text-[0.9375rem] leading-relaxed text-[var(--admin-muted)] sm:max-w-none">
          Log in om afspraken, offertes, klanten en aanvragen te beheren.
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--admin-muted)]">
          Beveiligde beheeromgeving van {business.businessName}.
        </p>

        <div className="mt-7 grid gap-4 sm:mt-8 sm:gap-5">
          <Field id="admin-email" label="E-mail">
            <TextInput
              id="admin-email"
              type="email"
              name="username"
              autoComplete="username"
              inputMode="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-11 rounded-[var(--admin-radius)] text-base"
            />
          </Field>

          <Field id="admin-password" label="Wachtwoord">
            <div className="relative">
              <TextInput
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-11 rounded-[var(--admin-radius)] pr-12 text-base"
              />
              <button
                id={passwordToggleId}
                type="button"
                className="absolute top-1/2 right-1.5 flex size-10 -translate-y-1/2 items-center justify-center text-[var(--admin-muted)] transition-colors hover:text-[var(--admin-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--admin-accent)]"
                aria-label={showPassword ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.75} aria-hidden="true" />
                ) : (
                  <Eye size={18} strokeWidth={1.75} aria-hidden="true" />
                )}
              </button>
            </div>
          </Field>

          <TurnstileField onToken={setTurnstileToken} resetSignal={resetSignal} />

          <div aria-live="polite" aria-atomic="true">
            {error ? <Notice tone="error">{error}</Notice> : null}
          </div>

          <Button
            type="submit"
            disabled={busy || !turnstileToken}
            className="min-h-11 w-full rounded-[var(--admin-radius)] bg-[var(--admin-accent)] hover:bg-[#157a2d] disabled:hover:translate-y-0"
          >
            {busy ? 'Inloggen…' : 'Inloggen'}
          </Button>
        </div>

        <p className="mt-7 border-t border-[var(--admin-line)] pt-5 text-center text-[0.8125rem] text-[var(--admin-muted)]">
          {business.businessName} · Intern beheer
        </p>
      </form>
    </div>
  )
}

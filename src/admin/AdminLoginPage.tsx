import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Field, TextInput } from '../components/forms/Field'
import logo from '../assets/images/branding/logo.png'
import { business } from '../data/business'
import { api } from '../lib/api'
import { Notice } from './components/Notice'
import { adminUrl } from './adminPath'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    setBusy(true)
    setError('')
    const result = await api.admin.login(email, password)
    setBusy(false)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate(adminUrl('dashboard'))
  }

  return (
    <div className="admin-app flex min-h-dvh items-center justify-center px-4 py-10">
      <form
        className="w-full max-w-[26rem] border border-[var(--admin-line)] bg-[var(--admin-panel)] p-7 shadow-[0_10px_36px_rgb(16_36_24_/_0.08)]"
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit()
        }}
      >
        <img src={logo} alt="" className="h-10 w-auto" />
        <p className="mt-5 text-[11px] font-semibold tracking-[0.08em] text-[var(--admin-muted)] uppercase">
          Intern beheer
        </p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.03em]">Inloggen</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--admin-muted)]">
          Alleen voor {business.businessName}. Deze pagina staat niet in het publieke menu.
        </p>
        <div className="mt-6 grid gap-4">
          <Field id="admin-email" label="E-mail">
            <TextInput
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Field id="admin-password" label="Wachtwoord">
            <TextInput
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          {error ? <Notice tone="error">{error}</Notice> : null}
          <Button type="submit" disabled={busy}>
            {busy ? 'Bezig…' : 'Inloggen'}
          </Button>
        </div>
      </form>
    </div>
  )
}

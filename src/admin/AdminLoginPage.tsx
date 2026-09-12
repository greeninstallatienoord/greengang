import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Field, TextInput } from '../components/forms/Field'
import { api } from '../lib/api'
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
    <div className="flex min-h-dvh items-center justify-center bg-surface p-4">
      <form
        className="w-full max-w-md rounded-lg border border-line bg-paper p-6 shadow-card"
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit()
        }}
      >
        <h1 className="text-2xl font-semibold">Beheer inloggen</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Alleen voor Green Installatie Noord. Deze pagina staat niet in het
          publieke menu.
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
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" disabled={busy}>
            {busy ? 'Bezig…' : 'Inloggen'}
          </Button>
        </div>
      </form>
    </div>
  )
}

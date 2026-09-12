import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../lib/api'
import { adminUrl } from './adminPath'

type AdminAuthValue = {
  email: string
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null)

// Shared session email for the admin shell.
export function useAdminAuth(): AdminAuthValue {
  const value = useContext(AdminAuthContext)
  if (!value) throw new Error('AdminAuth ontbreekt.')
  return value
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const [state, setState] = useState<'loading' | 'in' | 'out'>('loading')
  const [email, setEmail] = useState('')

  useEffect(() => {
    void api.admin.session().then((result) => {
      if (result.ok) {
        setEmail(result.data.email)
        setState('in')
      } else {
        setState('out')
      }
    })
  }, [])

  if (state === 'loading') {
    return <p className="p-6 text-sm text-ink-muted">Beheer wordt geladen…</p>
  }
  if (state === 'out') return <Navigate to={adminUrl('login')} replace />
  return <AdminAuthContext.Provider value={{ email }}>{children}</AdminAuthContext.Provider>
}

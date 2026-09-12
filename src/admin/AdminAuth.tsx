import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../lib/api'
import { adminUrl } from './adminPath'

type AdminAuthValue = {
  email: string
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null)

export function useAdminAuth(): AdminAuthValue {
  const value = useContext(AdminAuthContext)
  if (!value) throw new Error('AdminAuth ontbreekt.')
  return value
}

function AuthLoading() {
  return (
    <div className="admin-app flex min-h-dvh items-center justify-center px-6">
      <p className="text-sm text-[var(--admin-muted)]">Beheer wordt geladen…</p>
    </div>
  )
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

  if (state === 'loading') return <AuthLoading />
  if (state === 'out') return <Navigate to={adminUrl('login')} replace />
  return <AdminAuthContext.Provider value={{ email }}>{children}</AdminAuthContext.Provider>
}

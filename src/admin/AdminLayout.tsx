import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '../assets/images/branding/logo.png'
import { business } from '../data/business'
import { api } from '../lib/api'
import { useAdminAuth } from './AdminAuth'
import { adminUrl } from './adminPath'

const links = [
  { to: 'dashboard', label: 'Dashboard' },
  { to: 'appointments', label: 'Afspraken' },
  { to: 'customers', label: 'Klanten' },
  { to: 'quotes', label: 'Offertes' },
  { to: 'contact', label: 'Contact' },
  { to: 'emails', label: 'E-mails' },
  { to: 'templates', label: 'Templates' },
  { to: 'settings', label: 'Instellingen' },
]

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { email } = useAdminAuth()
  const drawerRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    document.title = 'Beheer – Green Installatie Noord'
    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      document.head.appendChild(robots)
    }
    robots.setAttribute('content', 'noindex, nofollow')
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const drawer = drawerRef.current
    const focusable = () =>
      drawer?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )

    const items = focusable()
    items?.[0]?.focus()

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
      if (event.key !== 'Tab' || !drawer) return
      const nodes = [...(focusable() ?? [])]
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function logout() {
    await api.admin.logout()
    navigate(adminUrl('login'))
  }

  const nav = (
    <nav aria-label="Beheer" className="grid gap-1">
      {links.map((item) => (
        <NavLink
          key={item.to}
          to={adminUrl(item.to)}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `min-h-11 rounded-md px-3 py-2 text-sm font-medium ${
              isActive ? 'bg-brand-soft text-brand-dark' : 'hover:bg-brand-soft/60'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
      <button
        type="button"
        className="mt-3 min-h-11 rounded-md px-3 text-left text-sm font-semibold text-danger hover:bg-brand-soft/40"
        onClick={() => void logout()}
      >
        Uitloggen
      </button>
    </nav>
  )

  return (
    <div className="min-h-dvh bg-surface text-ink">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-paper px-4 py-2.5 lg:hidden">
        <Link to={adminUrl('dashboard')} className="inline-flex min-w-0 items-center gap-2">
          <img src={logo} alt="" className="h-8 w-auto" />
          <span className="truncate text-sm font-semibold">{business.businessName}</span>
        </Link>
        <button
          ref={buttonRef}
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md border border-line"
          aria-expanded={open}
          aria-controls="admin-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
          <span className="sr-only">{open ? 'Menu sluiten' : 'Menu openen'}</span>
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Menu sluiten"
            onClick={() => setOpen(false)}
          />
          <aside
            id="admin-menu"
            ref={drawerRef}
            className="absolute inset-y-0 left-0 w-[min(20rem,88vw)] overflow-y-auto border-r border-line bg-paper p-4 motion-safe:animate-[adminDrawer_180ms_ease-out]"
          >
            <p id={titleId} className="mb-3 text-sm font-semibold">
              Menu
            </p>
            {nav}
          </aside>
        </div>
      ) : null}

      <div className="lg:grid lg:grid-cols-[15.5rem_1fr]">
        <aside className="hidden min-h-dvh border-r border-line bg-paper p-4 lg:block">
          <Link to={adminUrl('dashboard')} className="mb-6 flex items-center gap-2">
            <img src={logo} alt="" className="h-8 w-auto" />
            <span className="text-sm font-semibold leading-tight">{business.businessName}</span>
          </Link>
          <p id={`${titleId}-desk`} className="sr-only">
            Beheer
          </p>
          {nav}
          <p className="mt-8 truncate text-xs text-ink-muted">{email}</p>
        </aside>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

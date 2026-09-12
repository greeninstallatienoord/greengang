import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  NotebookPen,
  Settings,
  Users,
  X,
} from 'lucide-react'
import logo from '../assets/images/branding/logo.png'
import { business } from '../data/business'
import { api } from '../lib/api'
import { useAdminAuth } from './AdminAuth'
import { adminUrl } from './adminPath'

const links = [
  { to: 'dashboard', label: 'Overzicht', icon: LayoutDashboard },
  { to: 'appointments', label: 'Afspraken', icon: CalendarDays },
  { to: 'quotes', label: 'Offertes', icon: FileText },
  { to: 'customers', label: 'Klanten', icon: Users },
  { to: 'contact', label: 'Contactaanvragen', icon: Inbox },
  { to: 'emails', label: 'E-mails', icon: Mail },
  { to: 'templates', label: 'Templates', icon: NotebookPen },
  { to: 'settings', label: 'Instellingen', icon: Settings },
]

function pageTitle(pathname: string): string {
  if (pathname.includes('/emails/logs')) return 'Verzonden'
  if (pathname.includes('/templates')) return 'Templates'
  const match = links.find((item) => pathname.includes(`/${item.to}`))
  return match?.label ?? 'Beheer'
}

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { email } = useAdminAuth()
  const drawerRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    document.title = 'Beheer - Green Installatie Noord'
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
    <nav aria-label="Beheer" className="grid gap-0.5">
      {links.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={adminUrl(item.to)}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `relative flex min-h-11 items-center gap-3 px-3 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-white/12 text-white before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:bg-[#7cbc86]'
                  : 'text-[var(--admin-sidebar-text)]/80 hover:bg-white/6 hover:text-white'
              }`
            }
          >
            <Icon size={17} aria-hidden="true" />
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )

  const account = (
    <div className="mt-auto border-t border-white/10 pt-4">
      <p className="truncate px-3 text-xs text-[var(--admin-sidebar-muted)]">{email}</p>
      <button
        type="button"
        className="mt-2 flex min-h-11 w-full items-center gap-3 px-3 text-left text-sm font-medium text-[var(--admin-sidebar-text)]/85 transition-colors duration-150 hover:bg-white/6 hover:text-white"
        onClick={() => void logout()}
      >
        <LogOut size={17} aria-hidden="true" />
        Uitloggen
      </button>
    </div>
  )

  return (
    <div className="admin-app">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--admin-line)] bg-[var(--admin-panel)] px-4 py-2.5 lg:hidden">
        <Link to={adminUrl('dashboard')} className="inline-flex min-w-0 items-center gap-2.5">
          <img src={logo} alt="" className="h-8 w-auto" />
          <span className="truncate text-sm font-semibold">{pageTitle(location.pathname)}</span>
        </Link>
        <button
          ref={buttonRef}
          type="button"
          className="inline-flex size-11 items-center justify-center border border-[var(--admin-line)]"
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
            className="admin-dialog-backdrop absolute inset-0 bg-[#102418]/50"
            aria-label="Menu sluiten"
            onClick={() => setOpen(false)}
          />
          <aside
            id="admin-menu"
            ref={drawerRef}
            className="absolute inset-y-0 left-0 flex w-[min(19.5rem,88vw)] flex-col bg-[var(--admin-sidebar)] p-4 text-white motion-safe:animate-[adminDrawer_180ms_ease-out]"
          >
            <p id={titleId} className="mb-4 px-3 text-xs font-semibold tracking-[0.08em] uppercase text-[var(--admin-sidebar-muted)]">
              Menu
            </p>
            {nav}
            {account}
          </aside>
        </div>
      ) : null}

      <div className="lg:grid lg:grid-cols-[16.5rem_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col bg-[var(--admin-sidebar)] p-4 text-white lg:flex">
          <Link to={adminUrl('dashboard')} className="mb-7 flex items-center gap-2.5 px-2">
            <img src={logo} alt="" className="h-9 w-auto" />
            <span className="text-sm leading-tight font-semibold">
              {business.businessName}
              <span className="mt-0.5 block text-[11px] font-medium tracking-[0.06em] text-[var(--admin-sidebar-muted)] uppercase">
                Intern beheer
              </span>
            </span>
          </Link>
          <p id={`${titleId}-desk`} className="sr-only">
            Beheer
          </p>
          {nav}
          {account}
        </aside>
        <div className="min-w-0">
          <div className="hidden items-center justify-between border-b border-[var(--admin-line)] bg-[var(--admin-panel)] px-6 py-3 lg:flex">
            <p className="text-sm text-[var(--admin-muted)]">{pageTitle(location.pathname)}</p>
            <p className="truncate text-sm text-[var(--admin-ink)]">{email}</p>
          </div>
          <main className="mx-auto w-full max-w-[72rem] px-4 py-5 sm:px-6 sm:py-7">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

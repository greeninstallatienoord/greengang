import { Suspense, useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  CircleHelp,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  MoreHorizontal,
  NotebookPen,
  Plus,
  Settings,
  Users,
  X,
} from 'lucide-react'
import logo from '../assets/images/branding/logo.png'
import { business } from '../data/business'
import { api } from '../lib/api'
import { AdminRouteFallback } from '../components/loading/BrandLoader'
import { useAdminAuth } from './AdminAuth'
import { adminUrl } from './adminPath'

const primaryLinks = [
  { to: 'dashboard', label: 'Overzicht', icon: LayoutDashboard, match: ['dashboard'] },
  { to: 'appointments', label: 'Afspraken', icon: CalendarDays, match: ['appointments'] },
  { to: 'quotes', label: 'Offertes', icon: FileText, match: ['quotes'] },
  { to: 'customers', label: 'Klanten', icon: Users, match: ['customers'] },
] as const

const moreLinks = [
  { to: 'calendar', label: 'Agenda', icon: CalendarDays },
  { to: 'contact', label: 'Contactaanvragen', icon: Inbox },
  { to: 'emails', label: 'E-mails', icon: Mail },
  { to: 'templates', label: 'Templates', icon: NotebookPen },
  { to: 'settings', label: 'Instellingen', icon: Settings },
  { to: 'website-info', label: 'Website & mogelijkheden', icon: CircleHelp },
] as const

const allLinks = [...primaryLinks, ...moreLinks]

function pageTitle(pathname: string): string {
  if (pathname.includes('/emails/logs')) return 'Verzonden'
  if (pathname.includes('/appointments/new')) return 'Nieuwe afspraak'
  if (pathname.includes('/calendar')) return 'Agenda'
  const match = allLinks.find((item) => pathname.includes(`/${item.to}`))
  return match?.label ?? 'Beheer'
}

function pathActive(pathname: string, match: readonly string[]): boolean {
  return match.some((slug) => pathname.includes(`/${slug}`))
}

export function AdminLayout() {
  const [moreOpen, setMoreOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { email } = useAdminAuth()
  const sheetRef = useRef<HTMLDivElement>(null)
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const title = pageTitle(location.pathname)
  const moreActive = moreLinks.some((item) => location.pathname.includes(`/${item.to}`))

  useEffect(() => {
    document.title = `${title} – Beheer`
    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      document.head.appendChild(robots)
    }
    robots.setAttribute('content', 'noindex, nofollow')
  }, [title])

  useEffect(() => {
    if (!moreOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    sheetRef.current?.querySelector<HTMLElement>('a, button')?.focus()

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMoreOpen(false)
        moreButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [moreOpen])

  async function logout() {
    await api.admin.logout()
    navigate(adminUrl('login'))
  }

  const desktopNav = (
    <nav aria-label="Beheer" className="grid gap-0.5">
      {allLinks.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={adminUrl(item.to)}
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

  return (
    <div className="admin-app">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--admin-line)] bg-[var(--admin-panel)] px-3 py-2.5 min-[360px]:px-4 lg:hidden">
        <Link to={adminUrl('dashboard')} className="inline-flex min-w-0 items-center gap-2.5">
          <img src={logo} alt="" className="h-8 w-auto" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{title}</span>
            <span className="block text-[10px] font-semibold tracking-[0.08em] text-[var(--admin-muted)] uppercase">
              Intern beheer
            </span>
          </span>
        </Link>
        {location.pathname.includes('/appointments') && !location.pathname.includes('/new') ? (
          <Link
            to={adminUrl('appointments/new')}
            className="inline-flex size-11 items-center justify-center border border-[var(--admin-line)] bg-[var(--admin-panel)] text-[var(--admin-ink)]"
            aria-label="Nieuwe afspraak"
          >
            <Plus size={18} />
          </Link>
        ) : null}
      </header>

      <div className="lg:grid lg:grid-cols-[15.75rem_minmax(0,1fr)]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh flex-col bg-[var(--admin-sidebar)] p-4 text-white lg:flex">
          <Link to={adminUrl('dashboard')} className="mb-6 flex items-center gap-2.5 px-2">
            <img src={logo} alt="" className="h-9 w-auto" />
            <span className="text-sm leading-tight font-semibold">
              {business.businessName}
              <span className="mt-0.5 block text-[11px] font-medium tracking-[0.06em] text-[var(--admin-sidebar-muted)] uppercase">
                Intern beheer
              </span>
            </span>
          </Link>
          <div className="min-h-0 flex-1 overflow-y-auto">{desktopNav}</div>
          <div className="mt-4 border-t border-white/10 pt-4">
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
        </aside>

        <div className="min-w-0">
          <div className="hidden items-center justify-between border-b border-[var(--admin-line)] bg-[var(--admin-panel)] px-6 py-3 lg:flex">
            <div>
              <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-[var(--admin-muted)] uppercase">
                Beheer
              </p>
              <p className="text-sm font-semibold text-[var(--admin-ink)]">{title}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={adminUrl('appointments/new')}
                className="inline-flex min-h-10 items-center gap-1.5 border border-[var(--admin-line)] px-3 text-sm font-semibold hover:bg-[var(--admin-hover)]"
              >
                <Plus size={15} aria-hidden="true" />
                Afspraak
              </Link>
              <Link
                to={`${adminUrl('emails')}#compose`}
                className="inline-flex min-h-10 items-center gap-1.5 border border-[var(--admin-line)] px-3 text-sm font-semibold hover:bg-[var(--admin-hover)]"
              >
                <Mail size={15} aria-hidden="true" />
                E-mail
              </Link>
              <p className="max-w-[14rem] truncate text-sm text-[var(--admin-muted)]">{email}</p>
            </div>
          </div>

          <main className="admin-main mx-auto w-full max-w-[76rem] px-3.5 py-4 min-[360px]:px-4 sm:px-6 sm:py-6">
            <Suspense fallback={<AdminRouteFallback />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Hoofdnavigatie"
        className="admin-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t border-[var(--admin-line)] bg-[var(--admin-panel)] lg:hidden"
      >
        <ul className="grid grid-cols-5">
          {primaryLinks.map((item) => {
            const Icon = item.icon
            const active = pathActive(location.pathname, item.match)
            return (
              <li key={item.to}>
                <NavLink
                  to={adminUrl(item.to)}
                  onClick={() => setMoreOpen(false)}
                  className={`flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-semibold ${
                    active ? 'text-[var(--admin-accent)]' : 'text-[var(--admin-muted)]'
                  }`}
                >
                  <Icon size={20} strokeWidth={active ? 2.1 : 1.7} aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              </li>
            )
          })}
          <li>
            <button
              ref={moreButtonRef}
              type="button"
              className={`flex min-h-[3.5rem] w-full flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-semibold ${
                moreOpen || moreActive ? 'text-[var(--admin-accent)]' : 'text-[var(--admin-muted)]'
              }`}
              aria-expanded={moreOpen}
              aria-controls="admin-more-sheet"
              onClick={() => setMoreOpen((value) => !value)}
            >
              <MoreHorizontal size={20} strokeWidth={moreOpen || moreActive ? 2.1 : 1.7} aria-hidden="true" />
              Meer
            </button>
          </li>
        </ul>
      </nav>

      {moreOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="admin-dialog-backdrop absolute inset-0 bg-[#102418]/45"
            aria-label="Menu sluiten"
            onClick={() => setMoreOpen(false)}
          />
          <div
            id="admin-more-sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="admin-dialog-panel absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[0.5rem] border border-[var(--admin-line)] bg-[var(--admin-panel)] pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[var(--admin-shadow)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--admin-line)] px-4 py-3">
              <div>
                <p id={titleId} className="text-base font-semibold">
                  Meer
                </p>
                <p className="text-xs text-[var(--admin-muted)]">{email}</p>
              </div>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center border border-[var(--admin-line)]"
                aria-label="Sluiten"
                onClick={() => setMoreOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <nav className="grid p-2" aria-label="Extra beheer">
              {moreLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.to}
                    to={adminUrl(item.to)}
                    className="flex min-h-12 items-center gap-3 px-3 text-sm font-semibold hover:bg-[var(--admin-hover)]"
                    onClick={() => setMoreOpen(false)}
                  >
                    <Icon size={18} aria-hidden="true" />
                    {item.label}
                  </Link>
                )
              })}
              <button
                type="button"
                className="flex min-h-12 items-center gap-3 px-3 text-left text-sm font-semibold text-[var(--admin-danger)] hover:bg-[var(--admin-hover)]"
                onClick={() => void logout()}
              >
                <LogOut size={18} aria-hidden="true" />
                Uitloggen
              </button>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  )
}

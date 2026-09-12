import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { CalendarDays, FileText, Phone, Plus, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { isFormPath } from '../../data/navigation'
import { site } from '../../data/site'
import { cn } from '../../lib/cn'

const actions = [
  {
    key: 'appointment',
    href: '/afspraak-maken',
    external: false,
    label: 'Afspraak maken',
    detail: 'Kies een voorkeursmoment',
    icon: CalendarDays,
  },
  {
    key: 'quote',
    href: '/offerte-aanvragen',
    external: false,
    label: 'Offerte aanvragen',
    detail: 'Vrijblijvend voorstel',
    icon: FileText,
  },
  {
    key: 'call',
    href: site.contact.phoneHref,
    external: true,
    label: 'Bel ons',
    detail: site.contact.phone,
    icon: Phone,
  },
] as const

type FloatingContactMenuProps = {
  lifted?: boolean
}

export function FloatingContactMenu({ lifted = false }: FloatingContactMenuProps) {
  const { pathname } = useLocation()
  const [openFor, setOpenFor] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const open = openFor === pathname
  useFocusTrap(open, rootRef)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenFor(null)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenFor(null)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (isFormPath(pathname)) return null

  return (
    <div
      ref={rootRef}
      className={cn(
        'fab-root pointer-events-none fixed right-[max(1rem,env(safe-area-inset-right))] z-[45]',
        lifted
          ? 'bottom-[calc(var(--cookie-banner-offset)+1rem)]'
          : 'bottom-[max(1.25rem,calc(env(safe-area-inset-bottom)+1rem))]',
      )}
    >
      <ul
        id={menuId}
        hidden={!open}
        role="menu"
        aria-label="Contactopties"
        className="absolute bottom-[calc(100%+0.75rem)] right-0 flex max-h-[min(20rem,calc(100dvh-var(--cookie-banner-offset)-7.5rem))] w-[min(17.75rem,calc(100vw-2.5rem))] flex-col gap-2 overflow-y-auto overscroll-contain"
      >
        {actions.map((action, index) => {
          const Icon = action.icon
          const className = cn(
            'fab-item pointer-events-auto flex min-h-12 touch-manipulation items-center gap-3 border border-line bg-paper px-3 py-2.5 text-left hover:bg-stone',
            open && 'is-visible',
          )
          const style = { '--fab-delay': `${index * 40}ms` } as CSSProperties
          const content = (
            <>
              <span className="icon-mark size-10 bg-brand-soft">
                <Icon size={17} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold tracking-[-0.01em]">{action.label}</span>
                <span className="mt-0.5 block text-xs leading-snug text-ink-muted">{action.detail}</span>
              </span>
            </>
          )

          return (
            <li key={action.key} role="none">
              {action.external ? (
                <a
                  href={action.href}
                  role="menuitem"
                  className={className}
                  style={style}
                  onClick={() => setOpenFor(null)}
                >
                  {content}
                </a>
              ) : (
                <Link
                  to={action.href}
                  role="menuitem"
                  className={className}
                  style={style}
                  onClick={() => setOpenFor(null)}
                >
                  {content}
                </Link>
              )}
            </li>
          )
        })}
      </ul>

      <button
        ref={toggleRef}
        type="button"
        className="pointer-events-auto inline-flex size-14 touch-manipulation items-center justify-center rounded-full bg-brand text-white shadow-lift transition-[background-color] duration-[var(--duration-base)] hover:bg-brand-dark"
        aria-label={open ? 'Contactopties sluiten' : 'Contactopties openen'}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={() => setOpenFor(open ? null : pathname)}
      >
        <span className="relative size-6">
          <Plus
            size={22}
            strokeWidth={1.7}
            aria-hidden="true"
            className={cn(
              'fab-icon absolute inset-0 m-auto',
              open ? 'rotate-45 opacity-0' : 'rotate-0 opacity-100',
            )}
          />
          <X
            size={22}
            strokeWidth={1.7}
            aria-hidden="true"
            className={cn(
              'fab-icon absolute inset-0 m-auto',
              open ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0',
            )}
          />
        </span>
      </button>
    </div>
  )
}

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { serviceIcons } from '../../data/serviceIcons'
import { serviceNav } from '../../data/navigation'
import { services } from '../../data/services'
import { cn } from '../../lib/cn'

export function ServicesMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={cn('nav-link inline-flex items-center gap-1', open && 'text-ink')}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        Diensten
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          aria-hidden="true"
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-[22rem] border border-line bg-paper p-2 shadow-card"
          style={{ animation: 'menu-in 180ms ease both' }}
        >
          {serviceNav.map((item) => {
            const service = services.find((entry) => entry.href === item.href)
            const Icon = service ? serviceIcons[service.slug] : null
            return (
              <NavLink
                key={item.href}
                to={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex gap-3 rounded-sm px-3 py-2.5 hover:bg-stone',
                    isActive && 'bg-brand-soft',
                  )
                }
              >
                {Icon ? (
                  <span className="mt-0.5 text-brand-dark">
                    <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                ) : null}
                <span>
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-ink-muted">
                    {item.summary}
                  </span>
                </span>
              </NavLink>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

import { FileText, PenLine, Send } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { adminUrl } from '../adminPath'

const items = [
  { to: 'emails', label: 'Opstellen', end: true, icon: PenLine },
  { to: 'templates', label: 'Templates', end: false, icon: FileText },
  { to: 'emails/logs', label: 'Verzonden', end: false, icon: Send },
]

export function EmailCenterNav() {
  return (
    <nav aria-label="E-mailcentrum" className="mb-6 flex gap-1 overflow-x-auto pb-0.5">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={adminUrl(item.to)}
            end={item.end}
            className={({ isActive }) =>
              `inline-flex min-h-11 shrink-0 items-center gap-2 px-3.5 text-sm font-semibold transition-colors duration-150 ${
                isActive
                  ? 'bg-[#102418] text-white'
                  : 'border border-[var(--admin-line)] bg-[var(--admin-panel)] text-[var(--admin-ink)] hover:bg-[var(--admin-hover)]'
              }`
            }
          >
            <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )
}

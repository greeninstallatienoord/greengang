import { useRef } from 'react'
import { Clock3, Mail, Phone, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { headerNav, mobileExtraNav, serviceNav } from '../../data/navigation'
import { serviceIcons } from '../../data/serviceIcons'
import { services } from '../../data/services'
import { site } from '../../data/site'
import { ButtonLink } from '../ButtonLink'
import { BrandLogo } from '../media/BrandLogo'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useFocusTrap(open, panelRef)

  return (
    <div className="lg:hidden">
      <div
        className={cn(
          'fixed inset-0 z-[65] bg-ink/45 transition-opacity duration-[var(--duration-base)] motion-reduce:transition-none',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        id="mobile-navigatie"
        ref={panelRef}
        role="dialog"
        aria-modal={open}
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          'fixed inset-y-0 right-0 z-[70] flex w-[min(22rem,92vw)] flex-col bg-paper shadow-lift transition-transform duration-[var(--duration-base)] motion-reduce:transition-none',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <BrandLogo compact />
          <button
            type="button"
            className="inline-flex size-11 touch-manipulation items-center justify-center border border-line"
            onClick={onClose}
          >
            <X size={20} strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">Menu sluiten</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-4 py-5">
          <nav aria-label="Mobiel menu">
            <p className="eyebrow">Diensten</p>
            <ul className="mt-2 grid">
              {serviceNav.map((item) => {
                const service = services.find((entry) => entry.href === item.href)
                const Icon = service ? serviceIcons[service.slug] : null
                return (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          'flex min-h-12 items-center gap-3 border-b border-line text-[1.05rem] font-semibold',
                          isActive && 'text-brand-dark',
                        )
                      }
                      tabIndex={open ? undefined : -1}
                      onClick={onClose}
                    >
                      {Icon ? (
                        <Icon
                          size={18}
                          strokeWidth={1.6}
                          className="text-brand-dark"
                          aria-hidden="true"
                        />
                      ) : null}
                      {item.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>

            <p className="eyebrow mt-6">Pagina’s</p>
            <ul className="mt-2 grid">
              {[...headerNav, ...mobileExtraNav].map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-11 items-center text-base font-medium',
                        isActive && 'text-brand-dark',
                      )
                    }
                    tabIndex={open ? undefined : -1}
                    onClick={onClose}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="mt-6 grid gap-1 border-t border-line pt-4 text-sm">
            <li>
              <a
                href={site.contact.phoneHref}
                className="inline-flex min-h-11 items-center gap-2 font-medium"
                tabIndex={open ? undefined : -1}
              >
                <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={site.contact.emailHref}
                className="inline-flex min-h-11 items-center gap-2 font-medium"
                tabIndex={open ? undefined : -1}
              >
                <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
                {site.contact.email}
              </a>
            </li>
            <li className="inline-flex min-h-11 items-center gap-2 text-ink-muted">
              <Clock3 size={16} strokeWidth={1.75} aria-hidden="true" />
              {site.contact.openingHours}
            </li>
          </ul>
        </div>

        <div className="grid gap-2 border-t border-line px-4 py-3 pb-[max(0.85rem,env(safe-area-inset-bottom))]">
          <ButtonLink
            to="/offerte-aanvragen"
            className="w-full min-h-12"
            tabIndex={open ? undefined : -1}
            onClick={onClose}
          >
            {site.copy.ctaQuote}
          </ButtonLink>
          <ButtonLink
            to="/afspraak-maken"
            variant="secondary"
            className="w-full min-h-12"
            tabIndex={open ? undefined : -1}
            onClick={onClose}
          >
            {site.copy.ctaAppointment}
          </ButtonLink>
          <ButtonLink
            to={site.contact.phoneHref}
            variant="ghost"
            className="w-full min-h-11"
            external
            tabIndex={open ? undefined : -1}
            onClick={onClose}
          >
            Bel {site.contact.phone}
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}

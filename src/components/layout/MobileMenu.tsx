import { useRef } from 'react'
import { Clock3, Headphones, Phone } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { business } from '../../data/business'
import { cn } from '../../lib/cn'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { headerNav, serviceNav } from '../../data/navigation'
import { site } from '../../data/site'
import { ButtonLink } from '../ButtonLink'

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
          'fixed inset-0 z-[65] bg-ink/40 transition-opacity duration-[200ms] motion-reduce:transition-none',
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
          'fixed inset-y-0 right-0 z-[70] flex w-[min(20.5rem,100vw)] flex-col bg-paper shadow-lift transition-transform duration-[200ms] motion-reduce:transition-none',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="border-b border-line px-4 py-3.5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
            Navigatie
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-auto overscroll-contain px-4 py-2">
          <nav aria-label="Mobiel menu">
            <ul className="grid">
              <li>
                <details className="group border-b border-line" open>
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-[1.02rem] font-semibold tracking-[-0.01em] marker:content-none [&::-webkit-details-marker]:hidden">
                    Diensten
                    <span
                      className="text-ink-muted transition-transform duration-[var(--duration-fast)] group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <ul className="pb-1.5">
                    {serviceNav.map((item) => (
                      <li key={item.href}>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            cn(
                              'flex min-h-11 items-center pl-3 text-[0.95rem] font-medium text-ink-muted',
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
                </details>
              </li>
              {headerNav.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-12 items-center border-b border-line text-[1.02rem] font-semibold tracking-[-0.01em]',
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

          <ul className="mt-4 grid gap-0 border-t border-line pt-3 text-sm text-ink-muted">
            <li>
              <a
                href={site.contact.phoneHref}
                className="inline-flex min-h-11 items-center gap-2 font-medium text-ink"
                tabIndex={open ? undefined : -1}
              >
                <Phone size={15} strokeWidth={1.75} aria-hidden="true" />
                {site.contact.phone}
              </a>
            </li>
            {business.emergencyService.available ? (
              <li>
                <a
                  href={business.emergencyService.phoneHref}
                  className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-dark"
                  tabIndex={open ? undefined : -1}
                  aria-label={`${business.emergencyService.label}: bel ${business.emergencyService.phone}`}
                >
                  <Headphones size={15} strokeWidth={1.75} aria-hidden="true" />
                  {business.emergencyService.label}
                </a>
              </li>
            ) : null}
            <li className="inline-flex min-h-10 items-center gap-2">
              <Clock3 size={15} strokeWidth={1.75} aria-hidden="true" />
              <span>
                <span className="text-ink-muted">Regulier </span>
                {site.contact.openingHours.replace(/-/g, '–')}
              </span>
            </li>
          </ul>
        </div>

        <div className="border-t border-line px-4 py-3 pb-[max(0.85rem,env(safe-area-inset-bottom))]">
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
            variant="ghost"
            className="mt-1 w-full min-h-11 justify-center font-semibold text-ink-muted hover:bg-transparent hover:text-ink"
            tabIndex={open ? undefined : -1}
            onClick={onClose}
          >
            {site.copy.ctaAppointment}
          </ButtonLink>
        </div>
      </div>
    </div>
  )
}

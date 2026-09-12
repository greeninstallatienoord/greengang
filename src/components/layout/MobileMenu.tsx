import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { mainNav } from '../../data/navigation'
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
    <div
      id="mobile-navigatie"
      ref={panelRef}
      hidden={!open}
      className="absolute inset-x-0 top-full z-40 max-h-[min(75dvh,calc(100dvh-7rem))] overflow-auto border-t border-line bg-paper px-4 py-4 shadow-card xl:hidden"
    >
      <nav aria-label="Mobiel menu">
        <ul className="grid gap-1">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="block rounded-md px-3 py-3 text-base font-medium hover:bg-brand-soft"
                onClick={onClose}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/veelgestelde-vragen"
              className="block rounded-md px-3 py-3 text-base font-medium hover:bg-brand-soft"
              onClick={onClose}
            >
              Veelgestelde vragen
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-4 grid gap-2">
        <ButtonLink to="/offerte-aanvragen" className="w-full" onClick={onClose}>
          {site.copy.ctaQuote}
        </ButtonLink>
        <ButtonLink
          to="/afspraak-maken"
          variant="secondary"
          className="w-full"
          onClick={onClose}
        >
          {site.copy.ctaAppointment}
        </ButtonLink>
        <ButtonLink to="/contact" variant="ghost" className="w-full" onClick={onClose}>
          {site.copy.ctaContact}
        </ButtonLink>
      </div>
    </div>
  )
}

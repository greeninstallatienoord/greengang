import { CalendarDays, FileText, Phone } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { isFormPath } from '../../data/navigation'
import { site } from '../../data/site'

export function MobileActionBar() {
  const { pathname } = useLocation()
  const onFormPage = isFormPath(pathname)

  if (onFormPage) return null

  const phoneHref = site.contact.phoneHref

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden">
      <div className="grid grid-cols-3 gap-2">
        {phoneHref ? (
          <a
            href={phoneHref}
            aria-label={site.copy.ctaCall}
            className="inline-flex min-h-12 flex-col items-center justify-center rounded-md bg-brand-soft px-1 text-center text-xs font-semibold leading-tight text-brand-dark"
          >
            <Phone size={16} aria-hidden="true" />
            Bel
          </a>
        ) : (
          <Link
            to="/contact"
            aria-label={site.copy.ctaCall}
            className="inline-flex min-h-12 flex-col items-center justify-center rounded-md bg-brand-soft px-1 text-center text-xs font-semibold leading-tight text-brand-dark"
          >
            <Phone size={16} aria-hidden="true" />
            Bel
          </Link>
        )}
        <Link
          to="/offerte-aanvragen"
          aria-label={site.copy.ctaQuote}
          className="inline-flex min-h-12 flex-col items-center justify-center rounded-md bg-brand px-1 text-center text-xs font-semibold leading-tight text-white"
        >
          <FileText size={16} aria-hidden="true" />
          Offerte
        </Link>
        <Link
          to="/afspraak-maken"
          aria-label={site.copy.ctaAppointment}
          className="inline-flex min-h-12 flex-col items-center justify-center rounded-md border border-line px-1 text-center text-xs font-semibold leading-tight"
        >
          <CalendarDays size={16} aria-hidden="true" />
          Afspraak
        </Link>
      </div>
    </div>
  )
}

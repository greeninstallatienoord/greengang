import { Link, useLocation } from 'react-router-dom'
import { isFormPath } from '../../data/navigation'
import { cn } from '../../lib/cn'
import { Button } from '../Button'
import { Container } from '../Container'

type CookieBannerProps = {
  onAccept: () => void
  onReject: () => void
  onPreferences: () => void
}

export function CookieBanner({
  onAccept,
  onReject,
  onPreferences,
}: CookieBannerProps) {
  const { pathname } = useLocation()
  const aboveActionBar = !isFormPath(pathname)

  return (
    <div
      className={cn(
        'fixed inset-x-0 z-50 border-t border-line bg-paper shadow-card lg:bottom-0',
        aboveActionBar ? 'bottom-16' : 'bottom-0',
      )}
      role="region"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
    >
      <Container className="flex flex-col gap-4 py-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 id="cookie-title" className="text-base font-semibold">
            Cookies op deze website
          </h2>
          <p id="cookie-text" className="mt-1 text-sm text-ink-muted">
            We slaan uw keuze op, zodat deze melding niet elke keer terugkomt.
            Extra cookies voor voorkeuren, statistieken of marketing zetten we
            alleen aan als u dat wilt. Een banner maakt de site niet automatisch
            juridisch sluitend.{' '}
            <Link to="/cookies" className="underline">
              Meer over cookies
            </Link>{' '}
            ·{' '}
            <Link to="/privacy" className="underline">
              Privacy
            </Link>
          </p>
        </div>
        <div className="grid w-full gap-2 sm:w-auto sm:flex sm:flex-wrap">
          <Button variant="secondary" className="w-full sm:w-auto" onClick={onPreferences}>
            Voorkeuren beheren
          </Button>
          <Button
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={onReject}
            aria-label="Optionele cookies weigeren. Alleen noodzakelijke blijven aan."
          >
            Optionele weigeren
          </Button>
          <Button className="w-full sm:w-auto" onClick={onAccept}>
            Alles accepteren
          </Button>
        </div>
      </Container>
    </div>
  )
}

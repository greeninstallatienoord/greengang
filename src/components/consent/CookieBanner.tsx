import { Link } from 'react-router-dom'
import { hasOptionalScripts, openPreferences } from '../../lib/consentManager'
import { Button } from '../Button'

type CookieBannerProps = {
  onAccept: () => void
  onReject: () => void
}

export function CookieBanner({ onAccept, onReject }: CookieBannerProps) {
  const optional = hasOptionalScripts()

  return (
    <aside
      className="cookie-banner fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] pr-[4.85rem] sm:px-5 sm:pr-5"
      role="region"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
    >
      <div className="mx-auto w-full max-w-[36rem] border border-line bg-paper px-3.5 py-3.5 shadow-lift sm:max-w-[42rem] sm:rounded-sm sm:px-5 sm:py-4">
        <div className="min-w-0">
          <h2
            id="cookie-title"
            className="text-[0.9rem] font-semibold tracking-[-0.01em] text-ink"
          >
            Privacyvoorkeuren
          </h2>
          <p
            id="cookie-text"
            className="mt-1.5 text-[0.8rem] leading-snug text-ink-muted sm:text-[0.8125rem] sm:leading-relaxed"
          >
            {optional
              ? 'Noodzakelijke cookies houden de website bruikbaar. Extra categorieën zetten we alleen aan als u dat kiest — nooit automatisch door te scrollen.'
              : 'We gebruiken alleen noodzakelijke cookies en lokale opslag om de website te laten werken en uw keuze te onthouden. Er is geen analytics- of marketingtracking aangesloten.'}{' '}
            <Link
              to="/cookies"
              className="font-semibold text-brand-dark underline underline-offset-2"
            >
              Cookiebeleid
            </Link>
          </p>
        </div>

        {optional ? (
          <div className="mt-3 grid gap-2 min-[420px]:grid-cols-3">
            <Button variant="secondary" size="sm" className="min-h-11" onClick={onReject}>
              Alleen noodzakelijk
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11"
              onClick={(event) => openPreferences(event.currentTarget)}
            >
              Voorkeuren instellen
            </Button>
            <Button size="sm" className="min-h-11" onClick={onAccept}>
              Alles accepteren
            </Button>
          </div>
        ) : (
          <div className="mt-3 grid gap-2 min-[420px]:grid-cols-2">
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11"
              onClick={(event) => openPreferences(event.currentTarget)}
            >
              Voorkeuren bekijken
            </Button>
            <Button size="sm" className="min-h-11" onClick={onReject}>
              Begrepen
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}

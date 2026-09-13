import { Link } from 'react-router-dom'
import { hasOptionalScripts } from '../../lib/consentManager'
import { Button } from '../Button'

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
  const optional = hasOptionalScripts()

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pr-[4.75rem] sm:px-5 sm:pr-5"
      role="region"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
    >
      <div className="mx-auto w-full max-w-[34rem] border border-line bg-paper px-3.5 py-3 shadow-lift sm:max-w-[40rem] sm:rounded-sm sm:px-5 sm:py-3.5">
        <div className="min-w-0">
          <h2 id="cookie-title" className="text-[0.875rem] font-semibold tracking-[-0.01em] text-ink">
            Cookies
          </h2>
          <p id="cookie-text" className="mt-1 text-[0.78rem] leading-snug text-ink-muted sm:text-[0.8125rem] sm:leading-relaxed">
            {optional
              ? 'Noodzakelijke cookies houden de site bruikbaar. Extra cookies zetten we alleen aan als u dat wilt.'
              : 'We gebruiken alleen noodzakelijke cookies om de website goed te laten werken en uw keuze te onthouden.'}{' '}
            <Link to="/cookies" className="font-semibold text-brand-dark underline underline-offset-2">
              Cookiebeleid
            </Link>
          </p>
        </div>

        {optional ? (
          <div className="mt-2.5 grid gap-2 min-[420px]:grid-cols-[1fr_1fr_auto]">
            <Button variant="secondary" size="sm" className="min-h-10" onClick={onReject}>
              Alleen noodzakelijk
            </Button>
            <Button variant="ghost" size="sm" className="min-h-10" onClick={onPreferences}>
              Voorkeuren
            </Button>
            <Button size="sm" className="min-h-10" onClick={onAccept}>
              Alles accepteren
            </Button>
          </div>
        ) : (
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Button size="sm" className="min-h-10 min-w-[7rem]" onClick={onReject}>
              Begrepen
            </Button>
            <Button variant="ghost" size="sm" className="min-h-10" onClick={onPreferences}>
              Voorkeuren
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}

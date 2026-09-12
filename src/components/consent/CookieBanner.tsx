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
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5"
      role="region"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
    >
      <div className="mx-auto w-full max-w-[40rem] rounded-t-2xl border border-line bg-paper px-4 py-4 shadow-lift sm:max-w-[48rem] sm:rounded-2xl sm:px-5 sm:py-4">
        <div className="min-w-0">
          <h2 id="cookie-title" className="text-[0.95rem] font-semibold tracking-[-0.01em] text-ink">
            Cookies
          </h2>
          <p id="cookie-text" className="mt-1.5 text-sm leading-relaxed text-ink">
            {optional
              ? 'Noodzakelijke cookies houden de site bruikbaar. Extra cookies zetten we alleen aan als u dat wilt.'
              : 'We gebruiken alleen noodzakelijke cookies, zodat de site werkt en we onthouden dat u deze keuze heeft gemaakt. Er zijn geen statistiek- of marketingcookies.'}{' '}
            <Link to="/cookies" className="font-semibold text-brand-dark underline underline-offset-2">
              Cookiebeleid
            </Link>
          </p>
        </div>

        {optional ? (
          <div className="mt-4 grid gap-2 min-[420px]:grid-cols-[1fr_1fr_auto]">
            <Button variant="secondary" size="sm" onClick={onReject}>
              Alleen noodzakelijk
            </Button>
            <Button variant="ghost" size="sm" onClick={onPreferences}>
              Voorkeuren
            </Button>
            <Button size="sm" onClick={onAccept}>
              Alles accepteren
            </Button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-2 min-[380px]:flex-row min-[380px]:items-center">
            <Button size="sm" className="min-[380px]:min-w-[9.5rem]" onClick={onReject}>
              Begrepen
            </Button>
            <Button variant="ghost" size="sm" onClick={onPreferences}>
              Voorkeuren
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}

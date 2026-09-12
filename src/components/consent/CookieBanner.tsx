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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/97 shadow-header backdrop-blur-md"
      role="region"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
    >
      <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-2.5 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-6">
        <div className="min-w-0 max-w-xl">
          <h2 id="cookie-title" className="text-sm font-semibold">
            Kies uw cookievoorkeuren
          </h2>
          <p id="cookie-text" className="mt-1 text-[0.8rem] leading-snug text-ink-muted sm:leading-relaxed">
            {optional
              ? 'Noodzakelijke cookies houden de site bruikbaar. Extra cookies zetten we alleen aan als u dat wilt.'
              : 'We gebruiken alleen noodzakelijke cookies, zodat de site werkt en we onthouden dat u deze keuze heeft gemaakt. Er zijn geen statistiek- of marketingcookies.'}{' '}
            <Link to="/cookies" className="underline underline-offset-2">
              Cookiebeleid
            </Link>
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-2 min-[400px]:grid-cols-3 sm:w-auto sm:min-w-[22rem]">
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
      </div>
    </aside>
  )
}

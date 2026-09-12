import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { isFormPath } from '../data/navigation'
import { CookieBanner } from '../components/consent/CookieBanner'
import { CookiePreferences } from '../components/consent/CookiePreferences'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { MobileActionBar } from '../components/layout/MobileActionBar'
import { useConsent } from '../hooks/useConsent'

export function RootLayout() {
  const consent = useConsent()
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-paper focus:px-3 focus:py-2"
      >
        Ga naar inhoud
      </a>
      <Header />
      <main
        id="main-content"
        className={isFormPath(pathname) ? 'flex-1' : 'flex-1 pb-24 lg:pb-0'}
      >
        <Suspense
          fallback={
            <div className="container-page py-16 text-ink-muted" role="status">
              Pagina wordt geladen…
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <MobileActionBar />
      {!consent.decided && !consent.panelOpen ? (
        <CookieBanner
          onAccept={consent.acceptAll}
          onReject={consent.rejectOptional}
          onPreferences={consent.openPanel}
        />
      ) : null}
      {consent.panelOpen ? (
        <CookiePreferences
          value={consent.preferences}
          onClose={consent.closePanel}
          onSave={consent.save}
          onAcceptAll={consent.acceptAll}
          onRejectOptional={consent.rejectOptional}
        />
      ) : null}
    </div>
  )
}

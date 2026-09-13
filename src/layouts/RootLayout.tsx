import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { CookieBanner } from '../components/consent/CookieBanner'
import { CookiePreferences } from '../components/consent/CookiePreferences'
import { FloatingContactMenu } from '../components/layout/FloatingContactMenu'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { useConsent } from '../hooks/useConsent'

export function RootLayout() {
  const consent = useConsent()

  return (
    <div
      className={
        consent.decided || consent.panelOpen
          ? 'flex min-h-dvh flex-col'
          : 'flex min-h-dvh flex-col pb-[var(--cookie-banner-offset)]'
      }
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-paper focus:px-3 focus:py-2"
      >
        Ga naar inhoud
      </a>
      <Header />
      <main id="main-content" className="flex-1">
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
      {!consent.panelOpen ? (
        <FloatingContactMenu lifted={!consent.decided} />
      ) : null}
      {!consent.decided && !consent.panelOpen ? (
        <CookieBanner
          onAccept={consent.acceptAll}
          onReject={consent.rejectOptional}
        />
      ) : null}
      {consent.panelOpen ? (
        <CookiePreferences
          value={consent.preferences}
          onClose={consent.closePanel}
          onSave={consent.save}
          onAcceptAll={consent.acceptAllFromPanel}
          onNecessaryOnly={consent.necessaryOnlyFromPanel}
          onWithdraw={consent.withdraw}
        />
      ) : null}
    </div>
  )
}

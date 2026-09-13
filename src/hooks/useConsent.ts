import { useEffect, useState } from 'react'
import {
  acceptAllConsent,
  CONSENT_CHANGED_EVENT,
  consentCopy,
  defaultConsent,
  getConsent,
  initConsentRuntime,
  OPEN_PREFERENCES_EVENT,
  rejectOptionalConsent,
  setConsent,
  withdrawConsent,
} from '../lib/consentManager'
import type { ConsentPreferences } from '../types'

export function useConsent() {
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(() =>
    typeof window === 'undefined' ? null : getConsent(),
  )
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    initConsentRuntime()

    const onChange = () => setPreferences(getConsent())
    const onOpen = () => setPanelOpen(true)

    window.addEventListener(CONSENT_CHANGED_EVENT, onChange)
    window.addEventListener(OPEN_PREFERENCES_EVENT, onOpen)
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, onChange)
      window.removeEventListener(OPEN_PREFERENCES_EVENT, onOpen)
    }
  }, [])

  useEffect(() => {
    const showBanner = preferences === null && !panelOpen
    document.documentElement.dataset.cookieBanner = showBanner ? 'on' : 'off'
    return () => {
      document.documentElement.dataset.cookieBanner = 'off'
    }
  }, [preferences, panelOpen])

  return {
    preferences: preferences ?? defaultConsent,
    decided: preferences !== null,
    panelOpen,
    openPanel: () => setPanelOpen(true),
    closePanel: () => setPanelOpen(false),
    acceptAll: () => {
      setPreferences(acceptAllConsent('banner-accept-all'))
      setPanelOpen(false)
    },
    rejectOptional: () => {
      setPreferences(rejectOptionalConsent('banner-necessary'))
      setPanelOpen(false)
    },
    acceptAllFromPanel: () => {
      setPreferences(acceptAllConsent('preferences-accept-all'))
      setPanelOpen(false)
    },
    necessaryOnlyFromPanel: () => {
      setPreferences(rejectOptionalConsent('preferences-necessary'))
      setPanelOpen(false)
    },
    withdraw: () => {
      setPreferences(withdrawConsent())
      setPanelOpen(false)
    },
    save: (next: ConsentPreferences) => {
      const sanitized: ConsentPreferences = {
        necessary: true,
        preferences: next.preferences && consentCopy.preferences.active,
        analytics: next.analytics && consentCopy.analytics.active,
        marketing: next.marketing && consentCopy.marketing.active,
      }
      const record = setConsent(sanitized, 'preferences-save')
      setPreferences({
        necessary: true,
        preferences: record.preferences,
        analytics: record.analytics,
        marketing: record.marketing,
      })
      setPanelOpen(false)
    },
  }
}

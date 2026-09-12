import { useEffect, useState } from 'react'
import {
  acceptAllConsent,
  CONSENT_CHANGED_EVENT,
  defaultConsent,
  getConsent,
  initConsentRuntime,
  OPEN_PREFERENCES_EVENT,
  rejectOptionalConsent,
  setConsent,
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
      setPreferences(acceptAllConsent())
      setPanelOpen(false)
    },
    rejectOptional: () => {
      setPreferences(rejectOptionalConsent())
      setPanelOpen(false)
    },
    save: (next: ConsentPreferences) => {
      setConsent(next)
      setPreferences({ ...next, necessary: true })
      setPanelOpen(false)
    },
  }
}

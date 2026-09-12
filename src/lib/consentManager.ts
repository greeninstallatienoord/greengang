import type { ConsentCategory, ConsentPreferences } from '../types'

export const CONSENT_STORAGE_KEY = 'gin-consent-v1'
export const CONSENT_CHANGED_EVENT = 'gin-consent-changed'
export const OPEN_PREFERENCES_EVENT = 'gin-open-cookie-preferences'

export const defaultConsent: ConsentPreferences = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
}

export const consentCopy: Record<
  ConsentCategory,
  { title: string; description: string }
> = {
  necessary: {
    title: 'Noodzakelijk',
    description:
      'Altijd aan. Deze website onthoudt alleen dat u een cookiekeuze heeft gemaakt, zodat de melding niet elke keer terugkomt.',
  },
  preferences: {
    title: 'Voorkeuren',
    description:
      'Optioneel. Bijvoorbeeld extra lettertypen van een externe dienst. Zonder deze keuze blijft de site gewoon leesbaar.',
  },
  analytics: {
    title: 'Statistieken',
    description:
      'Optioneel. Alleen als we later een meetprogramma aansluiten. Er start nu geen statistiek-script.',
  },
  marketing: {
    title: 'Marketing',
    description:
      'Optioneel. Alleen voor eventuele latere advertentie- of remarketingcodes. Er start nu geen marketing-script.',
  },
}

type OptionalScript = {
  id: string
  category: Exclude<ConsentCategory, 'necessary'>
  load: () => void
  loaded?: boolean
}

const scripts: OptionalScript[] = []

export function registerOptionalScript(script: OptionalScript): void {
  if (scripts.some((item) => item.id === script.id)) return
  scripts.push({ ...script, loaded: false })
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === 'necessary') return true
  return getConsent()?.[category] === true
}

export function getConsent(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentPreferences
    return { ...defaultConsent, ...parsed, necessary: true }
  } catch {
    return null
  }
}

export function setConsent(preferences: ConsentPreferences): void {
  const next = { ...preferences, necessary: true }
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(
    new CustomEvent(CONSENT_CHANGED_EVENT, { detail: next }),
  )
  syncOptionalScripts()
}

export function openPreferences(): void {
  window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT))
}

export function acceptAllConsent(): ConsentPreferences {
  const next: ConsentPreferences = {
    necessary: true,
    preferences: true,
    analytics: true,
    marketing: true,
  }
  setConsent(next)
  return next
}

export function rejectOptionalConsent(): ConsentPreferences {
  const next = { ...defaultConsent }
  setConsent(next)
  return next
}

export function syncOptionalScripts(): void {
  for (const script of scripts) {
    if (script.loaded) continue
    if (!hasConsent(script.category)) continue
    script.load()
    script.loaded = true
  }
}

export function initConsentRuntime(): void {
  registerOptionalScript({
    id: 'google-fonts',
    category: 'preferences',
    load: loadPreferenceFonts,
  })
  syncOptionalScripts()
}

function loadPreferenceFonts(): void {
  if (document.getElementById('gin-optional-fonts')) return
  const preconnectGoogle = document.createElement('link')
  preconnectGoogle.rel = 'preconnect'
  preconnectGoogle.href = 'https://fonts.googleapis.com'
  const preconnectGstatic = document.createElement('link')
  preconnectGstatic.rel = 'preconnect'
  preconnectGstatic.href = 'https://fonts.gstatic.com'
  preconnectGstatic.crossOrigin = 'anonymous'
  const stylesheet = document.createElement('link')
  stylesheet.id = 'gin-optional-fonts'
  stylesheet.rel = 'stylesheet'
  stylesheet.href =
    'https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap'
  document.head.append(preconnectGoogle, preconnectGstatic, stylesheet)
}

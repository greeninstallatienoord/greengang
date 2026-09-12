import type { ConsentCategory, ConsentPreferences } from '../types'

export const CONSENT_STORAGE_KEY = 'gin-consent-v2'
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
      'Altijd aan. We onthouden in deze browser dat u een cookiekeuze heeft gemaakt, zodat de melding niet bij elk bezoek terugkomt. Onvoltooide formulieren kunnen tijdelijk in deze browser blijven staan tot u ze verstuurt of wist.',
  },
  preferences: {
    title: 'Voorkeuren',
    description:
      'Optioneel. Alleen als we later een extra dienst koppelen die bij deze categorie hoort. Er is nu geen voorkeursscript aangesloten.',
  },
  analytics: {
    title: 'Analytisch',
    description:
      'Optioneel. Alleen als we later een meetprogramma aansluiten. Er is nu geen statistiek-script aangesloten.',
  },
  marketing: {
    title: 'Marketing',
    description:
      'Optioneel. Alleen als we later advertentiecodes plaatsen. Er is nu geen marketing-script aangesloten.',
  },
}

type OptionalScript = {
  id: string
  category: Exclude<ConsentCategory, 'necessary'>
  load: () => void
  loaded?: boolean
}

const scripts: OptionalScript[] = []

const CATEGORY_ORDER: ConsentCategory[] = [
  'necessary',
  'preferences',
  'analytics',
  'marketing',
]

export function registerOptionalScript(script: OptionalScript): void {
  if (scripts.some((item) => item.id === script.id)) return
  scripts.push({ ...script, loaded: false })
}

export function optionalConsentCategories(): Array<Exclude<ConsentCategory, 'necessary'>> {
  const used = new Set<Exclude<ConsentCategory, 'necessary'>>()
  for (const script of scripts) used.add(script.category)
  return (['preferences', 'analytics', 'marketing'] as const).filter((key) => used.has(key))
}

export function visibleConsentCategories(): ConsentCategory[] {
  return CATEGORY_ORDER.filter(
    (key) => key === 'necessary' || optionalConsentCategories().includes(key),
  )
}

export function hasOptionalScripts(): boolean {
  return scripts.length > 0
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
  const next = { ...defaultConsent, ...preferences, necessary: true }
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
  const next = { ...defaultConsent }
  for (const category of optionalConsentCategories()) {
    next[category] = true
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
  syncOptionalScripts()
}

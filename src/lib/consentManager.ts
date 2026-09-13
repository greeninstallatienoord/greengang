import type { ConsentCategory, ConsentPreferences } from '../types'
import {
  cookieCategories,
  cookiesByCategory,
  type CookieRegistryItem,
} from '../config/cookies'

/** Bump when purposes/categories change materially — forces a new consent choice. */
export const CONSENT_POLICY_VERSION = '2026-09-13.3'

export const CONSENT_STORAGE_KEY = 'gin-consent-v2'
export const CONSENT_CHANGED_EVENT = 'gin-consent-changed'
export const OPEN_PREFERENCES_EVENT = 'gin-open-cookie-preferences'

export type ConsentSource =
  | 'banner-accept-all'
  | 'banner-necessary'
  | 'preferences-save'
  | 'preferences-accept-all'
  | 'preferences-necessary'
  | 'withdraw'

export type ConsentRecord = {
  version: string
  necessary: true
  preferences: boolean
  analytics: boolean
  marketing: boolean
  updatedAt: string
  source: ConsentSource
}

export const defaultConsent: ConsentPreferences = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
}

export const consentCopy: Record<
  ConsentCategory,
  { title: string; description: string; active: boolean }
> = {
  necessary: {
    title: cookieCategories.necessary.label,
    description: cookieCategories.necessary.description,
    active: true,
  },
  preferences: {
    title: cookieCategories.preferences.label,
    description: cookieCategories.preferences.description,
    active: false,
  },
  analytics: {
    title: cookieCategories.analytics.label,
    description: cookieCategories.analytics.description,
    active: false,
  },
  marketing: {
    title: cookieCategories.marketing.label,
    description: cookieCategories.marketing.description,
    active: false,
  },
}

type OptionalScript = {
  id: string
  category: Exclude<ConsentCategory, 'necessary'>
  load: () => void
  unload?: () => void
  loaded?: boolean
}

const scripts: OptionalScript[] = []

const CATEGORY_ORDER: ConsentCategory[] = [
  'necessary',
  'preferences',
  'analytics',
  'marketing',
]

let preferencesOpener: HTMLElement | null = null

export function registerOptionalScript(script: OptionalScript): void {
  if (scripts.some((item) => item.id === script.id)) return
  scripts.push({ ...script, loaded: false })
  consentCopy[script.category].active = true
}

export function optionalConsentCategories(): Array<Exclude<ConsentCategory, 'necessary'>> {
  const used = new Set<Exclude<ConsentCategory, 'necessary'>>()
  for (const script of scripts) used.add(script.category)
  for (const category of ['preferences', 'analytics', 'marketing'] as const) {
    if (cookiesByCategory(category, 'public').some((item) => item.consentRequired)) {
      used.add(category)
    }
  }
  return (['preferences', 'analytics', 'marketing'] as const).filter((key) => used.has(key))
}

/** Categories shown in the preferences panel (always include necessary + reserved inactive). */
export function visibleConsentCategories(): ConsentCategory[] {
  return CATEGORY_ORDER
}

export function hasOptionalScripts(): boolean {
  return scripts.length > 0 || optionalConsentCategories().length > 0
}

export function categoryExamples(category: ConsentCategory): CookieRegistryItem[] {
  return cookiesByCategory(category, 'public')
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === 'necessary') return true
  const record = getConsentRecord()
  if (!record) return false
  return record[category] === true
}

function isConsentRecord(value: unknown): value is ConsentRecord {
  if (!value || typeof value !== 'object') return false
  const row = value as Record<string, unknown>
  return (
    typeof row.version === 'string' &&
    row.necessary === true &&
    typeof row.preferences === 'boolean' &&
    typeof row.analytics === 'boolean' &&
    typeof row.marketing === 'boolean' &&
    typeof row.updatedAt === 'string' &&
    typeof row.source === 'string'
  )
}

function isLegacyPreferences(value: unknown): value is ConsentPreferences {
  if (!value || typeof value !== 'object') return false
  const row = value as Record<string, unknown>
  return (
    typeof row.necessary === 'boolean' &&
    typeof row.preferences === 'boolean' &&
    typeof row.analytics === 'boolean' &&
    typeof row.marketing === 'boolean' &&
    row.version === undefined
  )
}

function clearStoredConsent(): void {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY)
  } catch {
    // Private mode / blocked storage — ignore.
  }
}

export function getConsentRecord(): ConsentRecord | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)

    if (isConsentRecord(parsed)) {
      if (parsed.version !== CONSENT_POLICY_VERSION) {
        clearStoredConsent()
        return null
      }
      return { ...parsed, necessary: true }
    }

    // Legacy unversioned payloads: re-prompt instead of silently adopting a new policy version.
    if (isLegacyPreferences(parsed)) {
      clearStoredConsent()
      return null
    }

    clearStoredConsent()
    return null
  } catch {
    clearStoredConsent()
    return null
  }
}

/** Preferences only; null when the visitor has not decided under the current policy version. */
export function getConsent(): ConsentPreferences | null {
  const record = getConsentRecord()
  if (!record) return null
  return {
    necessary: true,
    preferences: record.preferences,
    analytics: record.analytics,
    marketing: record.marketing,
  }
}

export function setConsent(
  preferences: ConsentPreferences,
  source: ConsentSource = 'preferences-save',
): ConsentRecord {
  const next: ConsentRecord = {
    version: CONSENT_POLICY_VERSION,
    necessary: true,
    preferences: Boolean(preferences.preferences),
    analytics: Boolean(preferences.analytics),
    marketing: Boolean(preferences.marketing),
    updatedAt: new Date().toISOString(),
    source,
  }
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Still apply the in-session decision; banner may return on next visit if storage is blocked.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: next }))
  syncOptionalScripts()
  return next
}

export function openPreferences(opener?: HTMLElement | null): void {
  preferencesOpener = opener ?? (document.activeElement as HTMLElement | null)
  window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT))
}

export function consumePreferencesOpener(): HTMLElement | null {
  const opener = preferencesOpener
  preferencesOpener = null
  return opener
}

export function acceptAllConsent(
  source: ConsentSource = 'banner-accept-all',
): ConsentPreferences {
  const next = { ...defaultConsent }
  for (const category of optionalConsentCategories()) {
    next[category] = true
  }
  // When no optional tech is connected, accepting all still records a decision.
  setConsent(next, source)
  return next
}

export function rejectOptionalConsent(
  source: ConsentSource = 'banner-necessary',
): ConsentPreferences {
  const next = { ...defaultConsent }
  setConsent(next, source)
  return next
}

export function withdrawConsent(): ConsentPreferences {
  return rejectOptionalConsent('withdraw')
}

export function syncOptionalScripts(): void {
  for (const script of scripts) {
    const allowed = hasConsent(script.category)
    if (allowed && !script.loaded) {
      script.load()
      script.loaded = true
      continue
    }
    if (!allowed && script.loaded) {
      script.unload?.()
      script.loaded = false
    }
  }
}

export function initConsentRuntime(): void {
  // Refresh active flags from any registered scripts.
  for (const script of scripts) {
    consentCopy[script.category].active = true
  }
  syncOptionalScripts()
}

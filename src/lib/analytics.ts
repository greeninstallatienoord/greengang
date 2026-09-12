import { hasConsent } from './consentManager'

export function canLoadAnalytics(): boolean {
  return hasConsent('analytics')
}

export function canLoadMarketing(): boolean {
  return hasConsent('marketing')
}

export function initOptionalScripts(): void {
  if (canLoadAnalytics()) {
    // Register and start analytics only from consentManager.syncOptionalScripts.
  }
  if (canLoadMarketing()) {
    // Register and start marketing tags only from consentManager.syncOptionalScripts.
  }
}

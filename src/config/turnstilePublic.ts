/**
 * Public Cloudflare Turnstile site key only.
 * Safe to commit. Never put TURNSTILE_SECRET_KEY here.
 *
 * Must match the Cloudflare Turnstile widget for greeninstallatienoord.nl
 * (wrangler turnstile widget list → inlogblackberry).
 *
 * Vite inlines this at build time so production deploys do not depend on
 * a local shell env or a Worker runtime variable named VITE_*.
 */
export const TURNSTILE_SITE_KEY = '0x4AAAAAAEy5sheMMUDciNyj'

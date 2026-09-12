export const ADMIN_BASE_PATH =
  import.meta.env.VITE_ADMIN_BASE_PATH?.replace(/\/$/, '') || '/blackberry97'

export function adminUrl(suffix = ''): string {
  const path = suffix.startsWith('/') ? suffix : suffix ? `/${suffix}` : ''
  return `${ADMIN_BASE_PATH}${path}`
}

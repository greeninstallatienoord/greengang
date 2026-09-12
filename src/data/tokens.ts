/**
 * Design tokens used by the site. Visual values live in `src/index.css` (@theme).
 * Pages must not invent a second palette, type scale or spacing system.
 */
export const tokens = {
  colors: {
    brand: '#1a8a34',
    brandDark: '#14692a',
    brandDeep: '#0f4f20',
    brandSoft: '#e7f5ea',
    ink: '#121417',
    inkMuted: '#3f464d',
    line: '#d7ddd6',
    surface: '#f3f5f2',
    paper: '#ffffff',
    danger: '#9b2c2c',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
  shadows: {
    card: '0 1px 2px rgb(18 20 23 / 0.05), 0 8px 24px rgb(18 20 23 / 0.05)',
    header: '0 1px 0 rgb(18 20 23 / 0.06)',
  },
  spacing: {
    section: '3.5rem',
    sectionLg: '5rem',
  },
  container: {
    page: '72rem',
    narrow: '48rem',
  },
  duration: {
    fast: '150ms',
    base: '200ms',
    enter: '550ms',
  },
  breakpoints: {
    sm: '40rem',
    md: '48rem',
    lg: '64rem',
    xl: '80rem',
  },
  cta: {
    primary: 'Offerte aanvragen',
    secondary: 'Afspraak maken',
    tertiary: 'Bel ons',
  },
} as const

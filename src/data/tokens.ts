/**
 * Design tokens used by the site. Visual values live in `src/index.css` (@theme).
 * Pages must not invent a second palette, type scale or spacing system.
 */
export const tokens = {
  colors: {
    brand: '#1a8a34',
    brandDark: '#14692a',
    brandDeep: '#102418',
    brandSoft: '#e8f3ea',
    ink: '#161a17',
    inkMuted: '#5a615c',
    line: '#ddd6cb',
    surface: '#f3eee6',
    paper: '#fbf8f2',
    stone: '#ebe4d8',
    danger: '#9b2c2c',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
  },
  shadows: {
    card: '0 1px 2px rgb(20 24 22 / 0.04), 0 10px 28px rgb(20 24 22 / 0.05)',
    header: '0 1px 0 rgb(20 24 22 / 0.08)',
  },
  spacing: {
    section: '4.5rem',
    sectionLg: '7rem',
  },
  container: {
    page: '80rem',
    narrow: '40rem',
  },
  type: {
    h1: '2.75rem',
    h2: '2rem',
    h3: '1.25rem',
    body: '1.0625rem',
    lead: '1.125rem',
    small: '0.875rem',
    lineBody: '1.65',
    lineDisplay: '1.15',
  },
  control: {
    heightSm: '2.5rem',
    heightMd: '2.75rem',
    heightLg: '3rem',
    icon: 18,
  },
  duration: {
    fast: '160ms',
    base: '220ms',
    enter: '500ms',
  },
  breakpoints: {
    sm: '40rem',
    md: '48rem',
    lg: '64rem',
    xl: '80rem',
  },
  cta: {
    primary: 'Offerte aanvragen',
    secondary: 'Afspraak aanvragen',
    tertiary: 'Bel ons',
  },
} as const

import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'
import type { ButtonSize, ButtonVariant } from '../types'

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'border border-ink/15 bg-paper text-ink hover:border-ink/35 hover:bg-stone',
  ghost: 'text-ink hover:bg-stone',
  whatsapp: 'bg-whatsapp text-white hover:opacity-90',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-3.5 text-[0.875rem]',
  md: 'min-h-11 px-4 text-[0.9375rem]',
  lg: 'min-h-12 px-5 text-base',
}

type ButtonLinkProps = {
  to: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
  external?: boolean
  tabIndex?: number
  onClick?: MouseEventHandler<HTMLAnchorElement>
  'aria-label'?: string
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className,
  children,
  external,
  tabIndex,
  onClick,
  'aria-label': ariaLabel,
}: ButtonLinkProps) {
  const overrideColor = Boolean(className?.includes('text-'))
  const classes = cn(
    'inline-flex touch-manipulation items-center justify-center gap-2 rounded-sm font-semibold tracking-[-0.01em] transition-[color,background-color,border-color,transform] duration-[var(--duration-base)] motion-safe:hover:-translate-y-px',
    overrideColor
      ? variantClass[variant].replace(/\btext-\S+/g, '').trim()
      : variantClass[variant],
    sizeClass[size],
    className,
  )

  if (external) {
    const isHttp = to.startsWith('http://') || to.startsWith('https://')
    return (
      <a
        href={to}
        className={classes}
        rel={isHttp ? 'noopener noreferrer' : undefined}
        target={isHttp ? '_blank' : undefined}
        tabIndex={tabIndex}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    )
  }

  return (
    <Link to={to} className={classes} tabIndex={tabIndex} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Link>
  )
}

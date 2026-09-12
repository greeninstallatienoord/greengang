import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'
import type { ButtonSize, ButtonVariant } from '../types'

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark shadow-sm',
  secondary:
    'border border-line bg-paper text-ink hover:border-brand/40 hover:bg-brand-soft/50',
  ghost: 'text-ink hover:bg-brand-soft/70',
  whatsapp: 'bg-whatsapp text-white hover:opacity-90',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-3.5 text-sm',
  md: 'min-h-11 px-4 text-sm',
  lg: 'min-h-12 px-5 text-base',
}

type ButtonLinkProps = {
  to: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: ReactNode
  external?: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className,
  children,
  external,
  onClick,
}: ButtonLinkProps) {
  const overrideColor = Boolean(className?.includes('text-'))
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-[var(--duration-base)]',
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
        onClick={onClick}
      >
        {children}
      </a>
    )
  }

  return (
    <Link to={to} className={classes} onClick={onClick}>
      {children}
    </Link>
  )
}

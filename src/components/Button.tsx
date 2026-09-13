import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'
import type { ButtonSize, ButtonVariant } from '../types'
import { InlineLoader } from './loading/BrandLoader'

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

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  /** Shows inline spinner and disables the button without changing width. */
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  children,
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex touch-manipulation items-center justify-center gap-2 rounded-sm font-semibold tracking-[-0.01em] transition-[color,background-color,border-color,transform] duration-[var(--duration-base)] motion-safe:hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
        className?.includes('text-')
          ? variantClass[variant].replace(/\btext-\S+/g, '').trim()
          : variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {loading ? <InlineLoader label="Bezig" /> : null}
      {children}
    </button>
  )
}

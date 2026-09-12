import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'
import type { ButtonSize, ButtonVariant } from '../types'

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-dark shadow-sm',
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

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-[var(--duration-base)] disabled:cursor-not-allowed disabled:opacity-50',
        className?.includes('text-')
          ? variantClass[variant].replace(/\btext-\S+/g, '').trim()
          : variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

const DEFAULT_DELAY_MS = 200

type BrandLoaderProps = {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizeClass = {
  sm: 'size-5 border-[1.5px]',
  md: 'size-7 border-2',
  lg: 'size-9 border-2',
} as const

/** Small branded circular spinner — CSS only. */
export function BrandLoader({ className, size = 'md', label = 'Laden' }: BrandLoaderProps) {
  return (
    <span
      className={cn(
        'brand-loader inline-flex items-center justify-center text-brand',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className={cn('brand-loader__ring', sizeClass[size])} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  )
}

type InlineLoaderProps = {
  className?: string
  label?: string
}

/** Compact spinner for buttons and inline states (inherits text color). */
export function InlineLoader({ className, label = 'Bezig' }: InlineLoaderProps) {
  return <BrandLoader size="sm" className={cn('text-current', className)} label={label} />
}

type DelayedProps = {
  delayMs?: number
  children: ReactNode
  placeholder?: ReactNode
}

/**
 * Delays painting children so fast loads do not flash a loader.
 * Mounted fresh by Suspense fallbacks — no active toggle needed.
 */
function Delayed({ delayMs = DEFAULT_DELAY_MS, children, placeholder = null }: DelayedProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setShow(true), delayMs)
    return () => window.clearTimeout(timer)
  }, [delayMs])

  return (
    <div
      className={cn(
        'transition-opacity duration-300',
        show ? 'opacity-100' : 'opacity-0',
      )}
    >
      {show ? children : placeholder}
    </div>
  )
}

type LoadingScreenProps = {
  label?: string
  /** Full viewport for boot / admin auth. Content-area for route Suspense. */
  variant?: 'page' | 'section' | 'admin'
  className?: string
  /** Delay before paint to avoid flash (ms). */
  delayMs?: number
}

/**
 * Suspense / boot fallback with delayed visibility.
 * Header/footer stay mounted when used as `section` inside RootLayout main.
 */
export function LoadingScreen({
  label = 'Even laden…',
  variant = 'section',
  className,
  delayMs = DEFAULT_DELAY_MS,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-center',
        variant === 'page' && 'min-h-dvh bg-surface px-4',
        variant === 'admin' && 'admin-app min-h-dvh bg-[var(--admin-bg)] px-4',
        variant === 'section' && 'min-h-[12rem] px-4 py-16 sm:min-h-[14rem] sm:py-20',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Delayed
        delayMs={delayMs}
        placeholder={<span className="sr-only">{label}</span>}
      >
        <div className="flex flex-col items-center gap-3">
          <BrandLoader size="md" label={label} />
          <p
            className={cn(
              'text-sm',
              variant === 'admin' ? 'text-[var(--admin-muted)]' : 'text-ink-muted',
            )}
          >
            {label}
          </p>
        </div>
      </Delayed>
    </div>
  )
}

/** Compact admin content-area fallback (nav stays visible). */
export function AdminRouteFallback({ label = 'Even laden…' }: { label?: string }) {
  return (
    <div
      className="flex min-h-[10rem] flex-col items-center justify-center gap-3 py-12"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Delayed delayMs={DEFAULT_DELAY_MS} placeholder={<span className="sr-only">{label}</span>}>
        <div className="flex flex-col items-center gap-3">
          <BrandLoader size="md" label={label} />
          <p className="text-sm text-[var(--admin-muted)]">{label}</p>
        </div>
      </Delayed>
    </div>
  )
}

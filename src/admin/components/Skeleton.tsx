import { cn } from '../../lib/cn'

type SkeletonBlockProps = {
  className?: string
}

export function SkeletonBlock({ className }: SkeletonBlockProps) {
  return (
    <div
      className={cn('admin-skeleton border border-[var(--admin-line)]', className)}
      aria-hidden="true"
    />
  )
}

type SkeletonProps = {
  rows?: number
  className?: string
}

/** Generic stacked rows — default admin list/detail placeholder. */
export function Skeleton({ rows = 4, className }: SkeletonProps) {
  return (
    <div className={cn('grid gap-2', className)} aria-busy="true" aria-live="polite">
      <span className="sr-only">Laden…</span>
      {Array.from({ length: rows }, (_, index) => (
        <SkeletonBlock key={index} className="h-16" />
      ))}
    </div>
  )
}

type SkeletonCardsProps = {
  count?: number
  className?: string
}

/** Dashboard-style metric / panel cards. */
export function SkeletonCards({ count = 4, className }: SkeletonCardsProps) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Laden…</span>
      <div className={cn('grid gap-3 sm:grid-cols-2 xl:grid-cols-4', className)}>
        {Array.from({ length: count }, (_, index) => (
          <SkeletonBlock key={index} className="h-[6.5rem]" />
        ))}
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <SkeletonBlock className="min-h-[12rem]" />
        <SkeletonBlock className="min-h-[12rem]" />
      </div>
    </div>
  )
}

type SkeletonTableProps = {
  rows?: number
  className?: string
}

/** Table / list row placeholders. */
export function SkeletonTable({ rows = 6, className }: SkeletonTableProps) {
  return (
    <div className={cn('grid gap-2', className)} aria-busy="true" aria-live="polite">
      <span className="sr-only">Laden…</span>
      <SkeletonBlock className="hidden h-10 lg:block" />
      {Array.from({ length: rows }, (_, index) => (
        <SkeletonBlock
          key={index}
          className={cn('h-[4.5rem] lg:h-14', index % 2 === 1 && 'opacity-90')}
        />
      ))}
    </div>
  )
}

export { Skeleton as SkeletonRows }

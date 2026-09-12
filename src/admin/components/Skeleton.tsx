export function Skeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="grid gap-2" aria-busy="true" aria-live="polite">
      <span className="sr-only">Laden…</span>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="admin-skeleton h-16 border border-[var(--admin-line)]" aria-hidden="true" />
      ))}
    </div>
  )
}

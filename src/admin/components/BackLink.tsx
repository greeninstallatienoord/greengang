import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export function BackLink({ to, children }: { to: string; children: string }) {
  return (
    <p className="mb-4">
      <Link
        to={to}
        className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-[var(--admin-muted)] transition-colors hover:text-[var(--admin-ink)]"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {children}
      </Link>
    </p>
  )
}

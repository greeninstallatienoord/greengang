import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ArticleWorkNote() {
  return (
    <p className="mt-10 border-t border-line pt-6 text-sm leading-relaxed text-ink-muted">
      Foto’s van plaatsingen staan bij elkaar op{' '}
      <Link
        to="/werk"
        className="inline-flex items-center gap-1 font-semibold text-ink hover:text-brand-dark"
      >
        Werk uit de praktijk
        <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
      </Link>
      . Geen stockbeelden.
    </p>
  )
}

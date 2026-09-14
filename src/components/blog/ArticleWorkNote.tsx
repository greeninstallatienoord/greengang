import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

type ArticleWorkNoteProps = {
  /** Optional service-specific label, e.g. "cv-ketelinstallaties". */
  subject?: string
}

export function ArticleWorkNote({ subject }: ArticleWorkNoteProps) {
  return (
    <aside className="article-work-note" aria-label="Werk uit de praktijk">
      <p className="article-work-note__label">Uit de praktijk</p>
      <p className="article-work-note__text">
        Bekijk echte {subject ?? 'installaties'} van Green Installatie Noord.
        Geen stockbeelden.
      </p>
      <Link to="/werk" className="article-work-note__link">
        Bekijk projecten
        <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
      </Link>
    </aside>
  )
}

import type { TrustReview } from '../../data/trust'
import { Card } from '../Card'

type ReviewCardProps = {
  review: TrustReview
}

export function ReviewCard({ review }: ReviewCardProps) {
  if (!review.approved || !review.republicationAllowed || !review.quote.trim()) {
    return null
  }

  return (
    <Card>
      {review.rating !== null ? (
        <p className="text-sm font-semibold">
          {review.rating}/{review.scale} · {review.source}
        </p>
      ) : (
        <p className="text-sm font-semibold">{review.source}</p>
      )}
      <blockquote className="mt-3 text-ink-muted">“{review.quote}”</blockquote>
      <p className="mt-3 text-sm">
        {review.author}
        {review.date ? ` · ${review.date}` : ''}
      </p>
      {review.sourceUrl ? (
        <p className="mt-2 text-sm">
          <a
            href={review.sourceUrl}
            className="font-semibold underline underline-offset-2"
            rel="noopener noreferrer"
            target="_blank"
          >
            Bron: {review.source}
          </a>
        </p>
      ) : null}
    </Card>
  )
}

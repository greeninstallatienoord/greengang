import { business } from '../../data/business'
import { Card } from '../Card'

/**
 * Neutral Google profile CTA. No stars, no review counts.
 * Renders nothing until a verified profile URL exists.
 */
export function GoogleReviewsCta() {
  const href = business.googleBusinessProfile
  if (!href) return null

  return (
    <Card>
      <h3 className="font-semibold">Google</h3>
      <p className="mt-2 text-sm text-ink-muted">
        We zetten hier geen sterren of aantallen. Bekijk ervaringen op het
        officiële profiel.
      </p>
      <p className="mt-4 text-sm">
        <a
          href={href}
          className="font-semibold underline underline-offset-2"
          rel="noopener noreferrer"
          target="_blank"
        >
          Bekijk ons op Google
        </a>
      </p>
    </Card>
  )
}

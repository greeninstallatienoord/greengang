import { business } from '../../data/business'
import { Card } from '../Card'
import { GoogleIcon } from '../icons/BrandIcons'

/**
 * Neutral Google profile CTA. No stars, no review counts.
 * Renders nothing until a verified profile URL exists.
 */
export function GoogleReviewsCta() {
  const href = business.googleBusinessProfile
  if (!href) return null

  return (
    <Card>
      <h3 className="flex items-center gap-2.5 font-semibold">
        <GoogleIcon size={18} />
        Google
      </h3>
      <p className="mt-2 text-sm text-ink-muted">
        Bekijk ons profiel of deel uw ervaring na een installatie of servicebezoek.
      </p>
      <p className="mt-4 text-sm">
        <a
          href={href}
          className="font-semibold underline underline-offset-2"
          rel="noopener noreferrer"
          target="_blank"
        >
          Bekijk ons Google-profiel
        </a>
      </p>
    </Card>
  )
}

import { pageImages, mediaPositionStyle } from '../../data/media'
import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'

const hero = pageImages.homeHero
const heroCrop = mediaPositionStyle({
  objectPosition: '72% 54%',
  objectPositionMobile: '78% 58%',
})

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-deep text-white">
      <img
        src={hero.src}
        alt=""
        width={hero.width}
        height={hero.height}
        fetchPriority="high"
        decoding="async"
        className="hero-bg media-photo absolute inset-0 size-full max-w-none object-cover"
        style={heroCrop}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/72 to-brand-deep/28"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-brand-deep/80 via-brand-deep/25 to-transparent"
        aria-hidden="true"
      />
      <p className="sr-only">{hero.alt}</p>

      <Container className="relative flex min-h-[28rem] flex-col justify-end pb-10 pt-16 sm:min-h-[32rem] sm:pb-12 lg:min-h-[min(36rem,72dvh)] lg:justify-center lg:py-20">
        <div className="max-w-xl">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/72">
            {site.copy.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,7vw,3.35rem)] font-medium leading-[1.08] tracking-[-0.03em]">
            {site.copy.heroTitle}
          </h1>
          <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-white/86 sm:text-lg">
            {site.copy.heroText}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink
              to="/offerte-aanvragen"
              size="lg"
              className="min-h-12 px-6 sm:min-w-[13.5rem]"
            >
              {site.copy.ctaQuote}
            </ButtonLink>
            <ButtonLink
              to="/afspraak-maken"
              variant="ghost"
              size="lg"
              className="min-h-12 border border-white/45 bg-white/8 px-6 text-white hover:border-white hover:bg-white/16 sm:min-w-[13.5rem]"
            >
              {site.copy.ctaAppointment}
            </ButtonLink>
          </div>

          <p className="mt-5 text-sm">
            <a href={site.contact.phoneHref} className="font-semibold text-white/90 underline-offset-4 hover:underline">
              Of bel {site.contact.phone}
            </a>
          </p>
          <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/55">
            {serviceArea.provinces.map((item) => item.name).join(' · ')}
          </p>
        </div>
      </Container>
    </section>
  )
}

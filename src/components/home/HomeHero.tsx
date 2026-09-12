import { pageImages, mediaPositionStyle } from '../../data/media'
import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { ButtonLink } from '../ButtonLink'

const hero = pageImages.homeHero
const heroCrop = mediaPositionStyle({
  objectPosition: '78% 62%',
  objectPositionMobile: '82% 68%',
})

export function HomeHero() {
  return (
    <section className="bg-paper">
      <div className="lg:grid lg:grid-cols-2 lg:items-stretch">
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9] lg:aspect-auto lg:min-h-[22rem] lg:max-h-[28rem]">
          <img
            src={hero.src}
            alt=""
            width={hero.width}
            height={hero.height}
            fetchPriority="high"
            decoding="async"
            className="media-photo absolute inset-0 size-full max-w-none object-cover"
            style={heroCrop}
          />
          <p className="sr-only">{hero.alt}</p>
        </div>

        <div className="flex flex-col justify-center px-5 py-7 sm:px-8 sm:py-10 lg:px-12 lg:py-12 xl:px-16">
          <div className="max-w-[30rem]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
              {site.copy.eyebrow}
            </p>
            <h1 className="mt-2 font-display text-[clamp(1.85rem,6.6vw,2.85rem)] font-medium leading-[1.12] tracking-[-0.025em] text-ink">
              CV-ketel, airco en warmtepomp
            </h1>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted sm:text-base">
              {site.copy.heroText}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <ButtonLink
                to="/offerte-aanvragen"
                size="md"
                className="w-full px-2 text-center text-[0.8125rem] leading-tight sm:text-[0.9rem]"
              >
                Offerte aanvragen
              </ButtonLink>
              <ButtonLink
                to="/afspraak-maken"
                variant="secondary"
                size="md"
                className="w-full px-2 text-center text-[0.8125rem] leading-tight sm:text-[0.9rem]"
              >
                Afspraak maken
              </ButtonLink>
            </div>
            <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              {serviceArea.provinces.map((item) => item.name).join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

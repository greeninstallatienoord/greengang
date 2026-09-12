import { pageImages, mediaPositionStyle } from '../../data/media'
import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { ButtonLink } from '../ButtonLink'

const hero = pageImages.homeHero
const heroCrop = mediaPositionStyle({
  objectPosition: '50% 82%',
  objectPositionMobile: '50% 88%',
})

export function HomeHero() {
  return (
    <section className="bg-surface lg:bg-brand-deep">
      <div className="lg:grid lg:min-h-[min(34rem,74dvh)] lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10] lg:aspect-auto lg:min-h-full">
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

        <div className="relative z-10 mx-4 -mt-12 sm:mx-6 sm:-mt-14 lg:mx-0 lg:mt-0 lg:flex lg:items-center lg:px-12 lg:py-16 xl:px-16">
          <div className="rounded-xl border border-line bg-paper px-5 py-6 text-ink shadow-lift sm:px-7 sm:py-7 lg:max-w-[32rem] lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:text-white lg:shadow-none">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-dark lg:text-white/80">
              {site.copy.eyebrow}
            </p>
            <h1 className="mt-2 font-display text-[clamp(1.85rem,7vw,3rem)] font-medium leading-[1.12] tracking-[-0.025em]">
              CV-ketel, airco en warmtepomp
            </h1>
            <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-muted lg:max-w-[26rem] lg:text-white/88">
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
                className="w-full px-2 text-center text-[0.8125rem] leading-tight sm:text-[0.9rem] lg:border-white/70 lg:bg-white/10 lg:text-white lg:hover:border-white lg:hover:bg-white/20"
              >
                Afspraak maken
              </ButtonLink>
            </div>
            <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-muted lg:text-white/70">
              {serviceArea.provinces.map((item) => item.name).join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

import { pageImages, mediaPositionStyle } from '../../data/media'
import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { CtaPair } from '../CtaPair'

const hero = pageImages.homeHero
const heroCrop = mediaPositionStyle({
  objectPosition: hero.objectPosition ?? '50% 50%',
  objectPositionMobile: '50% 46%',
})

export function HomeHero() {
  return (
    <section className="bg-brand-deep text-white">
      <div className="lg:grid lg:min-h-[min(36rem,78dvh)] lg:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9] lg:aspect-auto lg:min-h-full">
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

        <div className="flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16 xl:px-16">
          <div className="max-w-[32rem]">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/88">
              {site.copy.eyebrow}
            </p>
            <h1 className="mt-2.5 font-display text-[clamp(1.95rem,7.4vw,3rem)] font-medium leading-[1.14] tracking-[-0.025em] text-white">
              CV-ketel, airco en warmtepomp
            </h1>
            <p className="mt-3 max-w-[26rem] text-[1rem] leading-relaxed text-white/92 sm:text-[1.05rem]">
              {site.copy.heroText}
            </p>
            <CtaPair className="mt-6" size="md" onDark showCall />
            <p className="mt-4 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-white/80">
              {serviceArea.provinces.map((item) => item.name).join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

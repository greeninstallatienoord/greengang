import { pageImages, mediaPositionStyle } from '../../data/media'
import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { CtaPair } from '../CtaPair'

const hero = pageImages.homeHero

export function HomeHero() {
  return (
    <section className="bg-brand-deep text-white">
      <div className="grid lg:grid-cols-2 lg:min-h-[min(36rem,78dvh)]">
        <div className="relative aspect-[5/4] max-h-[min(22rem,52dvh)] overflow-hidden sm:max-h-[min(26rem,50dvh)] lg:aspect-auto lg:max-h-none lg:min-h-full">
          <img
            src={hero.src}
            alt=""
            width={hero.width}
            height={hero.height}
            fetchPriority="high"
            decoding="async"
            className="media-photo absolute inset-0 size-full max-w-none object-cover"
            style={mediaPositionStyle(hero)}
          />
          <p className="sr-only">{hero.alt}</p>
        </div>

        <div className="flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16 xl:px-16">
          <div className="max-w-[32rem]">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/78">
              {site.copy.eyebrow}
            </p>
            <h1 className="mt-2.5 font-display text-[clamp(1.85rem,7vw,3rem)] font-medium leading-[1.16] tracking-[-0.025em]">
              CV-ketel, airco en warmtepomp
            </h1>
            <p className="mt-3 max-w-[26rem] text-[0.95rem] leading-relaxed text-white/86 sm:text-[1.05rem]">
              {site.copy.heroText}
            </p>
            <CtaPair className="mt-5" size="md" onDark showCall />
            <p className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white/70">
              {serviceArea.provinces.map((item) => item.name).join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

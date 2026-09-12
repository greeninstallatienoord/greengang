import { pageImages, mediaPositionStyle } from '../../data/media'
import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { CtaPair } from '../CtaPair'

const hero = pageImages.homeHero

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-deep text-white">
      <div className="lg:grid lg:min-h-[min(36rem,78dvh)] lg:grid-cols-2">
        <div className="absolute inset-0 lg:relative lg:min-h-full">
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
          <div
            className="absolute inset-0 lg:hidden"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(180deg, rgb(16 36 24 / 0.28) 0%, rgb(16 36 24 / 0.42) 32%, rgb(16 36 24 / 0.88) 64%, #102418 100%)',
            }}
          />
          <p className="sr-only">{hero.alt}</p>
        </div>

        <div className="relative z-10 flex min-h-[min(34rem,88dvh)] flex-col justify-end px-5 pb-8 pt-24 sm:min-h-[min(36rem,80dvh)] sm:px-8 sm:pb-10 sm:pt-28 lg:min-h-0 lg:justify-center lg:px-12 lg:py-16 xl:px-16">
          <div className="max-w-[32rem]">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white">
              {site.copy.eyebrow}
            </p>
            <h1 className="mt-2.5 font-display text-[clamp(2rem,8vw,3rem)] font-medium leading-[1.12] tracking-[-0.025em] text-white">
              CV-ketel, airco en warmtepomp
            </h1>
            <p className="mt-3 max-w-[26rem] text-[1rem] leading-relaxed text-white sm:text-[1.05rem]">
              {site.copy.heroText}
            </p>
            <CtaPair className="mt-6" size="md" onDark showCall />
            <p className="mt-4 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-white/88">
              {serviceArea.provinces.map((item) => item.name).join(' · ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

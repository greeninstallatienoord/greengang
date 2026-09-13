import { HeroSlideshow } from './HeroSlideshow'
import { heroSlideshowCopy } from '../../data/heroSlideshow'
import { business } from '../../data/business'
import { serviceArea } from '../../data/region'
import { site } from '../../data/site'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'

export function HomeHero() {
  const emergency = business.emergencyService

  return (
    <section className="relative isolate overflow-hidden bg-brand-deep text-white">
      <HeroSlideshow />
      <p className="sr-only">
        Achtergrondfoto’s van eigen installaties van Green Installatie Noord.
      </p>

      <Container className="relative flex min-h-[clamp(22rem,68svh,28rem)] flex-col justify-end pb-7 pt-10 min-[375px]:min-h-[clamp(23rem,66svh,29rem)] min-[375px]:pb-8 sm:min-h-[26rem] sm:pb-11 sm:pt-12 lg:min-h-[min(30rem,62dvh)] lg:justify-center lg:py-14 xl:min-h-[min(32rem,58dvh)]">
        <div className="max-w-xl pb-1 sm:pb-0">
          <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-white/72 uppercase min-[390px]:text-[0.68rem] min-[390px]:tracking-[0.18em]">
            {site.copy.eyebrow}
          </p>
          <h1 className="mt-2.5 font-display text-[clamp(1.65rem,6.8vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.03em] text-pretty min-[390px]:mt-3">
            {site.copy.heroTitle}
          </h1>
          <p className="mt-3 max-w-[22rem] text-[0.92rem] leading-relaxed text-white/86 min-[390px]:mt-3.5 min-[390px]:max-w-md min-[390px]:text-[0.95rem] sm:text-lg">
            {site.copy.heroText}
          </p>

          <div className="mt-5 flex w-full max-w-md flex-col gap-2 min-[390px]:max-w-none min-[390px]:flex-row min-[390px]:flex-wrap min-[390px]:items-stretch sm:mt-7">
            <ButtonLink
              to="/offerte-aanvragen"
              size="md"
              className="min-h-11 w-full whitespace-nowrap px-4 text-[0.875rem] min-[390px]:w-auto min-[390px]:flex-none min-[390px]:px-3.5 min-[390px]:text-[0.8125rem] min-[430px]:px-4 min-[430px]:text-[0.875rem] sm:min-h-12 sm:min-w-[12.5rem] sm:px-6 sm:text-[0.9375rem]"
            >
              {site.copy.ctaQuote}
            </ButtonLink>
            <ButtonLink
              to="/afspraak-maken"
              variant="ghost"
              size="md"
              className="min-h-11 w-full whitespace-nowrap border border-white/45 bg-white/8 px-4 text-[0.875rem] text-white hover:border-white hover:bg-white/16 min-[390px]:w-auto min-[390px]:flex-none min-[390px]:px-3.5 min-[390px]:text-[0.8125rem] min-[430px]:px-4 min-[430px]:text-[0.875rem] sm:min-h-12 sm:min-w-[12.5rem] sm:px-6 sm:text-[0.9375rem]"
            >
              {site.copy.ctaAppointment}
            </ButtonLink>
          </div>

          {/* Secondary phone / emergency — does not compete with primary CTAs */}
          <div className="mt-3.5 sm:mt-5">
            {emergency.available ? (
              <>
                <p className="hidden text-sm text-white/75 sm:block">
                  {emergency.summary}{' '}
                  <a
                    href={emergency.phoneHref}
                    className="font-semibold text-white underline-offset-4 hover:underline"
                    aria-label={`${emergency.label}: bel ${emergency.phone}`}
                  >
                    Bel {emergency.phone}
                  </a>
                </p>
                <a
                  href={emergency.phoneHref}
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-white/90 underline-offset-4 hover:underline sm:hidden"
                  aria-label={`${emergency.label}: bel ${emergency.phone}`}
                >
                  24/7 storing? Bel {emergency.phone}
                  <span aria-hidden="true">→</span>
                </a>
              </>
            ) : (
              <p className="text-sm">
                <a
                  href={site.contact.phoneHref}
                  className="inline-flex min-h-10 items-center font-semibold text-white/90 underline-offset-4 hover:underline"
                >
                  Of bel {site.contact.phone}
                </a>
              </p>
            )}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-[0.68rem] font-semibold tracking-[0.12em] text-white/55 uppercase min-[390px]:tracking-[0.14em]">
              {serviceArea.provinces.map((item) => item.name).join(' · ')}
            </p>
            <span className="hidden text-white/30 min-[390px]:inline" aria-hidden="true">
              ·
            </span>
            <p className="text-[0.68rem] font-semibold tracking-[0.12em] text-white/55 uppercase min-[390px]:tracking-[0.14em]">
              {heroSlideshowCopy.practiceLabel}
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

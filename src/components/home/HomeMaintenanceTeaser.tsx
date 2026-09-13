import { ArrowRight, Check } from 'lucide-react'
import { business } from '../../data/business'
import {
  formatEuroFromCents,
  maintenanceConfig,
  maintenanceTeaserCopy,
  startingPriceCents,
} from '../../data/maintenance'
import { pageImages } from '../../data/media'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { MediaImage } from '../media/MediaImage'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

export function HomeMaintenanceTeaser() {
  const price = formatEuroFromCents(startingPriceCents())

  return (
    <Section className="bg-brand-deep text-white">
      <Container>
        <Reveal>
          <div className="grid items-stretch gap-6 lg:grid-cols-12 lg:gap-0 lg:overflow-hidden lg:border lg:border-white/12">
            <div className="lg:col-span-6">
              <MediaImage
                asset={pageImages.serviceHero}
                className="max-h-[17.5rem] overflow-hidden rounded-none sm:max-h-[22rem] lg:max-h-none"
                imgClassName="opacity-95"
                ratio="16 / 10"
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            </div>

            <div className="flex flex-col justify-center lg:col-span-6 lg:bg-brand-deep lg:px-8 lg:py-10 xl:px-10">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/70">
                {maintenanceTeaserCopy.eyebrow}
              </p>
              <Heading as="h2" className="mt-2.5 text-white sm:mt-3">
                {maintenanceTeaserCopy.title}
              </Heading>
              <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-white/82 sm:mt-4">
                {maintenanceTeaserCopy.text}
              </p>

              <ul className="mt-5 grid gap-2.5 sm:mt-6">
                {maintenanceTeaserCopy.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm text-white/88"
                  >
                    <Check
                      size={16}
                      strokeWidth={2}
                      className="mt-0.5 shrink-0 text-brand-soft"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-white/15 pt-5 sm:mt-7">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/60">
                  {maintenanceTeaserCopy.priceLabel}
                </p>
                <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-display text-[2.15rem] leading-none tracking-[-0.03em] text-white sm:text-[2.4rem]">
                    {price}
                  </span>
                  <span className="text-base font-semibold text-white/80">/ maand</span>
                </p>
                <p className="mt-1.5 text-sm text-white/65">
                  {maintenanceTeaserCopy.pricePackage}
                </p>
              </div>

              <div className="mt-5 sm:mt-6">
                <ButtonLink
                  to={maintenanceConfig.packagesHref}
                  className="min-h-11 w-full max-w-[16.5rem] sm:w-auto"
                >
                  {maintenanceTeaserCopy.cta}
                  <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </ButtonLink>
                {business.emergencyService.available ? (
                  <p className="mt-3 text-sm text-white/65">
                    Storing?{' '}
                    <a
                      href={business.emergencyService.phoneHref}
                      className="font-semibold text-white/90 underline-offset-2 hover:underline"
                      aria-label={`${business.emergencyService.label}: bel ${business.emergencyService.phone}`}
                    >
                      Bel de 24/7 storingsdienst — {business.emergencyService.phone}
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

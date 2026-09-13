import { Phone } from 'lucide-react'
import { business } from '../../data/business'
import { mediaPositionStyle, type MediaAsset } from '../../data/media'
import { site } from '../../data/site'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Heading } from '../Heading'

type CTASectionProps = {
  title?: string
  text?: string
  quoteTo?: string
  appointmentTo?: string
  image?: MediaAsset | null
}

export function CTASection({
  title = site.copy.ctaTitle,
  text = site.copy.ctaText,
  quoteTo = '/offerte-aanvragen',
  appointmentTo = '/afspraak-maken',
  image = null,
}: CTASectionProps) {
  return (
    <section className="border-t border-line bg-brand-deep text-white">
      <Container
        className={
          image
            ? 'grid items-center gap-6 py-8 sm:gap-8 sm:py-12 lg:grid-cols-12 lg:gap-16 lg:py-14'
            : 'py-8 sm:py-11 lg:py-14'
        }
      >
        <div className={image ? 'lg:col-span-6' : 'max-w-2xl'}>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/70">
            Contact
          </p>
          <Heading as="h2" className="mt-2.5 text-white sm:mt-3">
            {title}
          </Heading>
          <p className="mt-3 max-w-[36rem] text-[0.95rem] leading-relaxed text-white/82 sm:mt-3.5 sm:text-[1.05rem]">
            {text}
          </p>
          <div className="mt-5 flex w-full max-w-[21.5rem] flex-col gap-2 min-[360px]:flex-row min-[360px]:flex-wrap sm:mt-6 sm:max-w-none">
            <ButtonLink
              to={quoteTo}
              className="min-h-11 px-4 text-[0.875rem] min-[360px]:flex-1 sm:flex-none sm:px-5 sm:text-[0.9375rem]"
            >
              {site.copy.ctaQuote}
            </ButtonLink>
            <ButtonLink
              to={appointmentTo}
              variant="ghost"
              className="min-h-11 border border-white/35 bg-transparent px-4 text-[0.875rem] text-white hover:border-white hover:bg-white/10 min-[360px]:flex-1 sm:flex-none sm:px-5 sm:text-[0.9375rem]"
            >
              {site.copy.ctaAppointment}
            </ButtonLink>
          </div>
          <div className="mt-4 flex flex-col gap-1.5 sm:mt-5">
            <a
              href={site.contact.phoneHref}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/90 hover:text-white"
            >
              <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
              {site.contact.phone}
            </a>
            {business.emergencyService.available ? (
              <p className="text-sm text-white/70">
                Storing? Onze storingsdienst is 24/7 bereikbaar —{' '}
                <a
                  href={business.emergencyService.phoneHref}
                  className="font-semibold text-white/85 underline-offset-2 hover:text-white hover:underline"
                >
                  bel {business.emergencyService.phone}
                </a>
              </p>
            ) : null}
          </div>
        </div>
        {image ? (
          <div className="lg:col-span-6">
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="media-photo aspect-[4/3] w-full object-cover"
              style={mediaPositionStyle(image)}
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}
      </Container>
    </section>
  )
}

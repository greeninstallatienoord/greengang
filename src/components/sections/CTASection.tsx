import { Phone } from 'lucide-react'
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
    <section className="border-t border-line bg-paper">
      <Container
        className={
          image
            ? 'grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-12 lg:gap-16 lg:py-20'
            : 'max-w-3xl py-10 sm:py-14 lg:py-20'
        }
      >
        <div className={image ? 'lg:col-span-6' : undefined}>
          <p className="eyebrow">Contact</p>
          <Heading as="h2" className="mt-3">
            {title}
          </Heading>
          <p className="lead mt-4">{text}</p>
          <div className="mt-6 flex flex-col gap-2.5 min-[400px]:flex-row min-[400px]:flex-wrap">
            <ButtonLink to={quoteTo}>{site.copy.ctaQuote}</ButtonLink>
            <ButtonLink to={appointmentTo} variant="secondary">
              {site.copy.ctaAppointment}
            </ButtonLink>
          </div>
          <a
            href={site.contact.phoneHref}
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold hover:text-brand-dark"
          >
            <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
            {site.contact.phone}
          </a>
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

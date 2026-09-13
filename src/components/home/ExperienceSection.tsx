import { ClipboardCheck, Headphones, ShieldCheck } from 'lucide-react'
import { business } from '../../data/business'
import { pageImages } from '../../data/media'
import { site } from '../../data/site'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { MediaImage } from '../media/MediaImage'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

const trustPoints = [
  {
    title: 'Advies op locatie',
    text: 'We kijken eerst wat er speelt voordat er een voorstel komt.',
    icon: ClipboardCheck,
  },
  {
    title: 'Netjes gemonteerd',
    text: 'Leidingwerk en montage worden verzorgd uitgevoerd.',
    icon: ShieldCheck,
  },
  {
    title: 'Ook voor service',
    text: business.emergencyService.available
      ? 'Bereikbaar voor onderhoud, vragen en 24/7 storing.'
      : 'Bereikbaar voor onderhoud, vragen en storingen.',
    icon: Headphones,
  },
] as const

export function ExperienceSection() {
  return (
    <Section className="bg-paper">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <MediaImage
              asset={pageImages.homeTrustPhoto}
              className="rounded-none"
              ratio="4 / 5"
              sizes="(min-width: 1024px) 38vw, 100vw"
            />
          </Reveal>

          <Reveal className="lg:col-span-7">
            <p className="eyebrow">Uit de praktijk</p>
            <Heading as="h2" className="mt-2.5 sm:mt-3">
              {site.copy.introTitle}
            </Heading>
            <p className="lead mt-3 sm:mt-4">{site.copy.introText}</p>

            <ul className="mt-6 grid gap-4 sm:mt-7 sm:grid-cols-3 sm:gap-5">
              {trustPoints.map((point) => {
                const Icon = point.icon
                return (
                  <li
                    key={point.title}
                    className="min-w-0 border-t border-line pt-3 first:border-t-0 first:pt-0 sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0 first:sm:border-l-0 first:sm:pl-0"
                  >
                    <span className="inline-flex text-brand-dark">
                      <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <h3 className="mt-2 text-[0.95rem] font-semibold tracking-[-0.015em]">
                      {point.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                      {point.text}
                    </p>
                  </li>
                )
              })}
            </ul>

            <div className="mt-6 sm:mt-7">
              <ButtonLink to="/werk" variant="secondary" size="sm">
                Bekijk meer werk
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

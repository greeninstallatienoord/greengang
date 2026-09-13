import { ArrowRight, ClipboardCheck, Headphones, ShieldCheck } from 'lucide-react'
import { pageImages } from '../../data/media'
import { site } from '../../data/site'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { MediaImage } from '../media/MediaImage'
import { Reveal } from '../Reveal'
import { Section } from '../Section'
import { GreenFlowSection } from '../greenflow/TechnicalBackdrop'

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
    title: 'Service na oplevering',
    text: 'Bereikbaar voor onderhoud en vragen — en bij storingen via de 24/7 storingsdienst.',
    icon: Headphones,
  },
] as const

function PracticeStoryList() {
  return (
    <Reveal className="sm:hidden">
      <ol className="home-practice-list" aria-label="Werkwijze uit de praktijk">
        {trustPoints.map((point, index) => {
          const Icon = point.icon
          return (
            <li
              key={point.title}
              className="home-practice-list__item"
              style={{ ['--practice-delay' as string]: `${80 + index * 70}ms` }}
            >
              <span className="home-practice-list__icon" aria-hidden="true">
                <Icon size={18} strokeWidth={1.65} />
              </span>
              <div className="min-w-0">
                <h3 className="text-[0.98rem] font-semibold tracking-[-0.015em] text-ink">
                  {point.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{point.text}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </Reveal>
  )
}

export function ExperienceSection() {
  return (
    <GreenFlowSection variant="thermal" ambient mask="left" className="bg-paper">
      <Section className="!bg-transparent">
        <Container>
          <div className="grid items-center gap-5 min-[390px]:gap-6 lg:grid-cols-12 lg:gap-10 xl:gap-12">
            <Reveal className="lg:col-span-5" image>
              <MediaImage
                asset={pageImages.homeTrustPhoto}
                variant="project"
                className="mx-auto w-fit max-w-full max-h-[14.5rem] rounded-none min-[390px]:max-h-[16.5rem] sm:max-h-[22rem] lg:max-h-[26rem]"
                sizes="(min-width: 1024px) 38vw, 100vw"
              />
            </Reveal>

            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow">Uit de praktijk</p>
                <Heading
                  as="h2"
                  className="mt-2.5 text-balance text-[clamp(1.35rem,5.2vw,2.15rem)] sm:mt-3 sm:text-[clamp(1.4rem,2.8vw,2.15rem)]"
                >
                  {site.copy.introTitle}
                </Heading>
                <p className="lead mt-3 sm:mt-4">{site.copy.introText}</p>
              </Reveal>

              <PracticeStoryList />

              <ul className="mt-6 hidden gap-4 sm:mt-7 sm:grid sm:grid-cols-3">
                {trustPoints.map((point) => {
                  const Icon = point.icon
                  return (
                    <li
                      key={point.title}
                      className="min-w-0 border-l border-line pl-4 first:border-l-0 first:pl-0"
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

              <Reveal delay={280} className="mt-6 sm:mt-7">
                <ButtonLink
                  to="/werk"
                  variant="secondary"
                  size="sm"
                  className="min-h-11 gap-1.5"
                >
                  Bekijk meer werk
                  <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
                </ButtonLink>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </GreenFlowSection>
  )
}

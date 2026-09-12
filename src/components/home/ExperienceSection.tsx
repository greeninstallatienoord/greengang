import { site } from '../../data/site'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

const points = [
  {
    title: 'Cv-ketelinstallaties',
    text: 'Vervanging of nieuwe plaatsing, afgestemd op de bestaande situatie.',
  },
  {
    title: 'Airconditioning',
    text: 'Binnen- en buitenunits, met aandacht voor leidingwerk en afwerking.',
  },
  {
    title: 'Warmtepompen',
    text: 'Eerst de woning beoordelen, daarna een voorstel dat daarbij past.',
  },
  {
    title: 'Onderhoud van cv-ketels',
    text: 'Controle en service, zodat de installatie in beeld blijft.',
  },
] as const

export function ExperienceSection() {
  return (
    <Section className="bg-paper">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Aanpak</p>
            <Heading as="h2" className="mt-3">
              {site.copy.introTitle}
            </Heading>
            <p className="lead mt-4">{site.copy.introText}</p>
            <p className="mt-5 max-w-xl text-ink-muted">
              Green Installatie Noord installeert en onderhoudt cv-ketels,
              airconditioning en warmtepompen. Oplossingen afgestemd op de
              woning, niet op een standaardpakket.
            </p>
          </div>
        </Reveal>
        <Reveal className="mt-8 sm:mt-10">
          <ul className="grid gap-6 border-t border-line pt-7 sm:grid-cols-2 sm:gap-8 sm:pt-9 xl:grid-cols-4">
            {points.map((point, index) => (
              <li key={point.title}>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-lg font-semibold tracking-[-0.015em]">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {point.text}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  )
}

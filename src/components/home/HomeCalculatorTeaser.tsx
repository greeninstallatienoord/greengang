import { ArrowRight, Calculator } from 'lucide-react'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

export function HomeCalculatorTeaser() {
  return (
    <Section className="!py-6 sm:!py-9 lg:!py-12">
      <Container>
        <Reveal>
          <div className="grid items-center gap-5 border border-line bg-paper p-4 min-[390px]:p-5 sm:gap-7 sm:p-7 lg:grid-cols-12 lg:p-8">
            <div className="lg:col-span-7">
              <p className="eyebrow">Bereken uw situatie</p>
              <Heading as="h2" className="mt-2.5 sm:mt-3">
                Wat kan een warmtepomp u opleveren?
              </Heading>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-muted sm:mt-3.5">
                Ontvang snel een indicatie op basis van uw situatie. De uitkomst is
                richtinggevend — geen offerte en geen garantie.
              </p>
              <div className="mt-5 flex w-full max-w-[22rem] flex-col gap-2 min-[400px]:flex-row sm:mt-6 sm:max-w-none">
                <ButtonLink
                  to="/warmtepomp#besparing"
                  className="min-h-11 justify-center px-4 sm:justify-start sm:px-5"
                >
                  Bereken mijn situatie
                  <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                </ButtonLink>
                <ButtonLink
                  to="/warmtepomp"
                  variant="secondary"
                  className="min-h-11 justify-center px-4 sm:justify-start sm:px-5"
                >
                  Meer over warmtepompen
                </ButtonLink>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="border border-line bg-surface px-4 py-5 sm:px-5 sm:py-6">
                <span className="inline-flex size-10 items-center justify-center bg-brand-soft text-brand-dark">
                  <Calculator size={20} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-semibold tracking-[-0.01em]">
                  Gratis warmtepompindicatie
                </p>
                <ul className="mt-3 grid gap-2 text-sm text-ink-muted">
                  <li>Hybride of all-electric</li>
                  <li>Op basis van uw gasverbruik</li>
                  <li>Daarna gericht verder naar advies of offerte</li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

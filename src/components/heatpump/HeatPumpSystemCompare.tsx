import { heatPumpSystemCopy } from '../../data/heatPumpAssumptions'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

export function HeatPumpSystemCompare() {
  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow">Keuze</p>
          <Heading as="h2" className="mt-2.5 sm:mt-3">
            Hybride of all-electric?
          </Heading>
          <p className="lead mt-3 sm:mt-4">
            Welke oplossing past, hangt onder meer af van de woning, isolatie en
            het afgiftesysteem.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:mt-8 lg:grid-cols-2 lg:gap-4">
          {(Object.keys(heatPumpSystemCopy) as Array<keyof typeof heatPumpSystemCopy>).map(
            (key) => {
              const item = heatPumpSystemCopy[key]
              return (
                <article
                  key={key}
                  className="border border-line bg-paper p-4 sm:p-6"
                >
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink-muted">
                    {item.points.map((point) => (
                      <li key={point} className="border-t border-line pt-2.5 first:border-t-0 first:pt-0">
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              )
            },
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2.5 min-[360px]:flex-row sm:mt-8">
          <ButtonLink
            to="/afspraak-maken?dienst=warmtepomp&type=adviesgesprek"
            className="min-h-11"
          >
            Laat uw woning beoordelen
          </ButtonLink>
          <ButtonLink
            to="/offerte-aanvragen?dienst=warmtepomp"
            variant="secondary"
            className="min-h-11"
          >
            Vraag warmtepompadvies aan
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}

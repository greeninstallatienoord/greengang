import { useMemo, useState } from 'react'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

type DwellingType = 'rijtjes' | 'vrijstaand' | 'appartement' | 'anders'
type BuildEra = 'voor-1990' | '1990-2010' | 'na-2010' | 'weet-niet'
type Insulation = 'matig' | 'redelijk' | 'goed' | 'weet-niet'
type Heating = 'cv' | 'hybride' | 'anders'

type Outcome = {
  title: string
  text: string
  prefer: 'hybrid' | 'all-electric' | 'visit'
}

function assess(input: {
  dwelling: DwellingType
  buildEra: BuildEra
  insulation: Insulation
  heating: Heating
}): Outcome {
  const newer = input.buildEra === 'na-2010'
  const older = input.buildEra === 'voor-1990'
  const goodShell = input.insulation === 'goed' || (newer && input.insulation !== 'matig')
  const weakShell =
    input.insulation === 'matig' || (older && input.insulation === 'weet-niet')

  if (input.dwelling === 'appartement' && weakShell) {
    return {
      title: 'We bekijken dit graag op locatie',
      text: 'Bij appartementen spelen vaak regels rond buitenunits, leidingroutes en gezamenlijke installaties. Een korte beoordeling voorkomt verkeerde verwachtingen.',
      prefer: 'visit',
    }
  }

  if (goodShell && !weakShell && input.heating === 'cv') {
    return {
      title: 'Voor all-electric is aanvullende beoordeling verstandig',
      text: 'Uw antwoorden wijzen op een mogelijk gunstige start. Of all-electric past, hangt nog af van afgifte, warm water en de elektrische aansluiting.',
      prefer: 'all-electric',
    }
  }

  if (weakShell || input.insulation === 'weet-niet') {
    return {
      title: 'Een hybride warmtepomp lijkt het onderzoeken waard',
      text: 'Bij onzekere of matige isolatie is hybride vaak de realistische eerste stap. De cv-ketel blijft beschikbaar als er bijspringen nodig is.',
      prefer: 'hybrid',
    }
  }

  return {
    title: 'Een hybride warmtepomp lijkt het onderzoeken waard',
    text: 'Op basis van deze antwoorden is hybride vaak een logische richting. Welke oplossing past, hangt onder meer af van de woning, isolatie en het afgiftesysteem.',
    prefer: 'hybrid',
  }
}

export function HeatPumpSuitability() {
  const [dwelling, setDwelling] = useState<DwellingType>('rijtjes')
  const [buildEra, setBuildEra] = useState<BuildEra>('1990-2010')
  const [insulation, setInsulation] = useState<Insulation>('weet-niet')
  const [heating, setHeating] = useState<Heating>('cv')
  const [submitted, setSubmitted] = useState(false)

  const outcome = useMemo(
    () => assess({ dwelling, buildEra, insulation, heating }),
    [dwelling, buildEra, insulation, heating],
  )

  const adviceHref =
    outcome.prefer === 'all-electric'
      ? '/afspraak-maken?dienst=warmtepomp&type=adviesgesprek&systeem=all-electric'
      : outcome.prefer === 'hybrid'
        ? '/afspraak-maken?dienst=warmtepomp&type=adviesgesprek&systeem=hybrid'
        : '/afspraak-maken?dienst=warmtepomp&type=adviesgesprek'

  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow">Eerste check</p>
          <Heading as="h2" className="mt-2.5 sm:mt-3">
            Is een warmtepomp het overwegen waard?
          </Heading>
          <p className="lead mt-3 sm:mt-4">
            Een korte check helpt om de richting te bepalen. Dit is geen
            definitief oordeel over geschiktheid.
          </p>
        </div>

        <form
          className="mt-6 grid max-w-3xl gap-4 sm:mt-8 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitted(true)
          }}
        >
          <SelectField
            label="Type woning"
            value={dwelling}
            onChange={(value) => setDwelling(value as DwellingType)}
            options={[
              { value: 'rijtjes', label: 'Rijtjeswoning / 2-onder-1-kap' },
              { value: 'vrijstaand', label: 'Vrijstaand' },
              { value: 'appartement', label: 'Appartement' },
              { value: 'anders', label: 'Anders / weet ik niet' },
            ]}
          />
          <SelectField
            label="Bouwjaar (indicatie)"
            value={buildEra}
            onChange={(value) => setBuildEra(value as BuildEra)}
            options={[
              { value: 'voor-1990', label: 'Voor 1990' },
              { value: '1990-2010', label: '1990 – 2010' },
              { value: 'na-2010', label: 'Na 2010' },
              { value: 'weet-niet', label: 'Weet ik niet' },
            ]}
          />
          <SelectField
            label="Isolatie"
            value={insulation}
            onChange={(value) => setInsulation(value as Insulation)}
            options={[
              { value: 'matig', label: 'Matig' },
              { value: 'redelijk', label: 'Redelijk' },
              { value: 'goed', label: 'Goed' },
              { value: 'weet-niet', label: 'Weet ik niet' },
            ]}
          />
          <SelectField
            label="Huidige verwarming"
            value={heating}
            onChange={(value) => setHeating(value as Heating)}
            options={[
              { value: 'cv', label: 'CV-ketel' },
              { value: 'hybride', label: 'Al hybride' },
              { value: 'anders', label: 'Anders' },
            ]}
          />
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="inline-flex min-h-11 items-center bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Bekijk indicatie
            </button>
          </div>
        </form>

        {submitted ? (
          <div className="mt-5 max-w-3xl border border-line bg-paper p-4 sm:p-5">
            <h3 className="text-lg font-semibold tracking-[-0.015em]">
              {outcome.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {outcome.text}
            </p>
            <div className="mt-4 flex flex-col gap-2 min-[360px]:flex-row">
              <ButtonLink to={adviceHref} className="min-h-11">
                Laat uw woning beoordelen
              </ButtonLink>
              <ButtonLink
                to="/warmtepomp#besparing"
                variant="secondary"
                className="min-h-11"
              >
                Naar de besparingsindicatie
              </ButtonLink>
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <label className="block text-sm">
      <span className="font-semibold">{label}</span>
      <select
        className="mt-1.5 min-h-11 w-full border border-line bg-surface px-3"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

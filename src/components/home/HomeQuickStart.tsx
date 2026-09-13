import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { quoteServiceOptions, situationsFor } from '../../data/forms'
import type { QuoteServiceOption, QuoteSituation } from '../../types'
import { Button } from '../Button'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

const services = quoteServiceOptions.filter((item) => item.value !== 'overig')

function situationForService(
  service: QuoteServiceOption,
  current: QuoteSituation,
): QuoteSituation {
  const allowed = situationsFor(service)
  return allowed.some((item) => item.value === current)
    ? current
    : (allowed[0]?.value ?? 'weet-ik-niet')
}

export function HomeQuickStart() {
  const navigate = useNavigate()
  const [service, setService] = useState<QuoteServiceOption>('cv-ketel')
  const [situation, setSituation] = useState<QuoteSituation>('weet-ik-niet')
  const situations = situationsFor(service)
  const selectedSituation = situationForService(service, situation)

  return (
    <Section className="bg-brand-deep text-white !py-6 sm:!py-10 lg:!py-12">
      <Container className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-8">
        <div className="max-w-xl">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/70">
            Offerte
          </p>
          <Heading as="h2" className="mt-2.5 text-white sm:mt-3">
            Waar kunnen we u mee helpen?
          </Heading>
          <p className="mt-2.5 max-w-md text-[0.92rem] leading-relaxed text-white/82 sm:mt-3 sm:text-[0.95rem]">
            Kies de dienst en de situatie. U gaat daarna verder naar het
            offerteformulier met uw keuze al ingevuld.
          </p>
        </div>

        <form
          className="grid gap-3.5 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            navigate(
              `/offerte-aanvragen?dienst=${encodeURIComponent(service)}&situatie=${encodeURIComponent(selectedSituation)}`,
            )
          }}
        >
          <label className="grid gap-1.5 text-[0.9375rem]">
            <span className="font-semibold text-white">Dienst</span>
            <select
              className="min-h-12 touch-manipulation rounded-sm border border-white/20 bg-white px-3 text-base text-ink"
              value={service}
              onChange={(event) => {
                const next = event.target.value as QuoteServiceOption
                setService(next)
                setSituation((current) => situationForService(next, current))
              }}
            >
              {services.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-[0.9375rem]">
            <span className="font-semibold text-white">Situatie</span>
            <select
              className="min-h-12 touch-manipulation rounded-sm border border-white/20 bg-white px-3 text-base text-ink"
              value={selectedSituation}
              onChange={(event) => setSituation(event.target.value as QuoteSituation)}
            >
              {situations.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <Button
            type="submit"
            className="mt-0.5 min-h-12 w-full max-w-[12.5rem] justify-self-start touch-manipulation sm:mt-0 sm:w-auto sm:max-w-none sm:px-6"
          >
            Verder →
          </Button>
        </form>
      </Container>
    </Section>
  )
}

import { useMemo, useState } from 'react'
import {
  heatPumpAssumptions,
  heatPumpGasUsage,
  isdeInfo,
  type HeatPumpSystem,
} from '../../data/heatPumpAssumptions'
import {
  calculateHeatPumpIndication,
  formatEuro,
  formatNumberNl,
} from '../../lib/heatPumpCalculator'
import { cn } from '../../lib/cn'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Section } from '../Section'

function buildQuoteHref(system: HeatPumpSystem, gasM3: number): string {
  const params = new URLSearchParams({
    dienst: 'warmtepomp',
    systeem: system,
    gasverbruik: String(gasM3),
  })
  return `/offerte-aanvragen?${params.toString()}`
}

function buildAdviceHref(system: HeatPumpSystem, gasM3: number): string {
  const params = new URLSearchParams({
    dienst: 'warmtepomp',
    type: 'adviesgesprek',
    systeem: system,
    gasverbruik: String(gasM3),
  })
  return `/afspraak-maken?${params.toString()}`
}

export function HeatPumpCalculator() {
  const a = heatPumpAssumptions
  const gas = heatPumpGasUsage

  const [system, setSystem] = useState<HeatPumpSystem>('hybrid')
  const [gasM3, setGasM3] = useState<number>(gas.defaultM3)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [gasPrice, setGasPrice] = useState<number>(a.prices.gasEurPerM3)
  const [elecPrice, setElecPrice] = useState<number>(a.prices.electricityEurPerKwh)
  const [scop, setScop] = useState<number>(a.scop.hybrid)
  const [investment, setInvestment] = useState<string>('')
  const [subsidyOverride, setSubsidyOverride] = useState<string>('')

  // Keep SCOP in sync when switching system unless user opened advanced and edited.
  const [scopTouched, setScopTouched] = useState(false)

  function selectSystem(next: HeatPumpSystem) {
    setSystem(next)
    if (!scopTouched) setScop(a.scop[next])
  }

  const investmentEur = investment.trim() === '' ? null : Number(investment)
  const subsidyEur =
    subsidyOverride.trim() === ''
      ? a.illustrativeSubsidyEur[system]
      : Number(subsidyOverride)

  const result = useMemo(
    () =>
      calculateHeatPumpIndication({
        system,
        gasM3PerYear: gasM3,
        gasEurPerM3: gasPrice,
        electricityEurPerKwh: elecPrice,
        scop,
        investmentEur:
          investmentEur != null && Number.isFinite(investmentEur) && investmentEur > 0
            ? investmentEur
            : null,
        possibleSubsidyEur:
          subsidyEur != null && Number.isFinite(subsidyEur) ? subsidyEur : null,
      }),
    [system, gasM3, gasPrice, elecPrice, scop, investmentEur, subsidyEur],
  )

  const scaleLabel =
    gas.scale.find((item, index) => {
      const next = gas.scale[index + 1]
      return gasM3 <= item.at || !next || gasM3 < next.at
    })?.label ?? gas.scale[gas.scale.length - 1]?.label

  return (
    <Section className="bg-paper">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow">Indicatie</p>
          <Heading as="h2" className="mt-2.5 sm:mt-3">
            Wat kan een warmtepomp u opleveren?
          </Heading>
          <p className="lead mt-3 sm:mt-4">
            Vul uw huidige gasverbruik in en bekijk een indicatie van het
            energieverbruik, de jaarlijkse besparing en mogelijke
            terugverdientijd.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:mt-8 lg:grid-cols-2 lg:gap-0 lg:overflow-hidden lg:border lg:border-line">
          {/* Left: situation */}
          <div className="border border-line bg-surface p-4 sm:p-6 lg:border-0 lg:border-r lg:border-line">
            <h3 className="text-base font-semibold tracking-[-0.015em]">
              Jouw situatie
            </h3>

            <fieldset className="mt-4">
              <legend className="text-sm font-semibold text-ink-muted">
                Welk systeem?
              </legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'hybrid', label: 'Hybride' },
                    { id: 'all-electric', label: 'All-electric' },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={cn(
                      'min-h-11 border px-3 text-sm font-semibold transition-colors',
                      system === option.id
                        ? 'border-brand bg-brand text-white'
                        : 'border-line bg-paper text-ink hover:border-ink/30',
                    )}
                    aria-pressed={system === option.id}
                    onClick={() => selectSystem(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-5">
              <div className="flex items-end justify-between gap-3">
                <label
                  htmlFor="hp-gas-m3"
                  className="text-sm font-semibold text-ink-muted"
                >
                  Huidig gasverbruik per jaar
                </label>
                <p className="font-display text-xl leading-none tracking-[-0.02em] text-brand-dark">
                  {formatNumberNl(gasM3)}{' '}
                  <span className="text-sm font-sans font-semibold text-ink-muted">
                    m³
                  </span>
                </p>
              </div>
              <input
                id="hp-gas-slider"
                type="range"
                min={gas.minM3}
                max={gas.maxM3}
                step={gas.stepM3}
                value={gasM3}
                aria-label="Gasverbruik per jaar"
                className="mt-3 h-11 w-full cursor-pointer accent-brand"
                onChange={(event) => setGasM3(Number(event.target.value))}
              />
              <div className="mt-1 flex justify-between text-[0.7rem] text-ink-muted">
                <span>{formatNumberNl(gas.minM3)} m³</span>
                <span>{scaleLabel}</span>
                <span>{formatNumberNl(gas.maxM3)} m³</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  id="hp-gas-m3"
                  type="number"
                  min={gas.minM3}
                  max={gas.maxM3}
                  step={gas.stepM3}
                  value={gasM3}
                  className="min-h-11 w-28 border border-line bg-paper px-3 text-sm"
                  onChange={(event) => {
                    const next = Number(event.target.value)
                    if (!Number.isFinite(next)) return
                    setGasM3(
                      Math.min(gas.maxM3, Math.max(gas.minM3, Math.round(next))),
                    )
                  }}
                />
                <span className="text-sm text-ink-muted">m³ / jaar</span>
              </div>
            </div>

            <div className="mt-5 border-t border-line pt-4">
              <button
                type="button"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-dark underline-offset-2 hover:underline"
                aria-expanded={advancedOpen}
                onClick={() => setAdvancedOpen((value) => !value)}
              >
                {advancedOpen ? 'Berekening verbergen' : 'Berekening aanpassen'}
              </button>
              {advancedOpen ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="font-medium">Gasprijs (€/m³)</span>
                    <input
                      type="number"
                      min={0.5}
                      max={5}
                      step={0.01}
                      value={gasPrice}
                      className="mt-1 min-h-11 w-full border border-line bg-paper px-3"
                      onChange={(event) => setGasPrice(Number(event.target.value))}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium">Elektriciteit (€/kWh)</span>
                    <input
                      type="number"
                      min={0.05}
                      max={1}
                      step={0.01}
                      value={elecPrice}
                      className="mt-1 min-h-11 w-full border border-line bg-paper px-3"
                      onChange={(event) => setElecPrice(Number(event.target.value))}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium">Verwachte SCOP</span>
                    <input
                      type="number"
                      min={1.5}
                      max={6}
                      step={0.1}
                      value={scop}
                      className="mt-1 min-h-11 w-full border border-line bg-paper px-3"
                      onChange={(event) => {
                        setScopTouched(true)
                        setScop(Number(event.target.value))
                      }}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-medium">Installatie-investering (€)</span>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="Optioneel"
                      value={investment}
                      className="mt-1 min-h-11 w-full border border-line bg-paper px-3"
                      onChange={(event) => setInvestment(event.target.value)}
                    />
                  </label>
                  <label className="block text-sm sm:col-span-2">
                    <span className="font-medium">
                      Mogelijke ISDE-subsidie (€, indicatief)
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={50}
                      value={subsidyOverride}
                      placeholder={String(a.illustrativeSubsidyEur[system])}
                      className="mt-1 min-h-11 w-full border border-line bg-paper px-3"
                      onChange={(event) => setSubsidyOverride(event.target.value)}
                    />
                    <span className="mt-1 block text-xs text-ink-muted">
                      {isdeInfo.note}
                    </span>
                  </label>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right: indication */}
          <div className="border border-line bg-brand-deep p-4 text-white sm:p-6 lg:border-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/65">
              Jouw indicatie
            </p>
            <p className="mt-3 text-sm text-white/75">Geschatte besparing per jaar</p>
            <p
              key={result.annualSavingEur}
              className="mt-1 font-display text-[2.35rem] leading-none tracking-[-0.03em] text-white sm:text-[2.75rem]"
              style={{ animation: 'menu-in 220ms ease both' }}
            >
              {formatEuro(result.annualSavingEur)}
            </p>
            <p className="mt-2 text-sm font-semibold text-brand-soft">
              {result.savingPercent}% minder energiekosten (indicatief)
            </p>

            <dl className="mt-5 grid gap-2.5 border-t border-white/15 pt-4 text-sm">
              <Metric
                label="Huidige gaskosten"
                value={`${formatEuro(result.currentGasCostEur)} / jaar`}
              />
              <Metric
                label="Geschat resterend gasverbruik"
                value={`${formatNumberNl(result.remainingGasM3)} m³`}
              />
              <Metric
                label="Extra stroomverbruik warmtepomp"
                value={`${formatNumberNl(result.heatPumpElectricityKwh)} kWh / jaar`}
              />
              <Metric
                label="Geschatte energiekosten nieuwe situatie"
                value={`${formatEuro(result.newEnergyCostEur)} / jaar`}
              />
              <Metric
                label="Mogelijke ISDE-subsidie"
                value={
                  result.possibleSubsidyEur != null
                    ? formatEuro(result.possibleSubsidyEur)
                    : '—'
                }
              />
              {result.netInvestmentEur != null ? (
                <Metric
                  label="Netto investering na subsidie"
                  value={formatEuro(result.netInvestmentEur)}
                />
              ) : (
                <Metric
                  label="Terugverdientijd"
                  value="Vul een prijsindicatie in om terugverdientijd te berekenen"
                />
              )}
              {result.paybackYears != null ? (
                <Metric
                  label="Geschatte terugverdientijd"
                  value={`${formatNumberNl(result.paybackYears)} jaar`}
                />
              ) : result.netInvestmentEur != null ? (
                <Metric
                  label="Geschatte terugverdientijd"
                  value="Met deze uitgangspunten is geen positieve terugverdientijd te berekenen."
                />
              ) : null}
              <Metric
                label={`Energiebesparing over ${a.horizonYears} jaar`}
                value={formatEuro(result.energySavingOverHorizonEur)}
              />
              {result.netResultAfterHorizonEur != null ? (
                <Metric
                  label={`Netto financieel resultaat na investering (${a.horizonYears} jaar)`}
                  value={formatEuro(result.netResultAfterHorizonEur)}
                />
              ) : null}
            </dl>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm text-ink-muted">
          Deze berekening is een indicatie. Werkelijke besparing en
          terugverdientijd hangen onder meer af van de woning, het
          verwarmingsgedrag, energieprijzen, installatie en het gekozen
          warmtepompsysteem. {result.assumptionsSummary}{' '}
          {isdeInfo.note}
        </p>

        <div className="mt-6 border border-line bg-surface p-4 sm:mt-8 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5">
          <div className="max-w-lg">
            <Heading as="h3" className="text-xl">
              Benieuwd wat dit voor uw woning betekent?
            </Heading>
            <p className="mt-2 text-sm text-ink-muted">
              We nemen uw gasverbruik en systeemoorkeur mee in de aanvraag.
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2 min-[360px]:flex-row sm:mt-0 sm:shrink-0">
            <ButtonLink to={buildAdviceHref(system, gasM3)} className="min-h-11">
              Vraag warmtepompadvies aan
            </ButtonLink>
            <ButtonLink
              to={buildQuoteHref(system, gasM3)}
              variant="secondary"
              className="min-h-11"
            >
              Offerte aanvragen
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-white/10 pb-2.5 last:border-b-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-white/70">{label}</dt>
      <dd className="font-semibold text-white sm:text-right">{value}</dd>
    </div>
  )
}

import {
  heatPumpAssumptions,
  type HeatPumpSystem,
} from '../data/heatPumpAssumptions'

export type HeatPumpCalcInput = {
  system: HeatPumpSystem
  gasM3PerYear: number
  gasEurPerM3?: number
  electricityEurPerKwh?: number
  scop?: number
  /** Installation investment in EUR. Omit or 0 to hide payback. */
  investmentEur?: number | null
  /** Illustrative / selected ISDE amount in EUR (not a guarantee). */
  possibleSubsidyEur?: number | null
}

export type HeatPumpCalcResult = {
  system: HeatPumpSystem
  gasM3PerYear: number
  currentGasCostEur: number
  remainingGasM3: number
  heatPumpElectricityKwh: number
  newEnergyCostEur: number
  annualSavingEur: number
  savingPercent: number
  possibleSubsidyEur: number | null
  netInvestmentEur: number | null
  paybackYears: number | null
  energySavingOverHorizonEur: number
  netResultAfterHorizonEur: number | null
  assumptionsSummary: string
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function roundEuro(value: number): number {
  return Math.round(value)
}

function roundM3(value: number): number {
  return Math.round(value)
}

function roundKwh(value: number): number {
  return Math.round(value)
}

/**
 * Indicative annual energy comparison.
 * Not a dwelling assessment and not a binding offer.
 */
export function calculateHeatPumpIndication(
  input: HeatPumpCalcInput,
): HeatPumpCalcResult {
  const a = heatPumpAssumptions
  const gasM3 = clamp(input.gasM3PerYear, 0, 20_000)
  const gasPrice = input.gasEurPerM3 ?? a.prices.gasEurPerM3
  const elecPrice = input.electricityEurPerKwh ?? a.prices.electricityEurPerKwh
  const scop = input.scop ?? a.scop[input.system]

  const usefulHeatKwh = gasM3 * a.gasKwhPerM3 * a.boilerEfficiency
  const currentGasCostEur = gasM3 * gasPrice

  let remainingGasM3: number
  let heatPumpHeatKwh: number

  if (input.system === 'hybrid') {
    heatPumpHeatKwh = usefulHeatKwh * a.hybridHeatPumpShare
    const boilerHeatKwh = usefulHeatKwh - heatPumpHeatKwh
    remainingGasM3 =
      a.boilerEfficiency > 0
        ? boilerHeatKwh / (a.gasKwhPerM3 * a.boilerEfficiency)
        : 0
  } else {
    heatPumpHeatKwh = usefulHeatKwh
    remainingGasM3 = 0
  }

  const heatPumpElectricityKwh = scop > 0 ? heatPumpHeatKwh / scop : 0
  const remainingGasCost = remainingGasM3 * gasPrice
  const electricityCost = heatPumpElectricityKwh * elecPrice
  const newEnergyCostEur = remainingGasCost + electricityCost
  const annualSavingEur = currentGasCostEur - newEnergyCostEur
  const savingPercent =
    currentGasCostEur > 0
      ? Math.max(0, (annualSavingEur / currentGasCostEur) * 100)
      : 0

  const possibleSubsidy =
    input.possibleSubsidyEur === undefined
      ? a.illustrativeSubsidyEur[input.system]
      : input.possibleSubsidyEur

  const investment =
    input.investmentEur === undefined || input.investmentEur === null
      ? a.illustrativeInvestmentEur[input.system]
      : input.investmentEur

  let netInvestmentEur: number | null = null
  let paybackYears: number | null = null
  let netResultAfterHorizonEur: number | null = null

  if (investment != null && investment > 0) {
    const subsidy = possibleSubsidy ?? 0
    netInvestmentEur = Math.max(0, investment - subsidy)
    if (annualSavingEur > 0) {
      paybackYears = netInvestmentEur / annualSavingEur
    } else {
      paybackYears = null
    }
    netResultAfterHorizonEur =
      annualSavingEur * a.horizonYears - netInvestmentEur
  }

  const assumptionsSummary = `Berekening op basis van € ${gasPrice.toFixed(2).replace('.', ',')}/m³ gas, € ${elecPrice.toFixed(2).replace('.', ',')}/kWh stroom en SCOP ${scop.toFixed(1).replace('.', ',')}.`

  return {
    system: input.system,
    gasM3PerYear: roundM3(gasM3),
    currentGasCostEur: roundEuro(currentGasCostEur),
    remainingGasM3: roundM3(remainingGasM3),
    heatPumpElectricityKwh: roundKwh(heatPumpElectricityKwh),
    newEnergyCostEur: roundEuro(newEnergyCostEur),
    annualSavingEur: roundEuro(annualSavingEur),
    savingPercent: Math.round(savingPercent),
    possibleSubsidyEur:
      possibleSubsidy == null ? null : roundEuro(possibleSubsidy),
    netInvestmentEur:
      netInvestmentEur == null ? null : roundEuro(netInvestmentEur),
    paybackYears:
      paybackYears == null ? null : Math.round(paybackYears * 10) / 10,
    energySavingOverHorizonEur: roundEuro(annualSavingEur * a.horizonYears),
    netResultAfterHorizonEur:
      netResultAfterHorizonEur == null
        ? null
        : roundEuro(netResultAfterHorizonEur),
    assumptionsSummary,
  }
}

export function formatEuro(value: number): string {
  return value.toLocaleString('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  })
}

export function formatNumberNl(value: number): string {
  return value.toLocaleString('nl-NL')
}

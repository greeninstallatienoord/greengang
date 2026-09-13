import { calculateHeatPumpIndication } from '../src/lib/heatPumpCalculator'
import { monthlyPriceCents } from '../src/data/maintenance'
import type { HeatPumpSystem } from '../src/data/heatPumpAssumptions'

const gases = [400, 1000, 1500, 2000, 3000, 4000]
const systems: HeatPumpSystem[] = ['hybrid', 'all-electric']

let failed = false
for (const system of systems) {
  for (const gas of gases) {
    const r = calculateHeatPumpIndication({
      system,
      gasM3PerYear: gas,
      investmentEur: 10_000,
    })
    const vals = [
      r.annualSavingEur,
      r.heatPumpElectricityKwh,
      r.remainingGasM3,
      r.currentGasCostEur,
      r.newEnergyCostEur,
    ]
    const bad = vals.some((v) => !Number.isFinite(v) || v < 0)
    const pay =
      r.paybackYears != null &&
      (!Number.isFinite(r.paybackYears) || r.paybackYears < 0)
    if (bad || pay) failed = true
    console.log(
      system,
      gas,
      'save',
      r.annualSavingEur,
      'kwh',
      r.heatPumpElectricityKwh,
      'remainGas',
      r.remainingGasM3,
      'payback',
      r.paybackYears,
      bad || pay ? 'BAD' : 'ok',
    )
  }
}

const z = calculateHeatPumpIndication({
  system: 'hybrid',
  gasM3PerYear: 0,
  investmentEur: 5000,
})
console.log('zero gas payback', z.paybackYears, 'saving', z.annualSavingEur)

console.log(
  'no investment payback',
  calculateHeatPumpIndication({ system: 'hybrid', gasM3PerYear: 1500 })
    .paybackYears,
)

const prices = {
  basis: monthlyPriceCents('basis', 'biennial'),
  basisYear: monthlyPriceCents('basis', 'annual'),
  comfortYear: monthlyPriceCents('comfort', 'annual'),
  allInYear: monthlyPriceCents('all-in', 'annual'),
}
console.log('prices', prices)
if (
  prices.basis !== 799 ||
  prices.basisYear !== 1249 ||
  prices.comfortYear !== 1849 ||
  prices.allInYear !== 2149
) {
  failed = true
  console.log('PRICE MISMATCH')
}

if (failed) process.exit(1)
console.log('ALL OK')

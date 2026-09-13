/**
 * Maintainable heat-pump product / subsidy records.
 * Populate model-level fields only when verified (meldcode, power, subsidy).
 */

export type HeatPumpProduct = {
  id: string
  brand: string
  modelFamily: string
  type: 'hybrid' | 'all-electric' | 'either' | null
  powerKw: number | null
  refrigerant: string | null
  rvoMeldcode: string | null
  subsidyAmountEur: number | null
  validFrom: string | null
  source: string | null
  approved: boolean
}

/** Brand-level placeholders until exact models are verified. */
export const heatPumpProducts: HeatPumpProduct[] = [
  {
    id: 'weheat',
    brand: 'Weheat',
    modelFamily: '',
    type: null,
    powerKw: null,
    refrigerant: null,
    rvoMeldcode: null,
    subsidyAmountEur: null,
    validFrom: null,
    source: null,
    approved: true,
  },
  {
    id: 'vaillant',
    brand: 'Vaillant',
    modelFamily: '',
    type: null,
    powerKw: null,
    refrigerant: null,
    rvoMeldcode: null,
    subsidyAmountEur: null,
    validFrom: null,
    source: null,
    approved: true,
  },
  {
    id: 'remeha',
    brand: 'Remeha',
    modelFamily: '',
    type: null,
    powerKw: null,
    refrigerant: null,
    rvoMeldcode: null,
    subsidyAmountEur: null,
    validFrom: null,
    source: null,
    approved: true,
  },
  {
    id: 'intergas',
    brand: 'Intergas',
    modelFamily: '',
    type: null,
    powerKw: null,
    refrigerant: null,
    rvoMeldcode: null,
    subsidyAmountEur: null,
    validFrom: null,
    source: null,
    approved: true,
  },
]

export function approvedHeatPumpProducts(): HeatPumpProduct[] {
  return heatPumpProducts.filter((item) => item.approved)
}

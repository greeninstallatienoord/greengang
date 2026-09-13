/**
 * Heat-pump calculator assumptions.
 * All magic numbers live here so pricing and efficiency can be updated later.
 *
 * Energy model (indicative, not a dwelling assessment):
 * - Convert annual gas use to useful heat via boiler efficiency.
 * - Hybrid: heat pump covers a share; remaining heat stays on gas.
 * - All-electric (heating): remaining space-heating gas ≈ 0; heat via HP.
 * - Electricity ≈ heat delivered by HP / seasonal COP (SCOP).
 *
 * Prices are assumptions for orientation only.
 */

export type HeatPumpSystem = 'hybrid' | 'all-electric'

export const heatPumpGasUsage = {
  minM3: 400,
  maxM3: 4000,
  defaultM3: 1500,
  stepM3: 50,
  scale: [
    { at: 700, label: 'Laag verbruik' },
    { at: 1500, label: 'Gemiddeld' },
    { at: 2800, label: 'Hoog verbruik' },
  ],
} as const

export const heatPumpAssumptions = {
  /** Lower heating value approximation for natural gas (kWh/m³). */
  gasKwhPerM3: 9.77,
  /** Seasonal boiler efficiency for existing CV. */
  boilerEfficiency: 0.9,
  /** Share of annual heat demand covered by the heat pump in hybrid mode. */
  hybridHeatPumpShare: 0.65,
  /** Seasonal COP assumptions. */
  scop: {
    hybrid: 3.5,
    'all-electric': 3.2,
  } as Record<HeatPumpSystem, number>,
  /** Default energy prices used until the visitor overrides them. */
  prices: {
    gasEurPerM3: 1.45,
    electricityEurPerKwh: 0.32,
  },
  /**
   * Optional illustrative investment defaults (EUR).
   * Leave null to require visitor input before payback is shown.
   * These are NOT verified Green quotes — only placeholders for the tool.
   */
  illustrativeInvestmentEur: {
    hybrid: null as number | null,
    'all-electric': null as number | null,
  },
  /**
   * Illustrative ISDE example amount for orientation only.
   * Real amounts depend on RVO meldcode / model. Never present as guaranteed.
   */
  illustrativeSubsidyEur: {
    hybrid: 2400,
    'all-electric': 3200,
  } as Record<HeatPumpSystem, number>,
  horizonYears: 10,
} as const

export const heatPumpSystemCopy = {
  hybrid: {
    title: 'Hybride',
    points: [
      'Werkt samen met een cv-ketel',
      'Verlaagt het gasverbruik voor verwarming',
      'De ketel kan bijspringen wanneer dat nodig is',
    ],
  },
  'all-electric': {
    title: 'All-electric',
    points: [
      'De warmtepomp verzorgt de ruimteverwarming',
      'Afhankelijk van de opstelling ook warm water',
      'Bedoeld voor geschikte woningen; gas voor verwarming kan dan wegvallen',
    ],
  },
} as const

export const isdeInfo = {
  eyebrow: 'ISDE-subsidie',
  title: 'Subsidie kan de investering verlagen',
  text: 'Voor veel warmtepompen is ISDE-subsidie beschikbaar. Het bedrag verschilt per type en meldcode. Bij een concreet voorstel controleren we welk subsidiebedrag voor de gekozen warmtepomp geldt.',
  ctaLabel: 'Bekijk actuele ISDE-regeling',
  ctaHref:
    'https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepompen',
  note: 'Het daadwerkelijke subsidiebedrag hangt af van het gekozen model en de geldende RVO-meldcode.',
} as const

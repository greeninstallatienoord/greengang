export type OfficialSource = {
  id: string
  label: string
  url: string
  publisher: string
  type: 'government' | 'industry' | 'consumer'
}

/**
 * Authoritative sources we may cite. These are not backlinks we "have".
 * They are outbound references for homeowners.
 */
export const officialSources = {
  rijksoverheidCo: {
    id: 'rijksoverheid-co',
    label: 'Koolmonoxide (Rijksoverheid)',
    url: 'https://www.rijksoverheid.nl/onderwerpen/koolmonoxide',
    publisher: 'Rijksoverheid',
    type: 'government',
  },
  rvoIsde: {
    id: 'rvo-isde',
    label: 'ISDE-subsidie (RVO)',
    url: 'https://www.rvo.nl/subsidies-financiering/isde',
    publisher: 'Rijksdienst voor Ondernemend Nederland',
    type: 'government',
  },
  rvoEnergielabel: {
    id: 'rvo-energielabel',
    label: 'Energielabel woningen (RVO)',
    url: 'https://www.rvo.nl/onderwerpen/wetten-en-regels-gebouwen/energielabel-woningen',
    publisher: 'Rijksdienst voor Ondernemend Nederland',
    type: 'government',
  },
  milieuCentraalWp: {
    id: 'milieucentraal-warmtepomp',
    label: 'Warmtepomp (Milieu Centraal)',
    url: 'https://www.milieucentraal.nl/energie-besparen/warmtepomp/',
    publisher: 'Milieu Centraal',
    type: 'consumer',
  },
  milieuCentraalIsolatie: {
    id: 'milieucentraal-isolatie',
    label: 'Isolatie (Milieu Centraal)',
    url: 'https://www.milieucentraal.nl/energie-besparen/isolatie/',
    publisher: 'Milieu Centraal',
    type: 'consumer',
  },
  iltFgassen: {
    id: 'ilt-f-gassen',
    label: 'F-gassen (ILT)',
    url: 'https://www.ilent.nl/onderwerpen/f-gassen',
    publisher: 'Inspectie Leefomgeving en Transport',
    type: 'government',
  },
  techniekNederland: {
    id: 'techniek-nederland',
    label: 'Techniek Nederland',
    url: 'https://www.technieknederland.nl/',
    publisher: 'Techniek Nederland',
    type: 'industry',
  },
} as const satisfies Record<string, OfficialSource>

export function sourceList(
  ...ids: (keyof typeof officialSources)[]
): OfficialSource[] {
  return ids.map((id) => officialSources[id])
}

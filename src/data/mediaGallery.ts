import { workPhotos, type WorkShot } from './media'

function shot(
  base: WorkShot,
  extras: Pick<WorkShot, 'kind'> & Partial<Pick<WorkShot, 'title' | 'caption'>>,
): WorkShot {
  return { ...base, ...extras }
}

/**
 * Portfolio entries for /werk.
 *
 * Classification notes (verified against asset + filename + visible branding):
 * - cv-intergas: Intergas boiler is the clear primary subject → cv-ketel.
 *   A narrower nevenunit sits beside it; we do not claim a specific hybrid model.
 * - cv-opstelling: Nefit ketel + Remeha Elga Ace (visible) → warmtepomp (hybride).
 * - warmtepomp-intergas: Intergas outdoor heat-pump unit (visible logo) → warmtepomp.
 */
export const workShots: WorkShot[] = [
  shot(
    {
      id: 'omkasting-dubbel',
      asset: workPhotos.aircoOmkastingDubbel,
      title: 'Dubbele airco-omkasting',
      caption: 'Twee buitenunits in een omkasting, leidingen langs de gevel.',
      category: 'airco',
      href: '/airco',
      featured: true,
    },
    { kind: 'omkasting' },
  ),
  shot(
    {
      id: 'cv-intergas',
      asset: workPhotos.cvIntergas,
      title: 'Intergas cv-ketel binnenopstelling',
      caption: 'Intergas-ketel met nevenunit en leidingwerk in de technische ruimte.',
      category: 'cv-ketel',
      href: '/cv-ketel',
    },
    { kind: 'technische-installatie' },
  ),
  shot(
    {
      id: 'warmtepomp',
      asset: workPhotos.warmtepompIntergas,
      title: 'Intergas warmtepomp-buitenunit',
      caption: 'Intergas warmtepomp-buitenunit op dempers bij de woning.',
      category: 'warmtepomp',
      href: '/warmtepomp',
    },
    { kind: 'buitenunit' },
  ),
  shot(
    {
      id: 'zolder',
      asset: workPhotos.aircoZolder,
      title: 'Airco-binnenunit op zolder',
      caption: 'Wandmodel met afgewerkte leidinggoot.',
      category: 'airco',
      href: '/airco',
    },
    { kind: 'binnenunit' },
  ),
  shot(
    {
      id: 'omkasting',
      asset: workPhotos.aircoOmkasting,
      title: 'Airco-omkasting aan de gevel',
      caption: 'Antraciete omkasting bij een lichte gevel.',
      category: 'airco',
      href: '/airco',
    },
    { kind: 'omkasting' },
  ),
  shot(
    {
      id: 'terras',
      asset: workPhotos.aircoTerras,
      title: 'Airco-buitenunit op plat dak',
      caption: 'Buitenunit op een plat dak, naast de gevel.',
      category: 'airco',
      href: '/airco',
    },
    { kind: 'buitenunit' },
  ),
  shot(
    {
      id: 'cv-opstelling',
      asset: workPhotos.cvOpstelling,
      title: 'Remeha Elga Ace hybride binnenopstelling',
      caption: 'Nefit-ketel met Remeha Elga Ace en expansievat.',
      category: 'warmtepomp',
      href: '/warmtepomp',
    },
    { kind: 'technische-installatie' },
  ),
  shot(
    {
      id: 'kaisai',
      asset: workPhotos.aircoKaisai,
      title: 'Kaisai airco-vloerconsole op zolder',
      caption: 'Vloerconsole in een zolderkamer.',
      category: 'airco',
      href: '/airco',
    },
    { kind: 'binnenunit' },
  ),
  shot(
    {
      id: 'binnen',
      asset: workPhotos.aircoBinnen,
      title: 'Airco-binnenunit in de kamer',
      caption: 'Compacte binnenunit boven een spiegel.',
      category: 'airco',
      href: '/airco',
    },
    { kind: 'binnenunit' },
  ),
  shot(
    {
      id: 'gevel',
      asset: workPhotos.aircoGevel,
      title: 'Mitsubishi airco-buitenunit op dempers',
      caption: 'Mitsubishi Electric buitenunit op dempers met weggewerkt leidingwerk.',
      category: 'airco',
      href: '/airco',
    },
    { kind: 'buitenunit' },
  ),
  shot(
    {
      id: 'nok',
      asset: workPhotos.aircoNok,
      title: 'Airco-buitenunit hoog op de gevel',
      caption: 'Buitenunit met leiding naar de nok.',
      category: 'airco',
      href: '/airco',
    },
    { kind: 'buitenunit' },
  ),
  shot(
    {
      id: 'beugel',
      asset: workPhotos.aircoBeugel,
      title: 'Airco-buitenunit op gevelbeugel',
      caption: 'Buitenunit aan de gevel op een beugel.',
      category: 'airco',
      href: '/airco',
    },
    { kind: 'buitenunit' },
  ),
  shot(
    {
      id: 'platdak',
      asset: workPhotos.aircoPlatdak,
      title: 'Airco-buitenunit op dempers',
      caption: 'Buitenunit op trillingsdempers op een plat dak.',
      category: 'airco',
      href: '/airco',
    },
    { kind: 'buitenunit' },
  ),
  shot(
    {
      id: 'praktijk',
      asset: workPhotos.aircoPraktijk,
      title: 'Airco-binnenunit in praktijkruimte',
      caption: 'Binnenunit in een zakelijke ruimte.',
      category: 'airco',
      href: '/airco',
    },
    { kind: 'binnenunit' },
  ),
  shot(
    {
      id: 'vloer',
      asset: workPhotos.aircoVloer,
      title: 'Sinclair airco-vloerconsole',
      caption: 'Vloermodel airconditioning in de woonruimte.',
      category: 'airco',
      href: '/airco',
    },
    { kind: 'binnenunit' },
  ),
]

export const workFilterIds = ['all', 'cv-ketel', 'airco', 'warmtepomp'] as const

export type WorkFilterId = (typeof workFilterIds)[number]

/** Initial count for a balanced 3-column default grid (4 rows). */
export const WORK_PAGE_INITIAL_COUNT = 12

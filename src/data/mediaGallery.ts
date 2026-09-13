import { workPhotos, type WorkShot } from './media'

function shot(
  base: WorkShot,
  extras: Pick<WorkShot, 'kind'> & Partial<Pick<WorkShot, 'title' | 'caption'>>,
): WorkShot {
  return { ...base, ...extras }
}

export const workShots: WorkShot[] = [
  shot(
    {
      id: 'omkasting-dubbel',
      asset: workPhotos.aircoOmkastingDubbel,
      title: 'Dubbele omkasting',
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
      title: 'Hybride binnenopstelling',
      caption: 'Intergas-ketel met warmtepompmodule en leidingwerk.',
      category: 'warmtepomp',
      href: '/warmtepomp',
    },
    { kind: 'technische-installatie' },
  ),
  shot(
    {
      id: 'warmtepomp',
      asset: workPhotos.warmtepompIntergas,
      title: 'Intergas warmtepomp',
      caption: 'Intergas warmtepomp-buitenunit bij de woning.',
      category: 'warmtepomp',
      href: '/warmtepomp',
    },
    { kind: 'buitenunit' },
  ),
  shot(
    {
      id: 'zolder',
      asset: workPhotos.aircoZolder,
      title: 'Binnenunit op zolder',
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
      title: 'Afgewerkte omkasting',
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
      title: 'Buitenunit op plat dak',
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
      title: 'Hybride technische opstelling',
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
      title: 'Vloerconsole in de slaapkamer',
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
      title: 'Binnenunit in de kamer',
      caption: 'Compacte binnenunit boven een spiegel.',
      category: 'airco',
      href: '/airco',
    },
    { kind: 'binnenunit' },
  ),
  shot(
    {
      id: 'nok',
      asset: workPhotos.aircoNok,
      title: 'Buitenunit hoog op de gevel',
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
      title: 'Buitenunit op beugel',
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
      title: 'Buitenunit op dempers',
      caption: 'Buitenunit op trillingsdempers.',
      category: 'airco',
      href: '/airco',
    },
    { kind: 'buitenunit' },
  ),
  shot(
    {
      id: 'praktijk',
      asset: workPhotos.aircoPraktijk,
      title: 'Binnenunit in een praktijkruimte',
      caption: 'Binnenunit in een zakelijke ruimte.',
      category: 'airco',
      href: '/airco',
    },
    { kind: 'binnenunit' },
  ),
]

export const workFilterIds = ['all', 'cv-ketel', 'airco', 'warmtepomp'] as const

export type WorkFilterId = (typeof workFilterIds)[number]

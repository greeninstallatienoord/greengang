import { WorkTile } from './WorkTile'
import type { WorkShot } from '../../data/media'
import { buildWorkBands } from '../../lib/workBands'
import { Reveal } from '../Reveal'
import { cn } from '../../lib/cn'

type WorkPortfolioProps = {
  shots: WorkShot[]
  onOpen: (index: number) => void
}

export function WorkPortfolio({ shots, onOpen }: WorkPortfolioProps) {
  const bands = buildWorkBands(shots)
  const indexById = new Map(shots.map((shot, index) => [shot.id, index]))

  return (
    <div className="grid gap-10 lg:gap-16 lg:[&>:nth-child(even)]:motion-safe:translate-y-3">
      {bands.map((band, bandIndex) => {
        const priority = bandIndex === 0

        if (band.type === 'feature-split') {
          return (
            <Reveal key={`split-${band.lead.id}`}>
              <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-6">
                <WorkTile
                  shot={band.lead}
                  onOpen={() => onOpen(indexById.get(band.lead.id) ?? 0)}
                  priority={priority}
                  ratio="4 / 5"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="lg:col-span-7"
                />
                <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-6">
                  {band.stack.map((shot, stackIndex) => (
                    <WorkTile
                      key={shot.id}
                      shot={shot}
                      onOpen={() => onOpen(indexById.get(shot.id) ?? 0)}
                      priority={priority && stackIndex === 0}
                      ratio="4 / 3"
                      sizes="(min-width: 1024px) 34vw, (min-width: 640px) 46vw, 100vw"
                      shift={stackIndex === 1 ? 'down' : 'none'}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          )
        }

        if (band.type === 'offset-pair') {
          const large = band.primary
          const small = band.secondary
          return (
            <Reveal key={`pair-${large.id}`}>
              <div
                className={cn(
                  'grid gap-5 lg:grid-cols-12 lg:items-start lg:gap-6',
                  band.flip && 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1',
                )}
              >
                <WorkTile
                  shot={large}
                  onOpen={() => onOpen(indexById.get(large.id) ?? 0)}
                  ratio="4 / 5"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="lg:col-span-7"
                />
                <WorkTile
                  shot={small}
                  onOpen={() => onOpen(indexById.get(small.id) ?? 0)}
                  ratio="4 / 3"
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  shift="down"
                  className="lg:col-span-5"
                />
              </div>
            </Reveal>
          )
        }

        if (band.type === 'wide') {
          const landscape = band.shot.asset.width >= band.shot.asset.height
          return (
            <Reveal key={`wide-${band.shot.id}`}>
              <WorkTile
                shot={band.shot}
                onOpen={() => onOpen(indexById.get(band.shot.id) ?? 0)}
                ratio={landscape ? '16 / 10' : '4 / 5'}
                sizes="100vw"
                className={landscape ? 'lg:mx-auto lg:max-w-5xl' : 'lg:mx-auto lg:max-w-3xl'}
              />
            </Reveal>
          )
        }

        return (
          <Reveal key={`trio-${band.shots[0].id}`}>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {band.shots.map((shot, index) => (
                <WorkTile
                  key={shot.id}
                  shot={shot}
                  onOpen={() => onOpen(indexById.get(shot.id) ?? 0)}
                  ratio={index === 1 ? '4 / 5' : '4 / 3'}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                  shift={index === 1 ? 'down' : 'none'}
                />
              ))}
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}

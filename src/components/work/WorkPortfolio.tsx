import { WorkTile } from './WorkTile'
import type { WorkShot } from '../../data/media'
import { Reveal } from '../Reveal'

type WorkPortfolioProps = {
  shots: WorkShot[]
  onOpen: (index: number) => void
}

export function WorkPortfolio({ shots, onOpen }: WorkPortfolioProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
      {shots.map((shot, index) => (
        <Reveal key={shot.id} delay={(index % 3) * 40}>
          <WorkTile
            shot={shot}
            onOpen={() => onOpen(index)}
            priority={index < 3}
            ratio="4 / 5"
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
          />
        </Reveal>
      ))}
    </div>
  )
}

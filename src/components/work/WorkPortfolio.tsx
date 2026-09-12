import { WorkTile } from './WorkTile'
import type { WorkShot } from '../../data/media'
import { Reveal } from '../Reveal'

type WorkPortfolioProps = {
  shots: WorkShot[]
  onOpen: (index: number) => void
}

export function WorkPortfolio({ shots, onOpen }: WorkPortfolioProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {shots.map((shot, index) => (
        <Reveal key={shot.id} delay={(index % 3) * 70}>
          <WorkTile
            shot={shot}
            onOpen={() => onOpen(index)}
            priority={index < 3}
            ratio="16 / 10"
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
          />
        </Reveal>
      ))}
    </div>
  )
}

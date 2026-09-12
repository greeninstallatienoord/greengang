import { useState } from 'react'
import { homeProjectShots } from '../../data/media'
import { Lightbox } from '../media/Lightbox'

export function WorkFilmstrip() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const loop = [...homeProjectShots, ...homeProjectShots]

  return (
    <div className="group/rail overflow-hidden border-y border-line bg-paper py-3 sm:py-4">
      <div className="filmstrip-track flex w-max gap-2 pr-2 sm:gap-3 sm:pr-3">
        {loop.map((shot, index) => {
          const sourceIndex = index % homeProjectShots.length
          return (
            <button
              key={`${shot.id}-${index}`}
              type="button"
              className="relative shrink-0 overflow-hidden"
              onClick={() => setOpenIndex(sourceIndex)}
            >
              <img
                src={shot.asset.src}
                alt={shot.asset.alt}
                width={220}
                height={276}
                className="h-36 w-[7.25rem] object-cover sm:h-48 sm:w-40 lg:h-56 lg:w-44"
                style={
                  shot.asset.objectPosition
                    ? { objectPosition: shot.asset.objectPosition }
                    : undefined
                }
                loading={index < 4 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <span className="sr-only">{shot.title}</span>
            </button>
          )
        })}
      </div>
      {openIndex != null ? (
        <Lightbox
          items={homeProjectShots}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndex={setOpenIndex}
        />
      ) : null}
    </div>
  )
}

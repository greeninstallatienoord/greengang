import { useState } from 'react'
import { homeProjectShots, type WorkShot } from '../../data/media'
import { site } from '../../data/site'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { Lightbox } from '../media/Lightbox'
import { MediaImage } from '../media/MediaImage'
import { Section } from '../Section'

type WorkGalleryProps = {
  shots?: WorkShot[]
}

export function WorkGallery({ shots = homeProjectShots }: WorkGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const featured = shots[0]
  const second = shots[1]
  const third = shots[2]
  const rest = shots.slice(3)

  return (
    <Section id="werkzaamheden" className="bg-paper">
      <Container>
        <div className="max-w-2xl">
          <p className="eyebrow">Werk</p>
          <Heading as="h2" className="mt-3">
            {site.copy.workTitle}
          </Heading>
          <p className="lead mt-4">{site.copy.workText}</p>
        </div>

        <div className="mt-12 grid gap-3 lg:grid-cols-12 lg:gap-4">
          {featured ? (
            <button
              type="button"
              className="group relative col-span-full overflow-hidden text-left lg:col-span-8"
              onClick={() => setOpenIndex(0)}
            >
              <MediaImage
                asset={featured.asset}
                variant="card"
                className="rounded-none min-h-80 lg:min-h-[34rem]"
                sizes="(min-width: 1024px) 62vw, 100vw"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent p-5 text-white sm:p-7">
                <span className="block font-semibold">{featured.title}</span>
                <span className="mt-1 block text-sm text-white/80">{featured.caption}</span>
              </span>
            </button>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:gap-4">
            {[second, third].map((shot, index) =>
              shot ? (
                <button
                  key={shot.id}
                  type="button"
                  className="group overflow-hidden text-left"
                  onClick={() => setOpenIndex(index + 1)}
                >
                  <MediaImage
                    asset={shot.asset}
                    variant="card"
                    className="rounded-none"
                    sizes="(min-width: 1024px) 28vw, 50vw"
                  />
                  <span className="mt-2 block text-sm font-semibold">{shot.title}</span>
                </button>
              ) : null,
            )}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-4 lg:grid-cols-5 lg:gap-4">
          {rest.map((shot, index) => (
            <button
              key={shot.id}
              type="button"
              className="group overflow-hidden text-left"
              onClick={() => setOpenIndex(index + 3)}
            >
              <MediaImage
                asset={shot.asset}
                variant="card"
                className="rounded-none"
                sizes="(min-width: 1024px) 16vw, 45vw"
              />
              <span className="mt-2 block text-sm font-semibold">{shot.title}</span>
            </button>
          ))}
        </div>
      </Container>
      {openIndex != null ? (
        <Lightbox
          items={shots}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndex={setOpenIndex}
        />
      ) : null}
    </Section>
  )
}

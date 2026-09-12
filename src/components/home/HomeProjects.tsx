import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { homeProjectShots, workCategoryLabels } from '../../data/media'
import { site } from '../../data/site'
import { Container } from '../Container'
import { Heading } from '../Heading'
import { MediaImage } from '../media/MediaImage'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

export function HomeProjects() {
  if (homeProjectShots.length === 0) return null

  return (
    <Section id="werkzaamheden" className="bg-paper">
      <Container>
        <Reveal>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="eyebrow">Werk</p>
              <Heading as="h2" className="mt-3">
                {site.copy.workTitle}
              </Heading>
              <p className="lead mt-3">{site.copy.workText}</p>
            </div>
            <Link to="/werk" className="text-link shrink-0">
              Bekijk al het werk
              <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <Reveal className="mt-7 sm:mt-8">
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {homeProjectShots.map((shot) => (
              <Link key={shot.id} to={shot.href ?? '/werk'} className="group min-w-0">
                <MediaImage
                  asset={shot.asset}
                  className="rounded-none"
                  ratio="16 / 10"
                  sizes="(min-width: 640px) 32vw, 100vw"
                />
                <span className="mt-2.5 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
                  {workCategoryLabels[shot.category]}
                </span>
                <span className="mt-0.5 block font-semibold">{shot.title}</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}

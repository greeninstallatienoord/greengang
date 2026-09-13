import type { ComponentType } from 'react'
import { socialEntities, type SocialEntityKey } from '../../data/business'
import { Container } from '../Container'
import { Heading } from '../Heading'
import {
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
} from '../icons/BrandIcons'
import { Reveal } from '../Reveal'
import { Section } from '../Section'

const icons: Record<SocialEntityKey, ComponentType<{ size?: number }>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  linkedin: LinkedInIcon,
  googleBusinessProfile: GoogleIcon,
}

const labels: Record<SocialEntityKey, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  googleBusinessProfile: 'Google',
}

const actions: Record<SocialEntityKey, string> = {
  facebook: 'Volg ons',
  instagram: 'Volg ons',
  tiktok: 'Bekijk onze updates',
  linkedin: 'Bekijk profiel',
  googleBusinessProfile: 'Deel uw ervaring',
}

export function HomeFollow() {
  const items = socialEntities.filter((item) => item.verified && item.url)
  if (items.length === 0) return null

  return (
    <Section className="bg-paper">
      <Container>
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Volg ons</p>
            <Heading as="h2" className="mt-2.5 sm:mt-3">
              Volg Green Installatie Noord
            </Heading>
            <p className="lead mt-3 sm:mt-4">
              Recente projecten en updates via onze social kanalen. Heeft u met
              ons gewerkt? Deel uw ervaring via Google.
            </p>
          </div>
        </Reveal>
        <ul className="mt-5 grid grid-cols-2 gap-2.5 min-[390px]:gap-3 sm:mt-7 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = icons[item.key]
            return (
              <Reveal key={item.key} delay={index * 60}>
                <li>
                  <a
                    href={item.url}
                    className="flex min-h-14 items-center gap-2.5 border border-line bg-surface px-3 py-2.5 transition-[background-color,border-color] duration-[var(--duration-base)] hover:border-ink/25 hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand min-[390px]:min-h-[4.75rem] min-[390px]:gap-3 min-[390px]:px-3.5 min-[390px]:py-3"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="inline-flex size-9 shrink-0 items-center justify-center border border-line bg-paper text-ink min-[390px]:size-10">
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold tracking-[-0.01em]">
                        {labels[item.key]}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-muted">
                        {actions[item.key]}
                      </span>
                    </span>
                  </a>
                </li>
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}

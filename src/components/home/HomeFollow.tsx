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

const actions: Record<SocialEntityKey, string> = {
  facebook: 'Volg ons',
  instagram: 'Volg ons',
  tiktok: 'Volg ons',
  linkedin: 'Volg ons',
  googleBusinessProfile: 'Laat uw ervaring weten',
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
            <Heading as="h2" className="mt-3">
              Volg ons of laat uw ervaring weten
            </Heading>
            <p className="lead mt-4">
              Facebook, Instagram, TikTok en Google. We zetten hier geen sterren
              of aantallen; u ziet wat er op het profiel zelf staat.
            </p>
          </div>
        </Reveal>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = icons[item.key]
            return (
              <Reveal key={item.key} delay={index * 70}>
                <li>
                  <a
                    href={item.url}
                    className="flex min-h-24 items-center gap-3 border border-line bg-surface px-4 py-3.5 transition-[background-color,border-color,transform] duration-[var(--duration-base)] hover:border-ink/25 hover:bg-paper motion-safe:hover:-translate-y-px"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center border border-line bg-paper text-ink">
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold tracking-[-0.01em]">
                        {item.name}
                      </span>
                      <span className="mt-0.5 block text-sm text-ink-muted">
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

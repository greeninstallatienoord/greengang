import type { ComponentType } from 'react'
import { socialEntities, type SocialEntityKey } from '../data/business'
import { cn } from '../lib/cn'
import {
  FacebookIcon,
  GoogleIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
} from './icons/BrandIcons'

const icons: Record<SocialEntityKey, ComponentType<{ size?: number }>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  linkedin: LinkedInIcon,
  googleBusinessProfile: GoogleIcon,
}

const labels: Record<SocialEntityKey, string> = {
  facebook: 'Green Installatie Noord op Facebook',
  instagram: 'Green Installatie Noord op Instagram',
  tiktok: 'Green Installatie Noord op TikTok',
  linkedin: 'Green Installatie Noord op LinkedIn',
  googleBusinessProfile: 'Green Installatie Noord op Google',
}

type SocialLinksProps = {
  className?: string
  tone?: 'default' | 'onDark'
}

export function SocialLinks({ className, tone = 'default' }: SocialLinksProps) {
  const items = socialEntities.filter((item) => item.verified && item.url)

  if (items.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {items.map((item) => {
        const Icon = icons[item.key]
        return (
          <li key={item.key}>
            <a
              href={item.url}
              className={cn(
                'inline-flex size-11 items-center justify-center border transition-[background-color,border-color,transform] duration-[var(--duration-fast)] motion-safe:hover:-translate-y-px',
                tone === 'onDark'
                  ? 'border-white/20 text-white hover:border-white/45 hover:bg-white/10'
                  : 'border-line text-ink hover:border-ink/30 hover:bg-stone',
              )}
              rel="noopener noreferrer"
              target="_blank"
              aria-label={labels[item.key]}
              title={labels[item.key]}
            >
              <Icon size={18} />
            </a>
          </li>
        )
      })}
    </ul>
  )
}

import { socialEntities } from '../data/business'
import { cn } from '../lib/cn'

type SocialLinksProps = {
  className?: string
  tone?: 'default' | 'onDark'
}

export function SocialLinks({ className, tone = 'default' }: SocialLinksProps) {
  const items = socialEntities.filter((item) => item.verified && item.url)

  if (items.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap gap-x-4 gap-y-2 text-sm', className)}>
      {items.map((item) => (
        <li key={item.key}>
          <a
            href={item.url}
            className={
              tone === 'onDark'
                ? 'underline underline-offset-2 hover:text-white'
                : 'font-semibold underline underline-offset-2'
            }
            rel="noopener noreferrer"
            target="_blank"
          >
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  )
}

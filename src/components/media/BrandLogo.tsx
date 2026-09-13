import { Link } from 'react-router-dom'
import logo from '../../assets/images/branding/logo.png'
import { site } from '../../data/site'
import { cn } from '../../lib/cn'

type BrandLogoProps = {
  className?: string
  compact?: boolean
}

export function BrandLogo({ className, compact = false }: BrandLogoProps) {
  return (
    <Link
      to="/"
      className={cn('inline-flex max-w-[min(11.5rem,52vw)] items-center sm:max-w-none', className)}
      aria-label={`${site.name}, naar home`}
    >
      <img
        src={logo}
        alt={site.name}
        width={compact ? 168 : 210}
        height={compact ? 56 : 70}
        className={cn(
          'h-auto w-auto max-w-full object-contain object-left',
          compact ? 'h-8 sm:h-9' : 'h-9 sm:h-10',
        )}
        decoding="async"
        fetchPriority="high"
      />
    </Link>
  )
}

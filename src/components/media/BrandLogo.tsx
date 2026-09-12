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
      className={cn('inline-flex items-center', className)}
      aria-label={`${site.name}, naar home`}
    >
      <img
        src={logo}
        alt={site.name}
        width={compact ? 168 : 210}
        height={compact ? 56 : 70}
        className={cn(
          'max-w-[46vw] w-auto object-contain object-left sm:max-w-[220px]',
          compact ? 'h-9 sm:h-11' : 'h-10 sm:h-12',
        )}
        decoding="async"
        fetchPriority="high"
      />
    </Link>
  )
}

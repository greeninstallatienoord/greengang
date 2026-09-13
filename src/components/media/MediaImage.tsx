import { useState } from 'react'
import { cn } from '../../lib/cn'
import { mediaPositionStyle, type MediaAsset } from '../../data/media'
import { ImagePlaceholder } from './ImagePlaceholder'

/**
 * Presentation variants — pick by content role, not one global CSS rule.
 *
 * - hero: marketing crop (cover + landscape frame)
 * - project: real install/documentation — full subject, natural proportions
 * - card: consistent grid crop; prefer near-portrait for install catalog
 * - article: editorial lead — more of the photo than a thumbnail (near-portrait cover)
 */
export type MediaVariant = 'hero' | 'project' | 'card' | 'article'

type MediaImageProps = {
  asset: MediaAsset
  alt?: string
  className?: string
  imgClassName?: string
  priority?: boolean
  sizes?: string
  /** Explicit frame; overrides the variant default when fit is cover. */
  ratio?: string
  /** Prefer `variant`. Kept for existing call sites. */
  fit?: 'cover' | 'contain'
  variant?: MediaVariant
}

function resolveMode(
  variant: MediaVariant | undefined,
  fit: 'cover' | 'contain' | undefined,
): 'cover' | 'contain' {
  if (fit) return fit
  if (variant === 'project') return 'contain'
  return 'cover'
}

function resolveCoverRatio(
  asset: MediaAsset,
  variant: MediaVariant | undefined,
  ratio: string | undefined,
): string {
  if (ratio) return ratio
  if (variant === 'card' || variant === 'article') {
    /* Portrait install shots dominate the catalog — avoid 16:10 card crops. */
    if (asset.height >= asset.width) return '4 / 5'
    return '16 / 10'
  }
  if (variant === 'hero') return '16 / 10'
  return `${asset.width} / ${asset.height}`
}

export function MediaImage({
  asset,
  alt,
  className,
  imgClassName,
  priority = false,
  sizes = '(min-width: 1024px) 560px, 100vw',
  ratio,
  fit,
  variant,
}: MediaImageProps) {
  const [failed, setFailed] = useState(false)
  const label = alt ?? asset.alt
  const mode = resolveMode(variant, fit)
  const contain = mode === 'contain'

  if (failed) {
    return <ImagePlaceholder label={label} className={className} pending={false} />
  }

  /* Document / install photos: natural proportions inside max-width/max-height. */
  if (contain) {
    return (
      <div className={cn('overflow-hidden bg-stone/80', className)}>
        <img
          src={asset.src}
          alt={label}
          width={asset.width}
          height={asset.height}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className={cn(
            'media-photo mx-auto block h-auto w-auto max-h-[inherit] max-w-full object-contain',
            imgClassName,
          )}
          style={{ maxHeight: 'inherit' }}
          onError={() => setFailed(true)}
        />
      </div>
    )
  }

  const coverRatio = resolveCoverRatio(asset, variant, ratio)

  return (
    <div
      className={cn('relative overflow-hidden bg-stone', className)}
      style={{ aspectRatio: coverRatio }}
    >
      <img
        src={asset.src}
        alt={label}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={cn('media-photo absolute inset-0 h-full w-full object-cover', imgClassName)}
        style={mediaPositionStyle(asset)}
        onError={() => setFailed(true)}
      />
    </div>
  )
}

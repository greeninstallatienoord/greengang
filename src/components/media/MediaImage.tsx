import { useState } from 'react'
import { cn } from '../../lib/cn'
import type { MediaAsset } from '../../data/media'
import { ImagePlaceholder } from './ImagePlaceholder'

type MediaImageProps = {
  asset: MediaAsset
  alt?: string
  className?: string
  imgClassName?: string
  priority?: boolean
  sizes?: string
}

export function MediaImage({
  asset,
  alt,
  className,
  imgClassName,
  priority = false,
  sizes = '(min-width: 1024px) 560px, 100vw',
}: MediaImageProps) {
  const [failed, setFailed] = useState(false)
  const label = alt ?? asset.alt

  if (failed) {
    return <ImagePlaceholder label={label} className={className} pending={false} />
  }

  return (
    <div
      className={cn('relative overflow-hidden rounded-lg bg-brand-soft', className)}
      style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
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
        className={cn('absolute inset-0 h-full w-full object-cover', imgClassName)}
        onError={() => setFailed(true)}
      />
    </div>
  )
}

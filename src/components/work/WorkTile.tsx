import { mediaPositionStyle, workCategoryLabels, type WorkShot } from '../../data/media'
import { cn } from '../../lib/cn'

type WorkTileProps = {
  shot: WorkShot
  onOpen: () => void
  priority?: boolean
  /** Optional override; defaults to near-native portrait/landscape frame. */
  ratio?: string
  sizes: string
  className?: string
}

export function WorkTile({
  shot,
  onOpen,
  priority = false,
  ratio,
  sizes,
  className,
}: WorkTileProps) {
  const category = workCategoryLabels[shot.category]
  const frame =
    ratio ??
    (shot.asset.height >= shot.asset.width ? '3 / 4' : '4 / 3')

  return (
    <button
      type="button"
      className={cn(
        'group work-tile relative w-full rounded-sm text-left',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        className,
      )}
      onClick={onOpen}
      aria-label={`${shot.title} vergroten`}
    >
      <span
        className="relative block overflow-hidden rounded-md bg-stone"
        style={{ aspectRatio: frame }}
      >
        <img
          src={shot.asset.src}
          alt={shot.asset.alt}
          width={shot.asset.width}
          height={shot.asset.height}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="media-photo absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.02]"
          style={mediaPositionStyle(shot.asset)}
        />
      </span>
      <span className="mt-2.5 block sm:mt-3">
        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
          {category}
        </span>
        <span className="mt-1.5 block text-[0.95rem] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-brand-dark">
          {shot.title}
        </span>
      </span>
    </button>
  )
}

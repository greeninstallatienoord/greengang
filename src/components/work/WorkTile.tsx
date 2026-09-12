import { mediaPositionStyle, workCategoryLabels, type WorkShot } from '../../data/media'
import { cn } from '../../lib/cn'

type WorkTileProps = {
  shot: WorkShot
  onOpen: () => void
  priority?: boolean
  ratio: string
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

  return (
    <button
      type="button"
      className={cn('group work-tile relative w-full text-left', className)}
      onClick={onOpen}
    >
      <span
        className="relative block overflow-hidden bg-stone"
        style={{ aspectRatio: ratio }}
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
          className="media-photo absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
          style={mediaPositionStyle(shot.asset)}
        />
      </span>
      <span className="mt-2.5 block">
        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
          {category}
        </span>
        <span className="mt-0.5 block text-sm font-semibold">{shot.title}</span>
      </span>
    </button>
  )
}

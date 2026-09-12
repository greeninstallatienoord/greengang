import { ArrowUpRight } from 'lucide-react'
import { mediaPositionStyle, workCategoryLabels, type WorkShot } from '../../data/media'
import { cn } from '../../lib/cn'

type WorkTileProps = {
  shot: WorkShot
  onOpen: () => void
  priority?: boolean
  ratio: string
  sizes: string
  shift?: 'none' | 'down' | 'up'
  className?: string
}

export function WorkTile({
  shot,
  onOpen,
  priority = false,
  ratio,
  sizes,
  shift = 'none',
  className,
}: WorkTileProps) {
  const category = workCategoryLabels[shot.category]

  return (
    <button
      type="button"
      className={cn(
        'group work-tile relative w-full text-left',
        shift === 'down' && 'lg:mt-14',
        shift === 'up' && 'lg:-mt-8',
        className,
      )}
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
          className="media-photo absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.02]"
          style={mediaPositionStyle(shot.asset)}
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-ink/72 p-4 text-white opacity-0 transition-[opacity,transform] duration-300 ease-out motion-safe:translate-y-1 motion-safe:group-hover:translate-y-0 group-hover:opacity-100 md:block">
          <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/70">
            {category}
          </span>
          <span className="mt-1 flex items-end justify-between gap-3">
            <span className="text-sm font-semibold">{shot.title}</span>
            <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
          </span>
        </span>
      </span>
      <span className="mt-3 block md:hidden">
        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-dark">
          {category}
        </span>
        <span className="mt-1 block text-sm font-semibold">{shot.title}</span>
      </span>
    </button>
  )
}

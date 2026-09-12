import { schemeMarks } from '../../data/media'
import { cn } from '../../lib/cn'

type CertificationMarksProps = {
  compact?: boolean
  labeled?: boolean
}

export function CertificationMarks({
  compact = false,
  labeled = false,
}: CertificationMarksProps) {
  return (
    <ul
      className={cn(
        'grid grid-cols-2 items-center',
        compact
          ? 'gap-x-6 gap-y-4 sm:grid-cols-4 sm:gap-8'
          : 'gap-x-8 gap-y-8 sm:gap-10 lg:grid-cols-4',
      )}
    >
      {schemeMarks.map((mark) => (
        <li key={mark.id} className="flex flex-col items-center justify-center">
          <div
            className={cn(
              'flex w-full items-center justify-center',
              compact ? 'h-12' : 'h-16 sm:h-[4.5rem]',
            )}
          >
            <img
              src={mark.src}
              alt={mark.alt}
              width={mark.width}
              height={mark.height}
              className={cn(
                'h-auto w-auto max-w-full object-contain object-center',
                compact ? 'max-h-9' : 'max-h-14 sm:max-h-16',
              )}
              loading="lazy"
              decoding="async"
            />
          </div>
          {labeled ? (
            <p className="mt-3 text-center text-[0.72rem] font-semibold tracking-[0.08em] text-ink-muted uppercase">
              {mark.name}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

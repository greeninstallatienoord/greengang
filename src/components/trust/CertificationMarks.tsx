import { schemeMarks } from '../../data/media'
import { cn } from '../../lib/cn'

type CertificationMarksProps = {
  /** Equal bordered logo tiles (homepage / trust strip). */
  framed?: boolean
  /** Show text labels under logos. Prefer false when the mark is self-explanatory. */
  labeled?: boolean
  className?: string
}

export function CertificationMarks({
  framed = false,
  labeled = false,
  className,
}: CertificationMarksProps) {
  return (
    <ul
      className={cn(
        'grid grid-cols-2',
        framed
          ? 'gap-2.5 min-[390px]:gap-3 sm:gap-3.5 lg:grid-cols-4 lg:gap-4'
          : 'items-center gap-x-8 gap-y-8 sm:gap-10 lg:grid-cols-4',
        className,
      )}
    >
      {schemeMarks.map((mark) => (
        <li key={mark.id}>
          <div
            className={cn(
              framed
                ? 'flex h-[4.75rem] items-center justify-center rounded-sm border border-line bg-paper px-3 py-3 min-[390px]:h-[5rem] sm:h-[5.25rem] sm:px-4'
                : 'flex h-16 w-full items-center justify-center sm:h-[4.5rem]',
            )}
          >
            <img
              src={mark.src}
              alt={mark.alt}
              width={mark.width}
              height={mark.height}
              className={cn(
                'object-contain object-center',
                mark.fitClass ??
                  (framed
                    ? 'max-h-11 w-auto max-w-full sm:max-h-12'
                    : 'max-h-14 w-auto max-w-full sm:max-h-16'),
              )}
              loading="lazy"
              decoding="async"
            />
          </div>
          {labeled ? (
            <p className="mt-2.5 text-center text-[0.7rem] font-semibold tracking-[0.1em] text-ink-muted uppercase">
              {mark.name}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

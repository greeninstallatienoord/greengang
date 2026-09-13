import { cn } from '../../lib/cn'

type ProgressStepsProps = {
  steps: string[]
  current: number
}

export function ProgressSteps({ steps, current }: ProgressStepsProps) {
  const percent = ((current + 1) / steps.length) * 100

  return (
    <div className="mb-5 sm:mb-6">
      <p className="sr-only">
        Stap {current + 1} van {steps.length}: {steps[current]}
      </p>
      <p className="mb-2 text-sm font-semibold text-ink sm:hidden" aria-hidden="true">
        Stap {current + 1} van {steps.length}
        <span className="font-normal text-ink-muted"> · {steps[current]}</span>
      </p>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <ol className="hidden gap-2 text-center text-xs font-semibold sm:grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((label, index) => (
          <li
            key={label}
            className={cn(
              index === current
                ? 'text-brand-dark'
                : index < current
                  ? 'text-ink'
                  : 'text-ink-muted',
            )}
          >
            <span className="block">{index + 1}</span>
            <span className="mt-0.5 block">{label}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

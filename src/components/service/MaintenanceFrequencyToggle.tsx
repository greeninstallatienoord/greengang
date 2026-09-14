import { cn } from '../../lib/cn'
import {
  maintenanceCopy,
  type MaintenanceFrequency,
} from '../../data/maintenance'

type MaintenanceFrequencyToggleProps = {
  value: MaintenanceFrequency
  onChange: (next: MaintenanceFrequency) => void
  className?: string
  /** Compact width for desktop; full width on small screens by default. */
  compact?: boolean
}

export function MaintenanceFrequencyToggle({
  value,
  onChange,
  className,
  compact = true,
}: MaintenanceFrequencyToggleProps) {
  return (
    <div className={cn(compact ? 'w-full max-w-md' : 'w-full', className)}>
      <p className="text-sm font-semibold tracking-[-0.01em] text-ink">
        {maintenanceCopy.frequencyLabel}
      </p>
      <div
        className="mt-3 grid grid-cols-2 gap-1 rounded-[var(--radius-md)] border border-line bg-surface p-1"
        role="group"
        aria-label={maintenanceCopy.frequencyLabel}
      >
        <button
          type="button"
          className={cn(
            'min-h-11 rounded-[var(--radius-sm)] px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
            value === 'biennial'
              ? 'bg-brand text-white'
              : 'bg-transparent text-ink hover:bg-stone/70',
          )}
          aria-pressed={value === 'biennial'}
          onClick={() => onChange('biennial')}
        >
          {maintenanceCopy.biennialLabel}
        </button>
        <button
          type="button"
          className={cn(
            'min-h-11 rounded-[var(--radius-sm)] px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
            value === 'annual'
              ? 'bg-brand text-white'
              : 'bg-transparent text-ink hover:bg-stone/70',
          )}
          aria-pressed={value === 'annual'}
          onClick={() => onChange('annual')}
        >
          {maintenanceCopy.annualLabel}
        </button>
      </div>
      <p className="mt-3 text-sm text-ink-muted">
        {value === 'annual' ? maintenanceCopy.annualHint : maintenanceCopy.biennialHint}
      </p>
    </div>
  )
}

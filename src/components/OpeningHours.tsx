import { business, formatDayHours } from '../data/business'
import { cn } from '../lib/cn'

function todayKey(): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Amsterdam',
    weekday: 'long',
  })
    .format(new Date())
    .toLowerCase()
}

type OpeningHoursProps = {
  className?: string
  /** Compact weekday grouping for cards / sidebars. */
  compact?: boolean
}

export function OpeningHours({ className, compact = false }: OpeningHoursProps) {
  const today = todayKey()

  if (compact) {
    const weekday = business.openingHours.days.find((day) => day.day === 'monday')
    const saturday = business.openingHours.days.find((day) => day.day === 'saturday')
    const sunday = business.openingHours.days.find((day) => day.day === 'sunday')
    const weekdayHours = weekday ? formatDayHours(weekday) : '07:00–17:00'
    const weekendClosed =
      Boolean(saturday?.closed || !saturday?.opens) &&
      Boolean(sunday?.closed || !sunday?.opens)
    const isWeekday =
      today === 'monday' ||
      today === 'tuesday' ||
      today === 'wednesday' ||
      today === 'thursday' ||
      today === 'friday'
    const isWeekend = today === 'saturday' || today === 'sunday'

    return (
      <div className={className}>
        <dl className="grid gap-2.5 text-sm">
          <div className="flex items-baseline justify-between gap-3">
            <dt className={cn('font-medium', isWeekday ? 'text-ink' : 'text-ink-muted')}>
              Maandag t/m vrijdag
              {isWeekday ? <span className="sr-only"> (vandaag)</span> : null}
            </dt>
            <dd className="shrink-0 font-semibold tabular-nums text-ink">{weekdayHours}</dd>
          </div>
          {weekendClosed ? (
            <div className="flex items-baseline justify-between gap-3 border-t border-line/80 pt-2.5">
              <dt className={cn('font-medium', isWeekend ? 'text-ink' : 'text-ink-muted')}>
                Weekend
                {isWeekend ? <span className="sr-only"> (vandaag)</span> : null}
              </dt>
              <dd className="shrink-0 text-ink-muted">Gesloten</dd>
            </div>
          ) : (
            <>
              <div className="flex items-baseline justify-between gap-3 border-t border-line/80 pt-2.5">
                <dt
                  className={cn(
                    'font-medium',
                    today === 'saturday' ? 'text-ink' : 'text-ink-muted',
                  )}
                >
                  Zaterdag
                  {today === 'saturday' ? <span className="sr-only"> (vandaag)</span> : null}
                </dt>
                <dd className="shrink-0 text-ink-muted">
                  {saturday ? formatDayHours(saturday) : 'Gesloten'}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-line/80 pt-2.5">
                <dt
                  className={cn(
                    'font-medium',
                    today === 'sunday' ? 'text-ink' : 'text-ink-muted',
                  )}
                >
                  Zondag
                  {today === 'sunday' ? <span className="sr-only"> (vandaag)</span> : null}
                </dt>
                <dd className="shrink-0 text-ink-muted">
                  {sunday ? formatDayHours(sunday) : 'Gesloten'}
                </dd>
              </div>
            </>
          )}
        </dl>
        {business.emergencyService.available ? (
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">
            Bij storingen is de{' '}
            <a
              href={business.emergencyService.phoneHref}
              className="font-semibold text-brand-dark underline-offset-2 hover:underline"
            >
              {business.emergencyService.label}
            </a>{' '}
            ook buiten deze tijden bereikbaar.
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className={className}>
      <p className="text-sm text-ink-muted">{business.openingHours.summary}. Weekend gesloten.</p>
      <table className="mt-3 w-full text-sm">
        <caption className="sr-only">Openingstijden per dag</caption>
        <tbody>
          {business.openingHours.days.map((day) => {
            const isToday = day.day === today
            const closed = day.closed || !day.opens || !day.closes
            return (
              <tr
                key={day.day}
                className={cn(
                  'border-b border-line/80 last:border-0',
                  isToday && 'bg-brand-soft',
                )}
              >
                <th
                  scope="row"
                  className={cn(
                    'py-2 pr-3 text-left font-medium',
                    isToday ? 'text-ink' : 'text-ink-muted',
                  )}
                >
                  {day.label}
                  {isToday ? <span className="sr-only"> (vandaag)</span> : null}
                </th>
                <td
                  className={cn(
                    'py-2 text-right tabular-nums',
                    closed ? 'text-ink-muted' : 'font-semibold text-ink',
                  )}
                >
                  {formatDayHours(day)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

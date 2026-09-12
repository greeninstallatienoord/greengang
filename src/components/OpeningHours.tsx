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
}

export function OpeningHours({ className }: OpeningHoursProps) {
  const today = todayKey()

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

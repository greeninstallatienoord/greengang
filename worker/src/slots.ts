import type { WorkerEnv } from './env'
import { HttpError } from './http'
import { dateOnly } from './validation'

export const SLOT_TAKEN = 'Dit tijdstip is helaas net bezet. Kies een ander tijdstip.'

export type SlotConfig = {
  workingDays: number[]
  slotTimes: string[]
  durationMinutes: number
  bufferMinutes: number
  horizonDays: number
  blockedDates: string[]
}

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/

export function todayAmsterdam(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function minutesNowAmsterdam(): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? '0')
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? '0')
  return hour * 60 + minute
}

function toMinutes(value: string): number {
  const [hours, minutes] = value.split(':')
  return Number(hours) * 60 + Number(minutes)
}

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function weekdayIso(isoDate: string): number {
  const weekday = new Date(`${isoDate}T12:00:00Z`).getUTCDay()
  return weekday === 0 ? 7 : weekday
}

function parseList(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export async function readSlotConfig(env: WorkerEnv): Promise<SlotConfig> {
  const rows = await env.DB.prepare('SELECT key, value FROM settings').all<{
    key: string
    value: string
  }>()
  const stored = Object.fromEntries((rows.results ?? []).map((row) => [row.key, row.value]))

  const workingDays = parseList(stored.working_days || '1,2,3,4,5')
    .map(Number)
    .filter((day) => day >= 1 && day <= 7)
  const slotTimes = parseList(
    stored.slot_times || '09:00,10:00,11:00,13:00,14:00,15:00,16:00',
  ).filter((time) => TIME.test(time))

  return {
    workingDays: workingDays.length > 0 ? workingDays : [1, 2, 3, 4, 5],
    slotTimes,
    durationMinutes: Math.min(240, Math.max(15, Number(stored.slot_duration_minutes || 60))),
    bufferMinutes: Math.min(180, Math.max(0, Number(stored.buffer_minutes || 0))),
    horizonDays: Math.min(120, Math.max(1, Number(stored.slot_horizon_days || 28))),
    blockedDates: parseList(stored.blocked_dates).filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item)),
  }
}

export async function publicSlotConfig(env: WorkerEnv) {
  const config = await readSlotConfig(env)
  const today = todayAmsterdam()
  return {
    today,
    maxDate: addDays(today, config.horizonDays),
    workingDays: config.workingDays,
    blockedDates: config.blockedDates,
    horizonDays: config.horizonDays,
  }
}

export function assertBookableDate(date: string, config: SlotConfig): void {
  const today = todayAmsterdam()
  if (date < today) throw new HttpError(400, 'Kies een datum in de toekomst.')
  if (date > addDays(today, config.horizonDays)) {
    throw new HttpError(400, 'Deze datum ligt te ver vooruit. Kies een eerdere dag.')
  }
  if (config.blockedDates.includes(date)) {
    throw new HttpError(400, 'Op deze datum plannen we geen afspraken.')
  }
  if (!config.workingDays.includes(weekdayIso(date))) {
    throw new HttpError(400, 'Op deze dag plannen we geen afspraken. Kies een werkdag.')
  }
}

function overlaps(
  start: number,
  duration: number,
  otherStart: number,
  otherSpan: number,
): boolean {
  return start < otherStart + otherSpan && otherStart < start + duration
}

export async function listSlots(env: WorkerEnv, date: string) {
  const day = dateOnly(date)
  const config = await readSlotConfig(env)
  try {
    assertBookableDate(day, config)
  } catch (error) {
    if (error instanceof HttpError && error.status === 400) {
      return { date: day, slots: [] as string[], reason: error.message }
    }
    throw error
  }

  const taken = await env.DB.prepare(
    `SELECT appointment_time FROM appointments
     WHERE appointment_date = ? AND status NOT IN ('cancelled')`,
  )
    .bind(day)
    .all<{ appointment_time: string }>()

  const busy = (taken.results ?? [])
    .map((row) => row.appointment_time)
    .filter((time) => TIME.test(time))
  const occupiedSpan = config.durationMinutes + config.bufferMinutes
  const nowMinutes = day === todayAmsterdam() ? minutesNowAmsterdam() : -1

  const slots = config.slotTimes.filter((time) => {
    const start = toMinutes(time)
    if (nowMinutes >= 0 && start <= nowMinutes) return false
    return !busy.some((busyTime) =>
      overlaps(start, config.durationMinutes, toMinutes(busyTime), occupiedSpan),
    )
  })

  return { date: day, slots }
}

export async function assertSlotFree(
  env: WorkerEnv,
  date: string,
  time: string,
  excludeAppointmentId?: string,
): Promise<void> {
  const available = await listSlots(env, date)
  if (available.slots.includes(time)) return

  if (excludeAppointmentId) {
    const current = await env.DB.prepare(
      `SELECT appointment_date AS date, appointment_time AS time
       FROM appointments WHERE id = ?`,
    )
      .bind(excludeAppointmentId)
      .first<{ date: string; time: string }>()
    if (current?.date === date && current.time === time) return
  }

  throw new HttpError(409, SLOT_TAKEN)
}

import type { WorkShot } from '../data/media'

export type WorkBand =
  | { type: 'feature-split'; lead: WorkShot; stack: [WorkShot, WorkShot] }
  | { type: 'offset-pair'; primary: WorkShot; secondary: WorkShot; flip: boolean }
  | { type: 'wide'; shot: WorkShot }
  | { type: 'trio'; shots: [WorkShot, WorkShot, WorkShot] }

export function buildWorkBands(shots: WorkShot[]): WorkBand[] {
  const queue = [...shots]
  const bands: WorkBand[] = []
  let cycle = 0

  while (queue.length > 0) {
    const mode = cycle % 4
    const first = queue[0]
    const second = queue[1]
    const third = queue[2]

    if (mode === 0 && first && second && third) {
      bands.push({
        type: 'feature-split',
        lead: queue.shift()!,
        stack: [queue.shift()!, queue.shift()!],
      })
    } else if (mode === 1 && first && second) {
      bands.push({
        type: 'offset-pair',
        primary: queue.shift()!,
        secondary: queue.shift()!,
        flip: bands.length % 2 === 1,
      })
    } else if (mode === 2 && first) {
      bands.push({ type: 'wide', shot: queue.shift()! })
    } else if (mode === 3 && first && second && third) {
      bands.push({
        type: 'trio',
        shots: [queue.shift()!, queue.shift()!, queue.shift()!],
      })
    } else if (first && second) {
      bands.push({
        type: 'offset-pair',
        primary: queue.shift()!,
        secondary: queue.shift()!,
        flip: false,
      })
    } else if (first) {
      bands.push({ type: 'wide', shot: queue.shift()! })
    } else {
      break
    }

    cycle += 1
  }

  return bands
}

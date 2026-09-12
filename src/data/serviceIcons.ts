import type { LucideIcon } from 'lucide-react'
import { Flame, Thermometer, Wind, Wrench } from 'lucide-react'
import type { ServiceSlug } from '../types'

export const serviceIcons: Record<ServiceSlug, LucideIcon> = {
  'cv-ketel': Flame,
  airco: Wind,
  warmtepomp: Thermometer,
  'service-onderhoud': Wrench,
}

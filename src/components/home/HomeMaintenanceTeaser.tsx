import { MaintenancePackages } from '../service/MaintenancePackages'

/** Compact homepage teaser — package cards only, no photo. */
export function HomeMaintenanceTeaser() {
  return <MaintenancePackages variant="compact" />
}

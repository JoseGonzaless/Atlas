import type { Settlement } from '@/lib/db/settlement'

/**
 * Groups settlements by their periodId so consumers can look up a period's
 * settlements without fetching them per-card.
 */
export function groupSettlementsByPeriod(settlements: Settlement[]): Map<string, Settlement[]> {
  const map = new Map<string, Settlement[]>()
  for (const s of settlements) {
    const list = map.get(s.periodId) ?? []
    list.push(s)
    map.set(s.periodId, list)
  }
  return map
}

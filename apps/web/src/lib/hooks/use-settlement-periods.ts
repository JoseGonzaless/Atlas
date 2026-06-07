import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import type { SettlementPeriodFilters } from '@/lib/db/settlement'
import { queryKeys } from './query-keys'
import { useCurrentUser } from './use-current-user'

export function useSettlementPeriods(filters?: SettlementPeriodFilters) {
  // DB-backed current user so an unlink immediately disables this query.
  const { data: currentUser } = useCurrentUser()
  const partnershipId = currentUser?.partnershipId

  return useQuery({
    // Fold filters into the key so filtered and unfiltered callers don't alias
    // the same cache entry. `all` is a prefix of `filtered`, so invalidating
    // `all` still covers both.
    queryKey: filters
      ? queryKeys.settlementPeriods.filtered(partnershipId!, filters)
      : queryKeys.settlementPeriods.all(partnershipId!),
    queryFn: () => db.getSettlementPeriods(partnershipId!, filters),
    enabled: !!partnershipId,
  })
}

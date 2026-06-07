import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { queryKeys } from './query-keys'
import { useCurrentUser } from './use-current-user'

export function useSharedPeriodExpenses(activePeriodId: string | undefined) {
  // Use the DB-backed current user (not the static auth context) so an unlink
  // immediately disables this query instead of leaving it pointed at a dead
  // partnership.
  const { data: currentUser } = useCurrentUser()
  const partnershipId = currentUser?.partnershipId

  const filters = activePeriodId
    ? { scope: 'shared' as const, settlementPeriodId: activePeriodId }
    : undefined

  return useQuery({
    queryKey: filters
      ? queryKeys.expenses.filtered(partnershipId!, filters)
      : ['expenses', 'shared', 'no-period'],
    queryFn: () =>
      filters && partnershipId
        ? db.getExpenses(partnershipId, filters)
        : Promise.resolve([]),
    enabled: !!partnershipId && !!activePeriodId,
  })
}

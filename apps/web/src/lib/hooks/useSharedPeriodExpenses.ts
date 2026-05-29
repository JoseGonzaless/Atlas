import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/useAuth'
import { queryKeys } from './queryKeys'

export function useSharedPeriodExpenses(activePeriodId: string | undefined) {
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

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

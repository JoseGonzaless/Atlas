import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/use-auth'
import type { SettlementPeriodFilters } from '@/lib/db/settlement'
import { queryKeys } from './query-keys'

export function useSettlementPeriods(filters?: SettlementPeriodFilters) {
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useQuery({
    queryKey: queryKeys.settlementPeriods.all(partnershipId!),
    queryFn: () => db.getSettlementPeriods(partnershipId!, filters),
    enabled: !!partnershipId,
  })
}

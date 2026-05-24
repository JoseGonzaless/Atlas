import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/useAuth'
import type { SettlementPeriodFilters } from '@/lib/db/settlement'
import { queryKeys } from './queryKeys'

export function useSettlementPeriods(filters?: SettlementPeriodFilters) {
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useQuery({
    queryKey: queryKeys.settlementPeriods.all(partnershipId!),
    queryFn: () => db.getSettlementPeriods(partnershipId!, filters),
    enabled: !!partnershipId,
  })
}

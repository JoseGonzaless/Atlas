import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/useAuth'
import { queryKeys } from './queryKeys'

export function useActiveSettlementPeriod() {
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useQuery({
    queryKey: queryKeys.settlementPeriods.active(partnershipId!),
    queryFn: () => db.getActiveSettlementPeriod(partnershipId!),
    enabled: !!partnershipId,
  })
}

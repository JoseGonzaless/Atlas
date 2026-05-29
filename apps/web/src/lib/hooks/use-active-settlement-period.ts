import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/use-auth'
import { queryKeys } from './query-keys'

export function useActiveSettlementPeriod() {
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useQuery({
    queryKey: queryKeys.settlementPeriods.active(partnershipId!),
    queryFn: () => db.getActiveSettlementPeriod(partnershipId!),
    enabled: !!partnershipId,
  })
}

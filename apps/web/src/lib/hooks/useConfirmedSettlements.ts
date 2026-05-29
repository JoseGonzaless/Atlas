import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/useAuth'
import { queryKeys } from './queryKeys'

export function useConfirmedSettlements(periodId: string | undefined) {
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useQuery({
    queryKey: queryKeys.settlements.byPeriod(partnershipId!, periodId!),
    queryFn: () => db.getConfirmedSettlements(partnershipId!, periodId!),
    enabled: !!partnershipId && !!periodId,
  })
}

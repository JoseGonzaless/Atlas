import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/useAuth'
import { queryKeys } from './queryKeys'

export function usePendingSettlement(periodId: string | undefined) {
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useQuery({
    queryKey: queryKeys.settlements.pending(partnershipId!, periodId!),
    queryFn: () => db.getPendingSettlement(partnershipId!, periodId!),
    enabled: !!partnershipId && !!periodId,
  })
}

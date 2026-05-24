import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/useAuth'
import { queryKeys } from './queryKeys'

export function useSettlements() {
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useQuery({
    queryKey: queryKeys.settlements.all(partnershipId!),
    queryFn: () => db.getSettlements(partnershipId!),
    enabled: !!partnershipId,
  })
}

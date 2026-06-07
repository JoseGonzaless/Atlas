import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { queryKeys } from './query-keys'
import { useCurrentUser } from './use-current-user'

export function useSettlements() {
  // DB-backed current user so an unlink immediately disables this query.
  const { data: currentUser } = useCurrentUser()
  const partnershipId = currentUser?.partnershipId

  return useQuery({
    queryKey: queryKeys.settlements.all(partnershipId!),
    queryFn: () => db.getSettlements(partnershipId!),
    enabled: !!partnershipId,
  })
}

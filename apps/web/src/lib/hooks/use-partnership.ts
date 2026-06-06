import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { queryKeys } from './query-keys'
import { useCurrentUser } from './use-current-user'

export function usePartnership() {
  const { data: currentUser } = useCurrentUser()
  const partnershipId = currentUser?.partnershipId

  return useQuery({
    queryKey: queryKeys.partnerships.detail(partnershipId!),
    queryFn: () => db.getPartnership(partnershipId!),
    enabled: !!partnershipId,
  })
}

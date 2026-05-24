import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/useAuth'
import { queryKeys } from './queryKeys'

export function usePartnership() {
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useQuery({
    queryKey: queryKeys.partnerships.detail(partnershipId!),
    queryFn: () => db.getPartnership(partnershipId!),
    enabled: !!partnershipId,
  })
}

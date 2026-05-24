import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/useAuth'
import { queryKeys } from './queryKeys'

export function useCurrentUser() {
  const { user } = useAuth()
  const userId = user?.id

  return useQuery({
    queryKey: queryKeys.users.detail(userId!),
    queryFn: () => db.getUser(userId!),
    enabled: !!userId,
  })
}

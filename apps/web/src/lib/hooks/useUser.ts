import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { queryKeys } from './queryKeys'

export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId!),
    queryFn: () => db.getUser(userId!),
    enabled: !!userId,
  })
}

import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/use-auth'
import { queryKeys } from './query-keys'

export function useSentInvite() {
  const { user } = useAuth()
  const userId = user?.id

  return useQuery({
    queryKey: queryKeys.invites.sent(userId!),
    queryFn: () => db.getSentInviteByUser(userId!),
    enabled: !!userId,
  })
}

import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/use-auth'
import { queryKeys } from './query-keys'

export function usePendingInvite() {
  const { user } = useAuth()
  const email = user?.email

  return useQuery({
    queryKey: queryKeys.invites.pending(email!),
    queryFn: () => db.getPendingInviteForEmail(email!),
    enabled: !!email,
  })
}

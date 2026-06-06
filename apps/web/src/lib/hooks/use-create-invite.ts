import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/use-auth'
import type { CreatePartnershipInviteInput } from '@/lib/db/partnership'
import { queryKeys } from './query-keys'

export function useCreateInvite() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const userId = user?.id

  return useMutation({
    mutationFn: (data: CreatePartnershipInviteInput) => db.createInvite(data),
    onSuccess: () => {
      if (!userId) return
      queryClient.invalidateQueries({ queryKey: queryKeys.invites.sent(userId) })
    },
  })
}

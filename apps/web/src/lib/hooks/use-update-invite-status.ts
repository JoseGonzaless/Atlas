import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/use-auth'
import type { PartnershipInviteStatus } from '@/lib/db/partnership'
import { queryKeys } from './query-keys'

export function useUpdateInviteStatus() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const userId = user?.id
  const email = user?.email

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PartnershipInviteStatus }) =>
      db.updateInviteStatus(id, status),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.invites.sent(userId) })
      if (email) queryClient.invalidateQueries({ queryKey: queryKeys.invites.pending(email) })
      // Accepting an invite links the accounts, which changes this user's
      // partnershipId. Refetch the current user so usePartnership picks up the
      // new link and the UI flips to the "Linked" state.
      // NOTE(backend): the *inviter's* client won't observe the link until it
      // refetches — a real backend should push this via realtime invalidation.
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) })
    },
  })
}

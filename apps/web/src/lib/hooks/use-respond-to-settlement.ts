import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/use-auth'
import type { RespondToSettlementInput } from '@/lib/db/settlement'
import { queryKeys } from './query-keys'

export function useRespondToSettlement() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useMutation({
    mutationFn: (data: RespondToSettlementInput) => db.respondToSettlement(data),
    onSuccess: (settlement) => {
      if (!partnershipId) return
      queryClient.invalidateQueries({ queryKey: queryKeys.settlements.all(partnershipId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.settlements.pending(partnershipId, settlement.periodId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.settlements.byPeriod(partnershipId, settlement.periodId) })
    },
  })
}

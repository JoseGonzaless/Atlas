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
      // NOTE(backend): confirming a settlement is expected to settle the period
      // (stamp `settledAt` on its expenses, close the period, open the next one).
      // The current mock only flips the settlement status, so these two are inert
      // today — but invalidating them now means the shared page won't show a stale
      // active period / stale row state once the backend does that work.
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all(partnershipId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.settlementPeriods.active(partnershipId) })
    },
  })
}

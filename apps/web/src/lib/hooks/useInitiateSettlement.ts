import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/useAuth'
import type { InitiateSettlementInput } from '@/lib/db/settlement'
import { queryKeys } from './queryKeys'

export function useInitiateSettlement() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useMutation({
    mutationFn: (data: InitiateSettlementInput) => db.initiateSettlement(data),
    onSuccess: (_settlement, vars) => {
      if (!partnershipId) return
      queryClient.invalidateQueries({ queryKey: queryKeys.settlements.all(partnershipId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.settlements.pending(partnershipId, vars.periodId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.settlements.byPeriod(partnershipId, vars.periodId) })
    },
  })
}

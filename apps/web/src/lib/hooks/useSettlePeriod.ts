import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/useAuth'
import type { SettlePeriodInput } from '@/lib/db/settlement'
import { queryKeys } from './queryKeys'

export function useSettlePeriod() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useMutation({
    mutationFn: (data: SettlePeriodInput) => db.settlePeriod(data),
    onSuccess: () => {
      if (!partnershipId) return
      // settlePeriod touches expenses (stamps settledAt), the period status, and creates a settlement record
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all(partnershipId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.settlementPeriods.all(partnershipId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.settlements.all(partnershipId) })
    },
  })
}

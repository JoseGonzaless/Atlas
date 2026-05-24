import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/useAuth'
import { queryKeys } from './queryKeys'

export function useDeleteExpense() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useMutation({
    mutationFn: (id: string) => db.deleteExpense(id),
    onSuccess: () => {
      if (!partnershipId) return
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all(partnershipId) })
    },
  })
}

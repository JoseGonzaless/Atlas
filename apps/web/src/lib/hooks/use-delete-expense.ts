import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/use-auth'
import { queryKeys } from './query-keys'

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

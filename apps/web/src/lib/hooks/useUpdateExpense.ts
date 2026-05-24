import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/useAuth'
import type { UpdateExpenseInput } from '@/lib/db/expense'
import { queryKeys } from './queryKeys'

export function useUpdateExpense() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseInput }) =>
      db.updateExpense(id, data),
    onSuccess: () => {
      if (!partnershipId) return
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all(partnershipId) })
    },
  })
}

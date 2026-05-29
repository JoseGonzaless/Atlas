import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/use-auth'
import type { CreateExpenseInput } from '@/lib/db/expense'
import { queryKeys } from './query-keys'

export function useCreateExpense() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useMutation({
    mutationFn: (data: CreateExpenseInput) => db.createExpense(data),
    onSuccess: () => {
      if (!partnershipId) return
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all(partnershipId) })
    },
  })
}

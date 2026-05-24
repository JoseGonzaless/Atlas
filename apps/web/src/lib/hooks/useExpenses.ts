import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { useAuth } from '@/lib/useAuth'
import type { ExpenseFilters } from '@/lib/db/expense'
import { queryKeys } from './queryKeys'

export function useExpenses(filters?: ExpenseFilters) {
  const { user } = useAuth()
  const partnershipId = user?.partnershipId

  return useQuery({
    queryKey: filters
      ? queryKeys.expenses.filtered(partnershipId!, filters)
      : queryKeys.expenses.all(partnershipId!),
    queryFn: () => db.getExpenses(partnershipId!, filters),
    enabled: !!partnershipId,
  })
}

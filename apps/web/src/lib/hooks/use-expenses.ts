import { useQuery } from '@tanstack/react-query'
import { db } from '@/lib/db'
import type { ExpenseFilters } from '@/lib/db/expense'
import { queryKeys } from './query-keys'
import { useCurrentUser } from './use-current-user'

export function useExpenses(filters?: ExpenseFilters) {
  // Derive partnershipId from the DB-backed current user (not the static auth
  // context) so an unlink immediately disables/repoints this query.
  const { data: currentUser } = useCurrentUser()
  const partnershipId = currentUser?.partnershipId

  return useQuery({
    queryKey: filters
      ? queryKeys.expenses.filtered(partnershipId!, filters)
      : queryKeys.expenses.all(partnershipId!),
    queryFn: () => db.getExpenses(partnershipId!, filters),
    enabled: !!partnershipId,
  })
}

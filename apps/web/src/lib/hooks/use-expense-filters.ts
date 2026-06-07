import { useState, useMemo, useRef } from 'react'
import { parseISO, startOfDay, endOfDay } from 'date-fns'
import type { Expense } from '@/lib/db/expense'
import type { FilterState } from '@/components/expenses/expense-filters'

const emptyFilters: FilterState = {
  search: '', category: '', paidBy: '', dateFrom: '', dateTo: '', amountMin: '', amountMax: '',
}

export function useExpenseFilters(
  expenses: Expense[],
  pendingDeleteIds: Set<string>,
  initialFilters?: Partial<FilterState>,
) {
  const defaultFiltersRef = useRef<FilterState>({ ...emptyFilters, ...initialFilters })
  const defaultFilters = defaultFiltersRef.current
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const filtered = useMemo(() => {
    return expenses.filter(e => {
      if (pendingDeleteIds.has(e.id)) return false
      if (filters.category && e.category !== filters.category) return false
      if (filters.paidBy && e.paidBy !== filters.paidBy) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!e.description.toLowerCase().includes(q)) return false
      }
      if (filters.dateFrom && e.date < startOfDay(parseISO(filters.dateFrom))) return false
      if (filters.dateTo && e.date > endOfDay(parseISO(filters.dateTo))) return false
      // Ignore unparseable amount bounds (e.g. a lone ".") instead of comparing
      // against NaN, which would silently hide every row.
      const min = parseFloat(filters.amountMin)
      if (!isNaN(min) && e.amount < min) return false
      const max = parseFloat(filters.amountMax)
      if (!isNaN(max) && e.amount > max) return false
      return true
    })
  }, [expenses, filters, pendingDeleteIds])

  const hasActiveFilters = (Object.keys(defaultFilters) as (keyof FilterState)[]).some(
    k => filters[k] !== defaultFilters[k]
  )

  function resetFilters() { setFilters(defaultFilters) }

  return { filters, setFilters, filtered, hasActiveFilters, resetFilters }
}

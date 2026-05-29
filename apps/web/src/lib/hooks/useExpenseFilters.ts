import { useState, useMemo } from 'react'
import { parseISO, startOfDay, endOfDay } from 'date-fns'
import type { Expense } from '@/lib/db/expense'
import type { FilterState } from '@/components/expenses/ExpenseFilters'

const emptyFilters: FilterState = {
  search: '', category: '', paidBy: '', dateFrom: '', dateTo: '', amountMin: '', amountMax: '',
}

export function useExpenseFilters(expenses: Expense[], pendingDeleteIds: Set<string>) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters)

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
      if (filters.amountMin && e.amount < parseFloat(filters.amountMin)) return false
      if (filters.amountMax && e.amount > parseFloat(filters.amountMax)) return false
      return true
    })
  }, [expenses, filters, pendingDeleteIds])

  const hasActiveFilters = !!(
    filters.search || filters.category || filters.paidBy ||
    filters.dateFrom || filters.dateTo || filters.amountMin || filters.amountMax
  )

  function resetFilters() { setFilters(emptyFilters) }

  return { filters, setFilters, filtered, hasActiveFilters, resetFilters }
}

import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import type { Expense } from '@/lib/db/expense'
import { useDeleteExpense } from './use-delete-expense'

export function useDeleteWithUndo(expenses: Expense[]) {
  const deleteExpense = useDeleteExpense()
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<string>>(new Set())
  const deleteTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  // Clean up pendingDeleteIds once the query cache has caught up — prevents a
  // flicker where the item briefly reappears between the mutation resolving and
  // React Query invalidating the expenses list.
  useEffect(() => {
    const expenseIds = new Set(expenses.map(e => e.id))
    setPendingDeleteIds(prev => {
      if (prev.size === 0) return prev
      const stale = [...prev].filter(id => !expenseIds.has(id))
      if (stale.length === 0) return prev
      const s = new Set(prev)
      stale.forEach(id => s.delete(id))
      return s
    })
  }, [expenses])

  // Clear any still-pending delete timers on unmount so they don't fire after
  // the component is gone.
  useEffect(() => {
    const timers = deleteTimers.current
    return () => {
      timers.forEach(clearTimeout)
      timers.clear()
    }
  }, [])

  function handleDelete(id: string) {
    const expense = expenses.find(e => e.id === id)
    if (!expense) return

    setPendingDeleteIds(prev => new Set(prev).add(id))

    const timerId = setTimeout(async () => {
      deleteTimers.current.delete(id)
      try {
        await deleteExpense.mutateAsync(id)
      } catch {
        // Delete failed — un-hide the row and tell the user, otherwise the
        // expense stays in the list but invisible (its id never leaves
        // pendingDeleteIds because the cleanup effect only drops ids that have
        // actually left the expenses list).
        setPendingDeleteIds(prev => {
          const s = new Set(prev)
          s.delete(id)
          return s
        })
        toast.error(`Couldn't delete "${expense.description}". Try again.`)
      }
    }, 5000)

    deleteTimers.current.set(id, timerId)

    toast(`"${expense.description}" deleted`, {
      action: {
        label: 'Undo',
        onClick: () => {
          clearTimeout(deleteTimers.current.get(id))
          deleteTimers.current.delete(id)
          setPendingDeleteIds(prev => {
            const s = new Set(prev)
            s.delete(id)
            return s
          })
        },
      },
      duration: 5000,
    })
  }

  return { pendingDeleteIds, handleDelete }
}

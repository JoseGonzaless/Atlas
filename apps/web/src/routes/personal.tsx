import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns'
import {
  useCurrentUser,
  useExpenses,
  useCreateExpense,
  useUpdateExpense,
  useDeleteWithUndo,
  useExpenseFilters,
} from '@/lib/hooks'
import { toast } from 'sonner'
import { useAuth } from '@/lib/use-auth'
import type { Expense } from '@/lib/db/expense'
import { PersonalSummaryBar } from '@/components/expenses/personal-summary-bar'
import { ExpenseFilters } from '@/components/expenses/expense-filters'
import { ExpenseTable } from '@/components/expenses/expense-table'
import { AddExpenseDialog } from '@/components/expenses/add-expense-dialog'
import { ExpenseForm, type ExpenseFormValues } from '@/components/expenses/expense-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/personal')({
  component: PersonalLedger,
})

function PersonalLedger() {
  const { user: authUser } = useAuth()
  const { data: currentUser } = useCurrentUser()

  const { data: expenses = [], isLoading: expensesLoading } = useExpenses(
    authUser?.id ? { scope: 'personal' as const, paidBy: authUser.id } : undefined,
  )

  const createExpense = useCreateExpense()
  const updateExpense = useUpdateExpense()

  const [addOpen, setAddOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const { pendingDeleteIds, handleDelete } = useDeleteWithUndo(expenses)
  const now = new Date()
  const initialFilters = {
    dateFrom: format(startOfMonth(now), 'yyyy-MM-dd'),
    dateTo: format(endOfMonth(now), 'yyyy-MM-dd'),
  }
  const { filters, setFilters, filtered, hasActiveFilters, resetFilters } = useExpenseFilters(expenses, pendingDeleteIds, initialFilters)

  const currentUserEntry = useMemo(() => {
    if (!currentUser) return []
    return [{ id: currentUser.id, displayName: currentUser.displayName }]
  }, [currentUser])

  const userMap = useMemo<Record<string, string>>(
    () => Object.fromEntries(currentUserEntry.map(u => [u.id, u.displayName])),
    [currentUserEntry],
  )

  async function handleAdd(values: ExpenseFormValues) {
    if (!authUser?.id || !authUser.partnershipId) return
    const date = parseISO(values.date)
    try {
      await createExpense.mutateAsync({
        partnershipId: authUser.partnershipId,
        scope: 'personal',
        amount: Number(values.amount),
        description: values.description.trim(),
        category: values.category,
        paidBy: authUser.id,
        source: 'manual',
        date,
        settlementPeriodId: null,
      })
      setAddOpen(false)
    } catch {
      toast.error("Couldn't add expense. Try again.")
    }
  }

  async function handleEdit(values: ExpenseFormValues) {
    if (!editingExpense) return
    const date = parseISO(values.date)
    try {
      await updateExpense.mutateAsync({
        id: editingExpense.id,
        data: {
          amount: Number(values.amount),
          description: values.description.trim(),
          category: values.category,
          date,
        },
      })
      setEditingExpense(null)
    } catch {
      toast.error("Couldn't update expense. Try again.")
    }
  }

  const editInitialValues: ExpenseFormValues | undefined = editingExpense
    ? {
        amount: String(editingExpense.amount),
        description: editingExpense.description,
        category: editingExpense.category,
        paidBy: editingExpense.paidBy,
        date: format(editingExpense.date, 'yyyy-MM-dd'),
        notes: editingExpense.notes ?? '',
      }
    : undefined

  // Loading skeleton — wait for expenses to load before rendering
  if (expensesLoading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-3xl">Personal Ledger</h1>
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <h1 className="font-display text-3xl">Personal Ledger</h1>

      {/* Totals strip — filtered view for display, full list for month-over-month */}
      <PersonalSummaryBar expenses={filtered} allExpenses={expenses} />

      {/* Filters + expense table */}
      <div className="flex flex-col gap-3">
        <ExpenseFilters
          filters={filters}
          users={currentUserEntry}
          onChange={setFilters}
          hidePaidBy
        >
          <AddExpenseDialog
            open={addOpen}
            onOpenChange={setAddOpen}
            users={currentUserEntry}
            onSubmit={handleAdd}
            isLoading={createExpense.isPending}
            lockPaidBy
          />
        </ExpenseFilters>

        {expenses.length === 0 ? (
          <div className="rounded-xl border bg-card flex flex-col items-center justify-center py-16 gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              No personal expenses yet. Log expenses via Telegram or the web app.
            </p>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              Add expense
            </Button>
          </div>
        ) : filtered.length === 0 && hasActiveFilters ? (
          <div className="rounded-xl border bg-card flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-sm text-muted-foreground">
              No expenses match your filters.
            </p>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <ExpenseTable
            expenses={filtered}
            userMap={userMap}
            currentUserId={authUser?.id ?? ''}
            onEdit={setEditingExpense}
            onDelete={handleDelete}
            hiddenColumns={['paidBy', 'status']}
          />
        )}
      </div>

      {/* Edit expense dialog */}
      <Dialog
        open={!!editingExpense}
        onOpenChange={open => {
          if (!open) setEditingExpense(null)
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Edit expense</DialogTitle>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm
              initialValues={editInitialValues}
              users={currentUserEntry}
              onSubmit={handleEdit}
              onCancel={() => setEditingExpense(null)}
              isLoading={updateExpense.isPending}
              editMode
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

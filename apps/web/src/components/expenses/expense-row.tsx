import { format } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import type { Expense } from '@/lib/db/expense'
import { getCategoryColor } from '@/lib/utils/category-colors'

interface Props {
  expense: Expense
  paidByName: string
  currentUserId: string
  onEdit: () => void
  onDelete: () => void
  hiddenColumns?: ('paidBy' | 'status')[]
}

export function ExpenseRow({ expense, paidByName, currentUserId, onEdit, onDelete, hiddenColumns }: Props) {
  const colorClass = getCategoryColor(expense.category)
  const isSettled = !!expense.settledAt
  const canModify = !isSettled && expense.paidBy === currentUserId

  return (
    <TableRow>
      <TableCell className="font-mono font-medium tabular-nums">
        ${expense.amount.toFixed(2)}
      </TableCell>
      <TableCell className="max-w-56 truncate" title={expense.description}>
        {expense.description}
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${colorClass}`}>
          {expense.category}
        </span>
      </TableCell>
      {!hiddenColumns?.includes('paidBy') && (
        <TableCell className="text-muted-foreground">{paidByName}</TableCell>
      )}
      <TableCell className="text-muted-foreground tabular-nums">
        {format(expense.date, 'MMM d, yyyy')}
      </TableCell>
      {!hiddenColumns?.includes('status') && (
        <TableCell>
          {isSettled ? (
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              Settled
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-positive/15 text-positive px-2 py-0.5 text-xs">
              Open
            </span>
          )}
        </TableCell>
      )}
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onEdit}
            disabled={!canModify}
            aria-label="Edit expense"
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            disabled={!canModify}
            aria-label="Delete expense"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

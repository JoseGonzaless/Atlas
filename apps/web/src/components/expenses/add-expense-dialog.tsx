import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ExpenseForm, type ExpenseFormValues } from './expense-form'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: { id: string; displayName: string }[]
  onSubmit: (values: ExpenseFormValues) => void
  isLoading?: boolean
  lockPaidBy?: boolean
  periodStart?: Date
  periodEnd?: Date
}

export function AddExpenseDialog({ open, onOpenChange, users, onSubmit, isLoading, lockPaidBy, periodStart, periodEnd }: Props) {
  return (
    <>
      <Button size="sm" onClick={() => onOpenChange(true)}>
        <Plus />
        Add expense
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Add expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            users={users}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
            lockPaidBy={lockPaidBy}
            periodStart={periodStart}
            periodEnd={periodEnd}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

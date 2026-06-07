import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { format, parseISO, startOfDay, endOfDay } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EXPENSE_CATEGORIES } from '@/lib/db/expense'
import { cn } from '@/lib/utils'
import { formatAmountInput } from '@/lib/utils/format-amount-input'

export interface ExpenseFormValues {
  amount: string
  description: string
  category: string
  paidBy: string
  date: string
  notes: string
}

interface Props {
  initialValues?: Partial<ExpenseFormValues>
  users: { id: string; displayName: string }[]
  onSubmit: (values: ExpenseFormValues) => void
  onCancel: () => void
  isLoading?: boolean
  editMode?: boolean
  lockPaidBy?: boolean
  periodStart?: Date
  periodEnd?: Date
}


function makeDefaults(
  initial: Partial<ExpenseFormValues> | undefined,
  fallbackPaidBy: string,
): ExpenseFormValues {
  const today = new Date().toISOString().slice(0, 10)
  return {
    amount: initial?.amount ?? '',
    description: initial?.description ?? '',
    category: initial?.category ?? EXPENSE_CATEGORIES[0],
    paidBy: initial?.paidBy ?? fallbackPaidBy,
    date: initial?.date ?? today,
    notes: initial?.notes ?? '',
  }
}

export function ExpenseForm({
  initialValues,
  users,
  onSubmit,
  onCancel,
  isLoading,
  editMode,
  lockPaidBy,
  periodStart,
  periodEnd,
}: Props) {
  const [values, setValues] = useState<ExpenseFormValues>(() =>
    makeDefaults(initialValues, users[0]?.id ?? ''),
  )
  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormValues, string>>>({})
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [amountDisplay, setAmountDisplay] = useState(() => formatAmountInput(initialValues?.amount ?? ''))

  function set<K extends keyof ExpenseFormValues>(field: K, value: string) {
    setValues(v => ({ ...v, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate(): boolean {
    const errs: typeof errors = {}
    const amt = Number(values.amount)
    if (!values.amount || isNaN(amt) || amt <= 0) {
      errs.amount = 'Enter an amount greater than 0'
    }
    if (!values.description.trim()) {
      errs.description = 'Description is required'
    }
    if (!values.paidBy) {
      errs.paidBy = 'Select who paid'
    }
    if (!values.date) {
      errs.date = 'Date is required'
    } else if (periodStart && periodEnd) {
      // The calendar UI restricts selection, but enforce it here too so a default
      // or edited date can't land outside the period.
      const d = parseISO(values.date)
      if (d < startOfDay(periodStart) || d > endOfDay(periodEnd)) {
        errs.date = 'Date must be within the current period'
      }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    // Round to cents so we never store/sum sub-cent amounts that the UI would
    // round in display (keeps line items and totals consistent).
    const amount = (Math.round(Number(values.amount) * 100) / 100).toString()
    onSubmit({ ...values, amount })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ef-amount">Amount ($)</Label>
          <Input
            id="ef-amount"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amountDisplay}
            onChange={e => {
              const raw = e.target.value.replace(/,/g, '')
              if (raw === '' || /^\d*\.?\d{0,2}$/.test(raw)) {
                set('amount', raw)
                setAmountDisplay(raw)
              }
            }}
            onBlur={() => setAmountDisplay(formatAmountInput(values.amount))}
            onFocus={() => setAmountDisplay(values.amount)}
            aria-invalid={!!errors.amount}
          />
          {errors.amount && (
            <p className="text-xs text-destructive">{errors.amount}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Date</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger
              type="button"
              aria-invalid={!!errors.date}
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'w-full justify-start font-normal',
                !values.date && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="opacity-70" />
              {values.date ? format(parseISO(values.date), 'MMM d, yyyy') : 'Pick a date'}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={values.date ? parseISO(values.date) : undefined}
                onSelect={date => {
                  set('date', date ? format(date, 'yyyy-MM-dd') : '')
                  setCalendarOpen(false)
                }}
                disabled={periodStart && periodEnd
                  ? { before: periodStart, after: periodEnd }
                  : undefined}
                startMonth={periodStart}
                endMonth={periodEnd}
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ef-description">Description</Label>
        <Input
          id="ef-description"
          placeholder="e.g. Whole Foods run"
          value={values.description}
          onChange={e => set('description', e.target.value)}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ef-category">Category</Label>
          <NativeSelect
            id="ef-category"
            value={values.category}
            onChange={e => set('category', e.target.value)}
            className="w-full"
          >
            {EXPENSE_CATEGORIES.map(c => (
              <NativeSelectOption key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ef-paidby">Paid by</Label>
          <NativeSelect
            id="ef-paidby"
            value={values.paidBy}
            onChange={e => set('paidBy', e.target.value)}
            disabled={editMode || lockPaidBy}
            aria-invalid={!!errors.paidBy}
            className="w-full"
          >
            {!values.paidBy && <NativeSelectOption value="">Select payer</NativeSelectOption>}
            {users.map(u => (
              <NativeSelectOption key={u.id} value={u.id}>
                {u.displayName}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {errors.paidBy && (
            <p className="text-xs text-destructive">{errors.paidBy}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? 'Saving…' : editMode ? 'Save changes' : 'Add expense'}
        </Button>
      </div>
    </form>
  )
}

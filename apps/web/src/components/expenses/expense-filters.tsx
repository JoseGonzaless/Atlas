import { useState, type ReactNode } from 'react'
import { CalendarIcon, Search, X } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { EXPENSE_CATEGORIES } from '@/lib/db/expense'
import { cn } from '@/lib/utils'

export interface FilterState {
  search: string
  category: string
  paidBy: string
  dateFrom: string
  dateTo: string
  amountMin: string
  amountMax: string
}

interface Props {
  filters: FilterState
  users: { id: string; displayName: string }[]
  onChange: (filters: FilterState) => void
  children?: ReactNode
  periodStart?: Date
  periodEnd?: Date
  hidePaidBy?: boolean
}

export function ExpenseFilters({ filters, users, onChange, children, periodStart, periodEnd, hidePaidBy }: Props) {
  const hasActive = filters.search || filters.category || filters.paidBy || filters.dateFrom || filters.dateTo || filters.amountMin || filters.amountMax
  const [dateFromOpen, setDateFromOpen] = useState(false)
  const [dateToOpen, setDateToOpen] = useState(false)

  function reset() {
    onChange({ search: '', category: '', paidBy: '', dateFrom: '', dateTo: '', amountMin: '', amountMax: '' })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by description…"
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          className="w-48 pl-8"
        />
      </div>

      <NativeSelect
        value={filters.category}
        onChange={e => onChange({ ...filters, category: e.target.value })}
        aria-label="Filter by category"
      >
        <NativeSelectOption value="">All categories</NativeSelectOption>
        {EXPENSE_CATEGORIES.map(c => (
          <NativeSelectOption key={c} value={c}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      {!hidePaidBy && (
        <NativeSelect
          value={filters.paidBy}
          onChange={e => onChange({ ...filters, paidBy: e.target.value })}
          aria-label="Filter by payer"
        >
          <NativeSelectOption value="">All payers</NativeSelectOption>
          {users.map(u => (
            <NativeSelectOption key={u.id} value={u.id}>
              {u.displayName}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      )}

      <div className="flex items-center gap-1.5">
        <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
          <PopoverTrigger
            type="button"
            aria-label="From date"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'w-36 justify-start font-normal',
              !filters.dateFrom && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="opacity-70" />
            {filters.dateFrom ? format(parseISO(filters.dateFrom), 'MMM d, yyyy') : 'From'}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateFrom ? parseISO(filters.dateFrom) : undefined}
              onSelect={date => {
                onChange({ ...filters, dateFrom: date ? format(date, 'yyyy-MM-dd') : '' })
                setDateFromOpen(false)
              }}
              disabled={periodStart && periodEnd
                ? { before: periodStart, after: periodEnd }
                : undefined}
              startMonth={periodStart}
              endMonth={periodEnd}
            />
          </PopoverContent>
        </Popover>

        <span className="text-xs text-muted-foreground">–</span>

        <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
          <PopoverTrigger
            type="button"
            aria-label="To date"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'w-36 justify-start font-normal',
              !filters.dateTo && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="opacity-70" />
            {filters.dateTo ? format(parseISO(filters.dateTo), 'MMM d, yyyy') : 'To'}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateTo ? parseISO(filters.dateTo) : undefined}
              onSelect={date => {
                onChange({ ...filters, dateTo: date ? format(date, 'yyyy-MM-dd') : '' })
                setDateToOpen(false)
              }}
              disabled={periodStart && periodEnd
                ? { before: periodStart, after: periodEnd }
                : undefined}
              startMonth={periodStart}
              endMonth={periodEnd}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-1.5">
        <Input
          type="text"
          inputMode="decimal"
          placeholder="Min $"
          value={filters.amountMin}
          onChange={e => {
            const raw = e.target.value
            if (raw === '' || /^\d*\.?\d*$/.test(raw))
              onChange({ ...filters, amountMin: raw })
          }}
          className="w-24"
        />
        <span className="text-xs text-muted-foreground">–</span>
        <Input
          type="text"
          inputMode="decimal"
          placeholder="Max $"
          value={filters.amountMax}
          onChange={e => {
            const raw = e.target.value
            if (raw === '' || /^\d*\.?\d*$/.test(raw))
              onChange({ ...filters, amountMax: raw })
          }}
          className="w-24"
        />
      </div>

      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="gap-1.5 text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
      {children && <div className="ml-auto">{children}</div>}
    </div>
  )
}

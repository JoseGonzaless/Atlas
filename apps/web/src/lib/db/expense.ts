// --- Constants ---

// See SRD §12h — confirm final list before launch
export const EXPENSE_CATEGORIES = [
  'food',
  'grocery',
  'shopping',
  'subscriptions',
  'entertainment',
  'investments',
  'other',
] as const

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]

// --- Core Types ---

export type ExpenseScope = 'shared' | 'personal'

export type ExpenseSource = 'bot' | 'manual' | 'imported'

export interface Expense {
  id: string
  partnershipId: string
  scope: ExpenseScope
  amount: number                    // full amount paid — never pre-split
  description: string
  category: string                  // ExpenseCategory or a custom category string
  notes?: string                    // up to 500 chars (SRD §7a)
  paidBy: string                    // userId of who paid
  source: ExpenseSource
  date: Date                        // when the expense occurred (user-specified)
  createdAt: Date                   // when it was logged into the system
  settlementPeriodId: string | null // null for personal-scoped expenses
  settledAt: Date | null            // null until the containing period is settled
}

// --- Input Types ---

export type CreateExpenseInput = Omit<Expense, 'id' | 'createdAt' | 'settledAt'>
export type UpdateExpenseInput = Partial<
  Pick<Expense, 'description' | 'category' | 'notes' | 'amount' | 'date'>
>

// --- Filters ---

export interface ExpenseFilters {
  scope?: ExpenseScope
  categories?: string[]              // multi-select; empty array = no filter
  paidBy?: string                    // userId
  source?: ExpenseSource
  settlementPeriodId?: string | null // pass null to match expenses with no period
  settled?: 'settled' | 'unsettled'  // omit for no filter
  dateRange?: { from: Date; to: Date }
  search?: string                    // free-text; matches description + category
}

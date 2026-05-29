import { useState, useEffect } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { ExpenseRow } from './expense-row'
import type { Expense } from '@/lib/db/expense'

const PAGE_SIZE = 20

type SortField = 'amount' | 'description' | 'category' | 'paidBy' | 'date'
type SortDir = 'asc' | 'desc'

interface Props {
  expenses: Expense[]
  userMap: Record<string, string>
  currentUserId: string
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

function sorted(
  expenses: Expense[],
  field: SortField,
  dir: SortDir,
  userMap: Record<string, string>,
): Expense[] {
  return [...expenses].sort((a, b) => {
    let cmp = 0
    if (field === 'amount') cmp = a.amount - b.amount
    else if (field === 'description') cmp = a.description.localeCompare(b.description)
    else if (field === 'category') cmp = a.category.localeCompare(b.category)
    else if (field === 'paidBy') cmp = (userMap[a.paidBy] ?? '').localeCompare(userMap[b.paidBy] ?? '')
    else if (field === 'date') cmp = a.date.getTime() - b.date.getTime()
    return dir === 'asc' ? cmp : -cmp
  })
}

function SortIndicator({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="ml-1 inline h-3.5 w-3.5 text-muted-foreground/40" />
  return dir === 'asc'
    ? <ChevronUp className="ml-1 inline h-3.5 w-3.5" />
    : <ChevronDown className="ml-1 inline h-3.5 w-3.5" />
}

const columns: { field: SortField; label: string }[] = [
  { field: 'amount', label: 'Amount' },
  { field: 'description', label: 'Description' },
  { field: 'category', label: 'Category' },
  { field: 'paidBy', label: 'Paid by' },
  { field: 'date', label: 'Date' },
]

export function ExpenseTable({ expenses, userMap, currentUserId, onEdit, onDelete }: Props) {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)

  useEffect(() => { setPage(1) }, [expenses])

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const rows = sorted(expenses, sortField, sortDir, userMap)
  const totalPages = Math.ceil(rows.length / PAGE_SIZE)
  const currentPage = Math.min(page, totalPages)
  const pageRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function pageNumbers(): (number | 'ellipsis')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | 'ellipsis')[] = [1]
    if (currentPage > 3) pages.push('ellipsis')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++)
      pages.push(i)
    if (currentPage < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
    return pages
  }

  return (
    <>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map(({ field, label }) => (
                <TableHead key={field}>
                  <button
                    type="button"
                    onClick={() => handleSort(field)}
                    className="inline-flex cursor-pointer select-none items-center hover:text-foreground transition-colors"
                  >
                    {label}
                    <SortIndicator active={sortField === field} dir={sortDir} />
                  </button>
                </TableHead>
              ))}
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map(expense => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                paidByName={userMap[expense.paidBy] ?? expense.paidBy}
                currentUserId={currentUserId}
                onEdit={() => onEdit(expense)}
                onDelete={() => onDelete(expense.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={e => { e.preventDefault(); setPage(p => Math.max(1, p - 1)) }}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {pageNumbers().map((p, i) =>
              p === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === currentPage}
                    onClick={e => { e.preventDefault(); setPage(p) }}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                onClick={e => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)) }}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
    </>
  )
}

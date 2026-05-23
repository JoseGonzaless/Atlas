import { z } from 'zod'

const expenseSchema = z.object({
  scope: z.enum(['we', 'me']),
  amount: z.number().positive(),
  description: z.string().min(1),
})

export type ParsedExpense = z.infer<typeof expenseSchema>

export function parseExpenseMessage(text: string): ParsedExpense | null {
  const match = text.match(/^(we|me)\s+spent\s+\$?([\d.]+)\s+(.+)$/i)
  if (!match) return null

  const result = expenseSchema.safeParse({
    scope: match[1].toLowerCase(),
    amount: parseFloat(match[2]),
    description: match[3].trim(),
  })

  return result.success ? result.data : null
}

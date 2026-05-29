import type { ExpenseCategory } from '@/lib/db/expense'

export const categoryColors: Record<ExpenseCategory | string, string> = {
  food:           'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  grocery:        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  shopping:       'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  subscriptions:  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  entertainment:  'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  investments:    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  other:          'bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-400',
}

export function getCategoryColor(category: string): string {
  return categoryColors[category] ?? categoryColors.other
}

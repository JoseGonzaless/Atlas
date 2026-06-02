import {
  Utensils,
  ShoppingCart,
  ShoppingBag,
  RefreshCw,
  Monitor,
  TrendingUp,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react'
import type { ExpenseCategory } from '@/lib/db/expense'

export const categoryIcons: Record<ExpenseCategory | string, LucideIcon> = {
  food: Utensils,
  grocery: ShoppingCart,
  shopping: ShoppingBag,
  subscriptions: RefreshCw,
  entertainment: Monitor,
  investments: TrendingUp,
  other: MoreHorizontal,
}

export function getCategoryIcon(category: string): LucideIcon {
  return categoryIcons[category] ?? categoryIcons.other
}

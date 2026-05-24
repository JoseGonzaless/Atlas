import type { IDatabase } from './interface'
import type { User, UpdateUserInput } from './user'
import type {
  Partnership,
  PartnershipInvite,
  PartnershipInviteStatus,
  CreatePartnershipInviteInput,
  CreatePartnershipInput,
  UpdatePartnershipInput,
} from './partnership'
import type {
  Expense,
  ExpenseFilters,
  CreateExpenseInput,
  UpdateExpenseInput,
} from './expense'
import type {
  SettlementPeriod,
  Settlement,
  SettlementStatus,
  CreateSettlementPeriodInput,
  SettlementPeriodFilters,
  SettlePeriodInput,
} from './settlement'
import {
  subDays,
  subWeeks,
  addDays,
  startOfWeek,
  endOfWeek,
} from 'date-fns'

const delay = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

const NOW = new Date()

const sp1Start = subWeeks(NOW, 5)
const sp1End = subWeeks(NOW, 4)
const sp2Start = subWeeks(NOW, 4)
const sp2End = subWeeks(NOW, 3)
const sp3Start = subWeeks(NOW, 3)
const sp3End = subWeeks(NOW, 2)
const sp4Start = startOfWeek(NOW, { weekStartsOn: 1 })
const sp4End = endOfWeek(NOW, { weekStartsOn: 1 })

const s1SettledAt = sp1End
const s2SettledAt = subDays(sp2End, 2)

const inviteCreatedAt = subWeeks(NOW, 5)

let users: User[] = [
  {
    id: 'user-1',
    displayName: 'Jose',
    email: 'jose@atlas.app',
    onboardingComplete: true,
    partnershipId: 'p-1',
    createdAt: subWeeks(NOW, 5),
  },
  {
    id: 'user-2',
    displayName: 'Rose',
    email: 'rose@atlas.app',
    onboardingComplete: true,
    partnershipId: 'p-1',
    createdAt: subWeeks(NOW, 5),
  },
]

let partnerships: Partnership[] = [
  {
    id: 'p-1',
    userIds: ['user-1', 'user-2'],
    settlementFrequency: 'weekly',
    settlementDayOfWeek: 1,
    createdAt: subWeeks(NOW, 5),
  },
]

let invites: PartnershipInvite[] = [
  {
    id: 'inv-1',
    fromUserId: 'user-1',
    toEmail: 'rose@atlas.app',
    status: 'accepted',
    createdAt: inviteCreatedAt,
    expiresAt: addDays(inviteCreatedAt, 7),
  },
]

let expenses: Expense[] = [
  // sp-1 — settled
  { id: 'e-1',  partnershipId: 'p-1', scope: 'shared',   amount: 120.00, description: 'Whole Foods run',         category: 'grocery',       paidBy: 'user-1', source: 'manual', date: subDays(NOW, 34), createdAt: subDays(NOW, 34), settlementPeriodId: 'sp-1', settledAt: s1SettledAt },
  { id: 'e-2',  partnershipId: 'p-1', scope: 'shared',   amount: 65.50,  description: "Dinner at Rosario's",     category: 'food',          paidBy: 'user-2', source: 'bot',    date: subDays(NOW, 32), createdAt: subDays(NOW, 32), settlementPeriodId: 'sp-1', settledAt: s1SettledAt },
  { id: 'e-3',  partnershipId: 'p-1', scope: 'shared',   amount: 18.99,  description: 'Netflix',                 category: 'subscriptions', paidBy: 'user-1', source: 'manual', date: subDays(NOW, 31), createdAt: subDays(NOW, 31), settlementPeriodId: 'sp-1', settledAt: s1SettledAt },
  { id: 'e-4',  partnershipId: 'p-1', scope: 'shared',   amount: 42.00,  description: 'Movie + snacks',          category: 'entertainment', paidBy: 'user-2', source: 'manual', date: subDays(NOW, 30), createdAt: subDays(NOW, 30), settlementPeriodId: 'sp-1', settledAt: s1SettledAt },
  { id: 'e-5',  partnershipId: 'p-1', scope: 'shared',   amount: 200.00, description: 'Index fund contribution', category: 'investments',   paidBy: 'user-1', source: 'manual', date: subDays(NOW, 29), createdAt: subDays(NOW, 29), settlementPeriodId: 'sp-1', settledAt: s1SettledAt },
  { id: 'e-6',  partnershipId: 'p-1', scope: 'shared',   amount: 54.75,  description: 'Sushi night',             category: 'food',          paidBy: 'user-2', source: 'bot',    date: subDays(NOW, 28), createdAt: subDays(NOW, 28), settlementPeriodId: 'sp-1', settledAt: s1SettledAt },
  // sp-2 — settled
  { id: 'e-7',  partnershipId: 'p-1', scope: 'shared',   amount: 88.40,  description: 'Costco haul',             category: 'grocery',       paidBy: 'user-1', source: 'manual', date: subDays(NOW, 26), createdAt: subDays(NOW, 26), settlementPeriodId: 'sp-2', settledAt: s2SettledAt },
  { id: 'e-8',  partnershipId: 'p-1', scope: 'shared',   amount: 35.00,  description: 'Pizza Friday',            category: 'food',          paidBy: 'user-2', source: 'bot',    date: subDays(NOW, 24), createdAt: subDays(NOW, 24), settlementPeriodId: 'sp-2', settledAt: s2SettledAt },
  { id: 'e-9',  partnershipId: 'p-1', scope: 'shared',   amount: 14.99,  description: 'Spotify Family',          category: 'subscriptions', paidBy: 'user-1', source: 'manual', date: subDays(NOW, 23), createdAt: subDays(NOW, 23), settlementPeriodId: 'sp-2', settledAt: s2SettledAt },
  { id: 'e-10', partnershipId: 'p-1', scope: 'shared',   amount: 110.00, description: 'IKEA frames',             category: 'shopping',      paidBy: 'user-2', source: 'manual', date: subDays(NOW, 22), createdAt: subDays(NOW, 22), settlementPeriodId: 'sp-2', settledAt: s2SettledAt },
  { id: 'e-11', partnershipId: 'p-1', scope: 'shared',   amount: 60.00,  description: 'Concert tickets',         category: 'entertainment', paidBy: 'user-1', source: 'bot',    date: subDays(NOW, 21), createdAt: subDays(NOW, 21), settlementPeriodId: 'sp-2', settledAt: s2SettledAt },
  { id: 'e-12', partnershipId: 'p-1', scope: 'shared',   amount: 29.50,  description: 'Brunch Sunday',           category: 'food',          paidBy: 'user-2', source: 'manual', date: subDays(NOW, 20), createdAt: subDays(NOW, 20), settlementPeriodId: 'sp-2', settledAt: s2SettledAt },
  // sp-3 — outstanding
  { id: 'e-13', partnershipId: 'p-1', scope: 'shared',   amount: 95.20,  description: 'Weekly groceries',        category: 'grocery',       paidBy: 'user-1', source: 'manual', date: subDays(NOW, 18), createdAt: subDays(NOW, 18), settlementPeriodId: 'sp-3', settledAt: null },
  { id: 'e-14', partnershipId: 'p-1', scope: 'shared',   amount: 48.00,  description: 'Thai takeout',            category: 'food',          paidBy: 'user-2', source: 'bot',    date: subDays(NOW, 17), createdAt: subDays(NOW, 17), settlementPeriodId: 'sp-3', settledAt: null },
  { id: 'e-15', partnershipId: 'p-1', scope: 'shared',   amount: 22.00,  description: 'Bowling night',           category: 'entertainment', paidBy: 'user-1', source: 'manual', date: subDays(NOW, 15), createdAt: subDays(NOW, 15), settlementPeriodId: 'sp-3', settledAt: null },
  { id: 'e-16', partnershipId: 'p-1', scope: 'shared',   amount: 75.00,  description: 'Household supplies',      category: 'other',         paidBy: 'user-2', source: 'manual', date: subDays(NOW, 14), createdAt: subDays(NOW, 14), settlementPeriodId: 'sp-3', settledAt: null },
  // sp-4 — open
  { id: 'e-17', partnershipId: 'p-1', scope: 'shared',   amount: 73.60,  description: "Trader Joe's",            category: 'grocery',       paidBy: 'user-1', source: 'manual', date: subDays(NOW, 3),  createdAt: subDays(NOW, 3),  settlementPeriodId: 'sp-4', settledAt: null },
  { id: 'e-18', partnershipId: 'p-1', scope: 'shared',   amount: 55.00,  description: 'Dinner out',              category: 'food',          paidBy: 'user-2', source: 'bot',    date: subDays(NOW, 2),  createdAt: subDays(NOW, 2),  settlementPeriodId: 'sp-4', settledAt: null },
  { id: 'e-19', partnershipId: 'p-1', scope: 'shared',   amount: 12.99,  description: 'iCloud storage',          category: 'subscriptions', paidBy: 'user-1', source: 'manual', date: subDays(NOW, 1),  createdAt: subDays(NOW, 1),  settlementPeriodId: 'sp-4', settledAt: null },
  // personal — no period
  { id: 'e-20', partnershipId: 'p-1', scope: 'personal', amount: 89.99,  description: 'New running shoes',       category: 'shopping',      paidBy: 'user-1', source: 'manual', date: subDays(NOW, 10), createdAt: subDays(NOW, 10), settlementPeriodId: null,   settledAt: null },
  { id: 'e-21', partnershipId: 'p-1', scope: 'personal', amount: 45.00,  description: 'Work lunch week',         category: 'food',          paidBy: 'user-1', source: 'manual', date: subDays(NOW, 5),  createdAt: subDays(NOW, 5),  settlementPeriodId: null,   settledAt: null },
]

let settlementPeriods: SettlementPeriod[] = [
  { id: 'sp-1', partnershipId: 'p-1', startDate: sp1Start, endDate: sp1End, status: 'settled',     createdAt: sp1Start },
  { id: 'sp-2', partnershipId: 'p-1', startDate: sp2Start, endDate: sp2End, status: 'settled',     createdAt: sp2Start },
  { id: 'sp-3', partnershipId: 'p-1', startDate: sp3Start, endDate: sp3End, status: 'outstanding', createdAt: sp3Start },
  { id: 'sp-4', partnershipId: 'p-1', startDate: sp4Start, endDate: sp4End, status: 'open',        createdAt: sp4Start },
]

let settlements: Settlement[] = [
  {
    id: 's-1',
    periodId: 'sp-1',
    partnershipId: 'p-1',
    fromUserId: 'user-2',
    toUserId: 'user-1',
    amount: 88.37,
    status: 'on-time',
    daysOverdue: null,
    settledAt: s1SettledAt,
    partnerDisplayNameSnapshot: 'Rose',
    expenseIds: ['e-1', 'e-2', 'e-3', 'e-4', 'e-5', 'e-6'],
  },
  {
    id: 's-2',
    periodId: 'sp-2',
    partnershipId: 'p-1',
    fromUserId: 'user-1',
    toUserId: 'user-2',
    amount: 5.56,
    status: 'early',
    daysOverdue: null,
    settledAt: s2SettledAt,
    partnerDisplayNameSnapshot: 'Rose',
    expenseIds: ['e-7', 'e-8', 'e-9', 'e-10', 'e-11', 'e-12'],
  },
]

export class MockDatabase implements IDatabase {
  async getUser(id: string): Promise<User> {
    await delay(80)
    const user = users.find(u => u.id === id)
    if (!user) throw new Error(`Not found: ${id}`)
    return user
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    await delay(80)
    const idx = users.findIndex(u => u.id === id)
    if (idx === -1) throw new Error(`Not found: ${id}`)
    users[idx] = { ...users[idx], ...data }
    return users[idx]
  }

  async getPartnership(id: string): Promise<Partnership> {
    await delay(80)
    const p = partnerships.find(p => p.id === id)
    if (!p) throw new Error(`Not found: ${id}`)
    return p
  }

  async createPartnership(data: CreatePartnershipInput): Promise<Partnership> {
    await delay(80)
    const partnership: Partnership = { ...data, id: crypto.randomUUID(), createdAt: new Date() }
    partnerships.push(partnership)
    return partnership
  }

  async updatePartnership(id: string, data: UpdatePartnershipInput): Promise<Partnership> {
    await delay(80)
    const idx = partnerships.findIndex(p => p.id === id)
    if (idx === -1) throw new Error(`Not found: ${id}`)
    partnerships[idx] = { ...partnerships[idx], ...data }
    return partnerships[idx]
  }

  async dissolvePartnership(id: string): Promise<void> {
    await delay(80)
    const idx = partnerships.findIndex(p => p.id === id)
    if (idx === -1) throw new Error(`Not found: ${id}`)
    const { userIds } = partnerships[idx]
    partnerships.splice(idx, 1)
    for (const userId of userIds) {
      const uidx = users.findIndex(u => u.id === userId)
      if (uidx !== -1) users[uidx] = { ...users[uidx], partnershipId: undefined }
    }
  }

  async getPendingInviteForEmail(email: string): Promise<PartnershipInvite | null> {
    await delay(80)
    return invites.find(i => i.toEmail === email && i.status === 'pending') ?? null
  }

  async getSentInviteByUser(fromUserId: string): Promise<PartnershipInvite | null> {
    await delay(80)
    return invites.find(i => i.fromUserId === fromUserId && i.status === 'pending') ?? null
  }

  async createInvite(data: CreatePartnershipInviteInput): Promise<PartnershipInvite> {
    await delay(80)
    const createdAt = new Date()
    const invite: PartnershipInvite = {
      ...data,
      id: crypto.randomUUID(),
      status: 'pending',
      createdAt,
      expiresAt: addDays(createdAt, 7),
    }
    invites.push(invite)
    return invite
  }

  async updateInviteStatus(id: string, status: PartnershipInviteStatus): Promise<PartnershipInvite> {
    await delay(80)
    const idx = invites.findIndex(i => i.id === id)
    if (idx === -1) throw new Error(`Not found: ${id}`)
    invites[idx] = { ...invites[idx], status }
    return invites[idx]
  }

  async getExpenses(partnershipId: string, filters?: ExpenseFilters): Promise<Expense[]> {
    await delay(80)
    let result = expenses.filter(e => e.partnershipId === partnershipId)

    if (filters) {
      if (filters.scope !== undefined)
        result = result.filter(e => e.scope === filters.scope)
      if (filters.categories !== undefined && filters.categories.length > 0)
        result = result.filter(e => filters.categories!.includes(e.category))
      if (filters.paidBy !== undefined)
        result = result.filter(e => e.paidBy === filters.paidBy)
      if (filters.source !== undefined)
        result = result.filter(e => e.source === filters.source)
      if ('settlementPeriodId' in filters)
        result = result.filter(e => e.settlementPeriodId === filters.settlementPeriodId)
      if (filters.settled === 'settled')
        result = result.filter(e => e.settledAt !== null)
      else if (filters.settled === 'unsettled')
        result = result.filter(e => e.settledAt === null)
      if (filters.dateRange !== undefined)
        result = result.filter(e => e.date >= filters.dateRange!.from && e.date <= filters.dateRange!.to)
      if (filters.search !== undefined && filters.search.length > 0) {
        const q = filters.search.toLowerCase()
        result = result.filter(e =>
          e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
        )
      }
    }

    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getExpense(id: string): Promise<Expense> {
    await delay(80)
    const expense = expenses.find(e => e.id === id)
    if (!expense) throw new Error(`Not found: ${id}`)
    return expense
  }

  async createExpense(data: CreateExpenseInput): Promise<Expense> {
    await delay(80)
    const expense: Expense = { ...data, id: crypto.randomUUID(), createdAt: new Date(), settledAt: null }
    expenses.push(expense)
    return expense
  }

  async updateExpense(id: string, data: UpdateExpenseInput): Promise<Expense> {
    await delay(80)
    const idx = expenses.findIndex(e => e.id === id)
    if (idx === -1) throw new Error(`Not found: ${id}`)
    expenses[idx] = { ...expenses[idx], ...data }
    return expenses[idx]
  }

  async deleteExpense(id: string): Promise<void> {
    await delay(80)
    const idx = expenses.findIndex(e => e.id === id)
    if (idx === -1) throw new Error(`Not found: ${id}`)
    expenses.splice(idx, 1)
  }

  async getSettlementPeriods(
    partnershipId: string,
    filters?: SettlementPeriodFilters,
  ): Promise<SettlementPeriod[]> {
    await delay(80)
    let result = settlementPeriods.filter(p => p.partnershipId === partnershipId)
    if (filters?.status !== undefined)
      result = result.filter(p => p.status === filters.status)
    return result.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
  }

  async getSettlementPeriod(id: string): Promise<SettlementPeriod> {
    await delay(80)
    const period = settlementPeriods.find(p => p.id === id)
    if (!period) throw new Error(`Not found: ${id}`)
    return period
  }

  async getActiveSettlementPeriod(partnershipId: string): Promise<SettlementPeriod | null> {
    await delay(80)
    return settlementPeriods.find(p => p.partnershipId === partnershipId && p.status === 'open') ?? null
  }

  async createSettlementPeriod(data: CreateSettlementPeriodInput): Promise<SettlementPeriod> {
    await delay(80)
    const period: SettlementPeriod = {
      ...data,
      id: crypto.randomUUID(),
      status: 'open',
      createdAt: new Date(),
    }
    settlementPeriods.push(period)
    return period
  }

  async updateSettlementPeriodStatus(id: string, status: SettlementStatus): Promise<SettlementPeriod> {
    await delay(80)
    const idx = settlementPeriods.findIndex(p => p.id === id)
    if (idx === -1) throw new Error(`Not found: ${id}`)
    settlementPeriods[idx] = { ...settlementPeriods[idx], status }
    return settlementPeriods[idx]
  }

  async getSettlements(partnershipId: string): Promise<Settlement[]> {
    await delay(80)
    return settlements
      .filter(s => s.partnershipId === partnershipId)
      .sort((a, b) => b.settledAt.getTime() - a.settledAt.getTime())
  }

  async getSettlement(id: string): Promise<Settlement> {
    await delay(80)
    const settlement = settlements.find(s => s.id === id)
    if (!settlement) throw new Error(`Not found: ${id}`)
    return settlement
  }

  async settlePeriod(data: SettlePeriodInput): Promise<Settlement> {
    await delay(80)
    const periodIdx = settlementPeriods.findIndex(p => p.id === data.periodId)
    if (periodIdx === -1) throw new Error(`Not found: ${data.periodId}`)
    if (settlementPeriods[periodIdx].status === 'settled')
      throw new Error(`Period ${data.periodId} is already settled`)

    const periodExpenses = expenses.filter(e => e.settlementPeriodId === data.periodId)
    const expenseIds = periodExpenses.map(e => e.id)

    // Mutate only after all preconditions pass to preserve atomicity
    const settledAt = new Date()
    for (const e of periodExpenses) {
      const eidx = expenses.findIndex(x => x.id === e.id)
      expenses[eidx] = { ...expenses[eidx], settledAt }
    }
    settlementPeriods[periodIdx] = { ...settlementPeriods[periodIdx], status: 'settled' }

    const settlement: Settlement = {
      id: crypto.randomUUID(),
      periodId: data.periodId,
      partnershipId: data.partnershipId,
      fromUserId: data.fromUserId,
      toUserId: data.toUserId,
      amount: data.amount,
      status: data.status,
      daysOverdue: data.daysOverdue,
      settledAt,
      partnerDisplayNameSnapshot: data.partnerDisplayNameSnapshot,
      expenseIds,
      notes: data.notes,
    }
    settlements.push(settlement)
    return settlement
  }
}

export const mockDb: IDatabase = new MockDatabase()

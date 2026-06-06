import type { User } from './user'
import type { UpdateUserInput } from './user'
import type { Partnership, PartnershipInvite, PartnershipInviteStatus, CreatePartnershipInviteInput, CreatePartnershipInput } from './partnership'
import type { Expense, ExpenseFilters, CreateExpenseInput, UpdateExpenseInput } from './expense'
import type {
  SettlementPeriod,
  SettlementPeriodStatus,
  Settlement,
  SettlementPeriodFilters,
  CreateSettlementPeriodInput,
  InitiateSettlementInput,
  RespondToSettlementInput,
} from './settlement'

// ── IDatabase ─────────────────────────────────────────────────────────────────

export interface IDatabase {

  // ── Users ────────────────────────────────────────────────────────────────

  getUser(id: string): Promise<User>
  updateUser(id: string, data: UpdateUserInput): Promise<User>

  // ── Partnerships ─────────────────────────────────────────────────────────

  getPartnership(id: string): Promise<Partnership>
  createPartnership(data: CreatePartnershipInput): Promise<Partnership>
  dissolvePartnership(id: string): Promise<void>

  // ── Partnership Invites ───────────────────────────────────────────────────

  getPendingInviteForEmail(email: string): Promise<PartnershipInvite | null>
  getSentInviteByUser(fromUserId: string): Promise<PartnershipInvite | null>
  createInvite(data: CreatePartnershipInviteInput): Promise<PartnershipInvite>
  updateInviteStatus(
    id: string,
    status: PartnershipInviteStatus
  ): Promise<PartnershipInvite>

  // ── Expenses ─────────────────────────────────────────────────────────────

  getExpenses(partnershipId: string, filters?: ExpenseFilters): Promise<Expense[]>
  getExpense(id: string): Promise<Expense>
  createExpense(data: CreateExpenseInput): Promise<Expense>
  updateExpense(id: string, data: UpdateExpenseInput): Promise<Expense>
  deleteExpense(id: string): Promise<void>

  // ── Settlement Periods ────────────────────────────────────────────────────

  getSettlementPeriods(
    partnershipId: string,
    filters?: SettlementPeriodFilters
  ): Promise<SettlementPeriod[]>
  getSettlementPeriod(id: string): Promise<SettlementPeriod>
  // Returns null when no period is currently open
  getActiveSettlementPeriod(partnershipId: string): Promise<SettlementPeriod | null>
  createSettlementPeriod(data: CreateSettlementPeriodInput): Promise<SettlementPeriod>
  // Used by the background period-rollover process (open → outstanding)
  updateSettlementPeriodStatus(
    id: string,
    status: SettlementPeriodStatus
  ): Promise<SettlementPeriod>

  // ── Settlements ───────────────────────────────────────────────────────────

  getSettlements(partnershipId: string): Promise<Settlement[]>
  getSettlement(id: string): Promise<Settlement>
  // Returns confirmed settlements for a specific period (used for running net calculation)
  getConfirmedSettlements(partnershipId: string, periodId: string): Promise<Settlement[]>
  // Returns the single pending settlement for a period, or null if none
  getPendingSettlement(partnershipId: string, periodId: string): Promise<Settlement | null>
  // Creates a pending settlement — other partner must confirm before it counts
  initiateSettlement(data: InitiateSettlementInput): Promise<Settlement>
  // Confirms or rejects a pending settlement
  respondToSettlement(data: RespondToSettlementInput): Promise<Settlement>
}

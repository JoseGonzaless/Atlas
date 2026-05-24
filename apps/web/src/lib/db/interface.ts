import type { User } from './user'
import type { UpdateUserInput } from './user'
import type { Partnership, PartnershipInvite, PartnershipInviteStatus, CreatePartnershipInviteInput } from './partnership'
import type { CreatePartnershipInput, UpdatePartnershipInput } from './partnership'
import type { Expense, ExpenseFilters, CreateExpenseInput, UpdateExpenseInput } from './expense'
import type { SettlementPeriod, Settlement, SettlementStatus, CreateSettlementPeriodInput } from './settlement'
import type { SettlementPeriodFilters, SettlePeriodInput } from './settlement'

// ── IDatabase ─────────────────────────────────────────────────────────────────

export interface IDatabase {

  // ── Users ────────────────────────────────────────────────────────────────

  getUser(id: string): Promise<User>
  updateUser(id: string, data: UpdateUserInput): Promise<User>

  // ── Partnerships ─────────────────────────────────────────────────────────

  getPartnership(id: string): Promise<Partnership>
  createPartnership(data: CreatePartnershipInput): Promise<Partnership>
  updatePartnership(id: string, data: UpdatePartnershipInput): Promise<Partnership>
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
  // Returns null when no period is currently open (e.g. partnership just created)
  getActiveSettlementPeriod(partnershipId: string): Promise<SettlementPeriod | null>
  createSettlementPeriod(data: CreateSettlementPeriodInput): Promise<SettlementPeriod>
  // Used by the background period-rollover process (open → outstanding)
  updateSettlementPeriodStatus(
    id: string,
    status: SettlementStatus
  ): Promise<SettlementPeriod>

  // ── Settlements ───────────────────────────────────────────────────────────

  getSettlements(partnershipId: string): Promise<Settlement[]>
  getSettlement(id: string): Promise<Settlement>
  // Atomic: creates the Settlement record, stamps settledAt on all included
  // Expenses, and transitions the SettlementPeriod to 'settled' in one operation.
  // If any step fails, no changes are persisted (SRD §12c).
  settlePeriod(data: SettlePeriodInput): Promise<Settlement>
}

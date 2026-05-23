# **Atlas - Software Requirements**

Atlas is a two-person expense-splitting and personal budgeting product for partners who share some expenses and keep others personal. Through a **Telegram bot** for fast in-the-moment logging and a **web app** for review, settlement, and history, Atlas replaces the manual spreadsheet-and-chat workflow with automatic 50/50 calculation, a temporary **Shared Ledger** for the current settlement period, and a permanent **Personal Ledger** for each person's actual spending history. MVP scope is limited to two linked accounts splitting 50/50; multi-party splits, banking integrations, and recurring expenses are out of scope.

---

## **1. User & Account Model**

Atlas uses a single user type. Each user owns one account and may **link** to exactly one other Atlas account to form a 2-person partnership. Both linked users have identical capabilities within the partnership — there are no admin/member distinctions and no permission tiers. The product does not define additional roles.

* **Linked partner relationship**
  * A user may be linked to **at most one** other user at a time.
  * Both linked users have equal permission to:
    * Log Shared expenses on behalf of the partnership.
    * View the partnership's Shared Ledger and Settlement history.
    * Initiate a Settlement.
    * Configure the partnership's Settlement Frequency.
  * Neither linked user may:
    * View the other's Personal Ledger.
    * View the other's Personal expenses.
    * Modify or delete the other's logged expenses (Shared or Personal).
    * Unilaterally remove the other's account.
  * Either user may **unlink** the partnership; unlink requires confirmation from the initiating user and notification of the other (see § Settings — Partner Link).

* **Scope at MVP**
  * Exactly 2 users per partnership. Splitting more than 2 ways is out of scope.
  * Splits are always 50/50. Custom split ratios are out of scope.

---

## **2. Authentication & Onboarding**

### **2a. Sign Up**

* **Entry point**: `/signup`, or the "Sign up" link on the Login page.
* **Required fields**
  * **Display Name** — text, required, 1–50 characters, trimmed.
    * Used as the name shown to your partner in the Shared Ledger and Settlement views.
  * **Email** — required, must be a valid email format, unique across Atlas accounts (case-insensitive).
  * **Password** — required, minimum 8 characters, at least one uppercase letter, at least one lowercase letter, at least one number. Validation rules are reused for any future password change (see § Settings — Change Password).
* **Submission behavior**
  * If validation fails: inline errors per field, form does not submit, "Sign Up" button remains enabled so the user can retry after correction.
  * If validation succeeds: account is created, a session is established, the user is redirected to **Onboarding — Step 1: Link Telegram & Partner**.
* **Error states**
  * If the email is already registered: inline error "An account with this email already exists."
  * Network failure: Display: "We couldn't reach Atlas. Check your connection and try again."
  * Server error: Display: "Something went wrong on our end. Please try again."
* **Below the form**: "Already have an account? Log in." — link to `/login`.

### **2b. Login**

* **Entry point**: `/login`, the default route for unauthenticated visitors. All other routes redirect here when the session is missing or expired.
* **Required fields**
  * **Email** — required, must be a valid email format.
  * **Password** — required.
* **Features**
  * **Password visibility toggle** — icon inside the password field shows/hides the entered characters.
* **Submission behavior**
  * If validation fails (empty or malformed fields): inline errors per field, form does not submit.
  * If credentials are incorrect: Display: "Invalid email or password." Shown once, generically — does not reveal whether the email or password was wrong.
  * If validation succeeds: session is created, user is redirected to the **Dashboard**. If the user has not completed Onboarding, the user is redirected to the next incomplete Onboarding step.
* **Error states**
  * Network failure: Display: "We couldn't reach Atlas. Check your connection and try again."
  * Server error: Display: "Something went wrong on our end. Please try again."
* **Below the form**: "Don't have an account? Sign up." — link to `/signup`.

### **2c. Session Management**

* Sessions are created on successful Sign Up or Login.
* Sessions persist across browser refresh.
* When a session is invalid or expired, any attempt to access a protected route redirects to `/login` and shows: "Your session has expired. Please log in again."
* **Logout** is initiated from the Settings page (see § Settings) and uses a confirmation dialog:
  * Title: "Log out?"
  * Body: "You'll need to log in again to view your ledgers."
  * Actions: "Cancel" / "Log Out".
  * On confirm: session is invalidated and the user is redirected to `/login`.

### **2d. Onboarding**

Onboarding is a multi-step wizard shown immediately after Sign Up. Each step displays a progress indicator and a **Back** button (except Step 1). The user cannot skip ahead — each step's "Continue" button is enabled only when its required inputs are valid.

#### **Step 1 — Connect Telegram (Optional)**

* **Purpose**: Link the user's Telegram account to enable bot-based logging. Optional at onboarding; can be completed later from § Settings — Telegram.
* **Content**:
  * Instructions: Display: "Open Telegram, search for the Atlas bot, and send the command shown below to link your account."
  * **Pairing code** — a short, single-use, time-limited code (e.g. 6 alphanumeric characters) displayed prominently. The user sends the code to the bot to complete pairing.
  * **Refresh code** button — generates a new code if the current code expires.
  * Status indicator updates in real time:
    * Before pairing: "Waiting for Telegram…"
    * After pairing: "Connected as @{telegram_handle}."
* **Buttons**: "Skip for now" / "Continue".
* **If skipped**: The Telegram bot section in § Settings shows the same flow when the user is ready.

#### **Step 2 — Link Your Partner (Optional)**

* **Purpose**: Establish the 2-account partnership.
* **Two paths**:
  * **Send an invite**:
    * Input: Partner's email — required, valid email format.
    * Button: "Send invite".
    * On submit: Atlas sends an in-product invite (visible to the recipient when they sign in / sign up using that email). Display: "Invite sent to {email}. They'll see it when they log in."
  * **Accept an invite**:
    * If the signed-in user has a pending invite from another account, that invite is shown here with the inviter's Display Name and email.
    * Button: "Accept link".
    * On accept: the two accounts become linked; the inviter is notified in-app on their next view of the Dashboard.
  * **Link via Telegram command**: Display the bot command `link me to <partner_handle>`; the partner confirms in their own Telegram chat with the bot. Either side may initiate; both sides must confirm.
* **Constraints**
  * A user with an active link cannot send or accept additional invites until they unlink (see § Settings — Partner Link).
  * Invites expire after 7 days; an expired invite is hidden and the inviter must resend.
* **Buttons**: "Skip for now" / "Continue".

#### **Step 3 — Choose Settlement Frequency**

* **Purpose**: Set the cadence at which the Shared Ledger settles by default.
* **Options** (single-select):
  * **Weekly** — period begins on the user's selected day-of-week (default: Monday); settles at end of period.
  * **Monthly** — period begins on the 1st; settles at end of month.
  * **Custom** — user specifies start date and period length in days (1–365).
* **Constraint**: Settlement frequency must be agreed between linked partners. If a partner is linked, both partners' onboarding flows show the same frequency; either may change it later via § Settings — Settlement Frequency, which prompts the partner for confirmation.
* **Buttons**: "Back" / "Continue".

#### **Step 4 — Import Past Expenses (Optional)**

* **Purpose**: Allow the user to seed their Personal Ledger from an existing spreadsheet.
* **Content**:
  * Brief explanation of the CSV import flow (full flow defined in § CSV Import).
  * Button: "Upload CSV" — opens the CSV Import flow inline.
  * Button: "Skip for now".
* **If skipped**: The user can run CSV Import any time from § Personal Ledger.

#### **Step 5 — Review**

* Displays a summary of the user's selections:
  * Display Name and email.
  * Telegram link status.
  * Partner link status (or "Not linked").
  * Settlement Frequency.
  * Number of historical expenses imported (or "None imported").
* Button: "Finish setup".
* On confirm: the user is redirected to the **Dashboard**.

---

## **3. Navigation**

* **Pattern**: A persistent **left sidebar** on the web app. The web app is responsive and is the only client (no native mobile app at MVP). On narrow viewports, the sidebar collapses behind a hamburger toggle.
* **Current page**: The sidebar always highlights the user's current page. When on a subpage (e.g. a Settlement Receipt), the sidebar highlight stays on the parent main page (e.g. **Settlements**) and a **breadcrumb** is shown above the page content.
* **Main nav items** (top-level pages only):
  * **Dashboard** (`/`)
  * **Shared Ledger** (`/shared`)
  * **Personal Ledger** (`/personal`)
  * **Settlements** (`/settlements`)
  * **Settings** (`/settings`)
* **Excluded from nav** (entered via in-page actions, not the sidebar):
  * Add Expense modal.
  * Settle Now / Settle Period confirmation.
  * CSV Import flow.
  * Settlement Receipt detail.
  * Onboarding (only shown to incomplete accounts).
* **Return-navigation state**: When the user navigates from a list page (Personal Ledger, Settlements) into a detail view and back, the list restores its prior filters, search query, sort order, pagination position, and scroll position.

---

## **4. Dashboard**

The Dashboard is the post-login landing page. It provides an at-a-glance view of the current Settlement Period, the running Shared Ledger balance, any Outstanding settlements, and the most recent Personal Ledger activity.

* **Entry points**: Default route after login; sidebar **Dashboard** item.
* **Scope**: Always operates within the signed-in user's account and (if linked) their partnership.
* **Layout** (top to bottom):
  1. **Current Period banner**
  2. **Balance card** (who owes whom)
  3. **Outstanding Settlements list** (only when present)
  4. **Recent Shared Expenses** (current period)
  5. **Recent Personal Expenses**
  6. **Quick actions**

### **4a. Current Period Banner**

* Displays the current Settlement Period dates and time remaining.
* Format: Display: "{Period Label} • {start_date} – {end_date} • {time_remaining} until settlement."
  * Example: "Week of May 18 – May 24 • 2 days, 4 hours until settlement."
* If the user is unlinked: Display: "You're not linked to a partner yet. Link a partner to start tracking shared expenses." with a "Link partner" button that opens the Settings — Partner Link section.

### **4b. Balance Card**

* Displays the running balance for the current Shared Ledger period.
* **Data sources**:
  * "You paid" = sum of Shared expenses where the signed-in user is recorded as payer, current period only.
  * "Partner paid" = sum of Shared expenses where the partner is recorded as payer, current period only.
  * "Your share" = (You paid + Partner paid) ÷ 2.
  * "Balance" = Your share − You paid. Positive means the signed-in user owes the partner; negative means the partner owes the signed-in user.
* **Displayed values**:
  * "You paid: ${X}"
  * "{Partner display name} paid: ${Y}"
  * "Your share: ${Z}"
  * **Outcome line** (deterministic):
    * If Balance > 0: "You owe {Partner display name} ${|balance|}."
    * If Balance < 0: "{Partner display name} owes you ${|balance|}."
    * If Balance = 0 and total > 0: "You're even."
    * If total = 0: "No shared expenses yet this period."
* All amounts shown in the user's display currency with comma thousands separators (e.g. "$1,234.50"). See § Inputs & Forms — Number Fields.

### **4c. Outstanding Settlements**

* Lists all past periods that ended without a Settlement.
* Each row displays: period label, period end date, balance and direction (who owes whom), "Days overdue".
* Each row is clickable and navigates to that period's **Settlement Receipt** (in preview state).
* Inline action: **Settle now** — opens the Settle confirmation flow scoped to that overdue period (see § Settlements — Settle Outstanding).
* If none: section is hidden.

### **4d. Recent Shared Expenses**

* Lists the 5 most recent Shared expenses in the current period, newest first.
* Each row shows: amount, category, description, payer display name, source (Telegram or Web), and logged date/time.
* **"View all"** link navigates to § Shared Ledger.
* If linked partner has not yet logged any Shared expenses this period and the signed-in user has: shows the user's expenses normally.
* If no Shared expenses this period: Display: "No shared expenses logged yet this period."

### **4e. Recent Personal Expenses**

* Lists the 5 most recent Personal Ledger items, newest first. Items are those that have already been written to the Personal Ledger — either Personal expenses (logged immediately) or settled Shared expenses (at split cost).
* Each row shows: amount, category, description, original logged date, and a tag indicating origin: "Personal" or "Settled — Shared ({period label})".
* **"View all"** link navigates to § Personal Ledger.
* If none: Display: "No personal spending yet."

### **4f. Quick Actions**

* Buttons:
  * **Add expense** — opens the Add Expense modal (see § Add Expense).
  * **Settle now** — visible only when the current Shared Ledger has at least one expense; opens the Settle Now confirmation (see § Settlements — Settle Now).
  * **Open CSV import** — opens the CSV Import flow (see § CSV Import).

### **4g. Dashboard States**

* **Loading**: Skeleton placeholders for each card. Dependent actions ("Settle now", "View all") are disabled until data is ready. No partial values are shown.
* **Empty (new account, no expenses, not linked)**: Banner prompts to link partner; Balance card shows "No shared expenses yet this period."; Outstanding section hidden; Recent sections show their empty-state copy.
* **Error**: If any section's data fails to load, that section shows: Display: "We couldn't load this section. Try again." with a **Retry** button. Other sections continue to render independently.
* **Data not yet available** (linked but partner has not logged anything): the Balance card and Recent Shared Expenses still render with the signed-in user's data only; no error is shown.

---

## **5. Shared Ledger**

The **Shared Ledger** is a temporary, period-scoped record of expenses both partners have agreed to split. It exists only for the current Settlement Period; on settlement, its contents are moved to each partner's Personal Ledger at split cost and the Shared Ledger is reset for the next period. Both linked users see the same Shared Ledger contents at all times.

* **Entry points**: Sidebar **Shared Ledger** item; "View all" link on the Dashboard.
* **Scope**: The signed-in user's partnership. If the user is not linked, the page displays: Display: "You're not linked to a partner yet. Link a partner to start a Shared Ledger." with a button to § Settings — Partner Link, and no table is shown.

### **5a. Layout**

1. **Period header**: Current Period label, dates, time remaining until settlement, and **Settle now** button (see § Settlements — Settle Now). If at least one Outstanding period exists, a banner above the header links to those overdue items.
2. **Totals strip**: "You paid", "{Partner display name} paid", "Total", "Your share", and the outcome line — identical content and data sources to § Dashboard — Balance Card, scoped to the current period.
3. **Filters & search bar** (see § 5b).
4. **Expense table** (see § 5c).
5. **Pagination** at table footer (see § Tables, Lists & Results).

### **5b. Filters & Search**

* **Filter chips** appear above the table for any active filters; clicking a chip's "×" removes that filter.
* **Controls** (shadcn comboboxes; long lists are searchable):
  * **Category** — multi-select; populated from the union of suggested categories and any custom categories used in this partnership.
  * **Payer** — single-select: "You", "{Partner display name}", or "Anyone".
  * **Source** — single-select: "Telegram", "Web", or "Any".
  * **Date range** — within the current period only (period start to period end). Dates outside this range are not selectable.
* **Search** — free-text; matches against the description and category fields, case-insensitive, trimmed.

### **5c. Expense Table**

* **Columns** (sortable columns have inline sort arrows in the header; default sort is **Logged date** descending, newest first):
  * **Logged date** — sortable.
  * **Amount** — sortable; formatted with comma thousands separators and 2 decimal places.
  * **Category** — sortable alphabetically.
  * **Description** — non-sortable; truncated with hover tooltip if longer than the column width.
  * **Payer** — sortable; values: "You" or "{Partner display name}".
  * **Source** — non-sortable; "Telegram" or "Web".
  * **Actions** — see § 5d.
* **Row interaction**: Clicking a row opens the **Expense Detail modal** (see § 5e). The Actions column buttons do not propagate the row click.
* **New items appear at the top** of the table immediately after logging (Telegram or Web).

### **5d. Row Actions**

For each expense the **signed-in user logged**, the Actions column shows **Edit** and **Delete**. For expenses logged by the **partner**, the Actions column shows only **View** (opens the Expense Detail modal in read-only mode); Edit and Delete are not available.

* **Edit** — opens the Add Expense modal pre-filled with the row's values; on save, the row updates in place. Validation per § Inputs & Forms.
* **Delete** — opens a confirmation alert (see § Destructive Actions):
  * Title: "Delete this expense?"
  * Body: "This will remove the expense from the Shared Ledger and update the current balance. This action cannot be undone."
  * Actions: "Cancel" / "Delete".
  * On confirm: row is removed; totals strip recalculates; if the partner is online, their view updates on next refresh.

### **5e. Expense Detail Modal**

* Read-only summary of the expense: amount, category, description, payer, logged date/time, source.
* For expenses the signed-in user logged: "Edit" and "Delete" buttons are present and behave as in § 5d.
* For expenses the partner logged: only a "Close" button is present.

### **5f. States**

* **Loading**: Table skeleton; totals strip shows placeholders; Settle now is disabled.
* **Empty (no expenses this period)**: Table area shows Display: "No shared expenses logged yet this period." with an **Add expense** button.
* **Filtered empty**: When filters or search are applied and nothing matches: Display: "No expenses match your filters." with a **Clear filters** button. Distinct from the empty state.
* **Error**: Display: "We couldn't load the Shared Ledger. Try again." with a **Retry** button.
* **Data not yet available**: Not applicable; the Shared Ledger has no upstream-dependency case.

### **5g. Constraints**

* The Shared Ledger only ever contains expenses for the **current** Settlement Period. Past period contents are accessed via § Settlements (receipts).
* The Shared Ledger cannot be viewed cross-period (e.g. there is no view that shows multiple periods together). Outstanding periods are managed via § Settlements.

---

## **6. Personal Ledger**

The **Personal Ledger** is the signed-in user's permanent record of their own spending. It contains Personal expenses (logged immediately) and the user's split share of settled Shared expenses (written on settlement at split cost). The Personal Ledger is private — the partner cannot view it.

* **Entry points**: Sidebar **Personal Ledger** item; "View all" link on the Dashboard.
* **Scope**: The signed-in user only.

### **6a. Layout**

1. **Summary strip**: Totals for the currently active filters (see § 6c).
2. **Action bar**: **Add expense** button and **Import CSV** button.
3. **Filters & search bar** (see § 6b).
4. **Expense table** (see § 6c).
5. **Pagination** at table footer (see § Tables, Lists & Results).

### **6b. Filters & Search**

* **Filter chips** for active filters.
* **Controls** (shadcn comboboxes; long lists are searchable):
  * **Category** — multi-select.
  * **Type** — single-select: "Personal", "Settled — Shared", or "All".
  * **Settlement period** — multi-select; populated from the user's history; only available when **Type** includes "Settled — Shared".
  * **Date range** — start and end dates inclusive. Defaults to "All time".
* **Search** — free-text; matches description and category, case-insensitive, trimmed.

### **6c. Expense Table**

* **Columns**:
  * **Logged date** — sortable; for Settled — Shared items, this is the **original date the expense was logged**, not the settlement date.
  * **Amount** — sortable; for Settled — Shared items this is the user's **split cost** (half the original amount).
  * **Category** — sortable.
  * **Description** — non-sortable; truncated with hover tooltip.
  * **Type** — non-sortable; "Personal" or "Settled — Shared ({period label})".
  * **Actions** — see § 6d.
* **Default sort**: Logged date descending.
* **Summary strip totals**:
  * "Total spent" = sum of **Amount** column across all rows currently matching the active filters.
  * "Personal" = sum of Amount for rows where Type = "Personal" within the filtered set.
  * "Settled — Shared (your share)" = sum of Amount for rows where Type = "Settled — Shared" within the filtered set.

### **6d. Row Actions**

* **Personal** rows: Actions column shows **Edit** and **Delete**.
  * **Edit** opens the Add Expense modal pre-filled; on save the row updates in place.
  * **Delete** opens a confirmation alert:
    * Title: "Delete this expense?"
    * Body: "This will remove the expense from your Personal Ledger. This action cannot be undone."
    * Actions: "Cancel" / "Delete".
* **Settled — Shared** rows: Actions column shows **View** only.
  * Clicking View opens a read-only detail panel showing: original amount, your split cost, category, description, original logged date, original payer, and a link "View Settlement Receipt" that navigates to the relevant Settlement Receipt subpage (see § Settlements — Receipt).
  * Settled — Shared rows **cannot be edited or deleted** from the Personal Ledger; corrections are made by editing the originating Shared expense **before** that period is settled. Once settled, the historical record is preserved.

### **6e. States**

* **Loading**: Table skeleton; summary strip shows placeholders; Add expense and Import CSV are disabled.
* **Empty (no entries)**: Display: "No personal spending yet. Log expenses via Telegram or the web app." with **Add expense** and **Import CSV** buttons.
* **Filtered empty**: Display: "No expenses match your filters." with **Clear filters** button.
* **Error**: Display: "We couldn't load your Personal Ledger. Try again." with **Retry**.

---

## **7. Add Expense (Modal)**

Creation of an expense from the web app uses a modal (per § Destructive, Creation & Unsaved-Changes Actions). The same modal is used for new expenses and for editing existing ones; the title and submit-button label change accordingly.

* **Entry points**:
  * **Add expense** button on Dashboard, Shared Ledger, Personal Ledger, and Settings (if surfaced there).
  * **Edit** action on any expense row the user owns (Shared Ledger or Personal Ledger).
* **Modal title**:
  * For new: "Add expense".
  * For edit: "Edit expense".

### **7a. Fields**

* **Amount** — number input, required.
  * No spinner arrows.
  * Comma thousands separator applied as the user types (e.g. "1500" → "1,500").
  * Up to 2 decimal places.
  * Must be greater than 0.
  * Validation error if empty or ≤ 0: Display: "Enter an amount greater than 0."
* **Category** — combobox, required.
  * Suggested categories: "Food", "Grocery", "Shopping", "Subscriptions", "Entertainment", "Investments", "Other". *(See § Global States — Inputs Conflict for note on category list variance in the inputs.)*
  * Users can type to filter suggestions and may save a **custom category** by selecting "Create '{value}'". Custom categories appear as suggestions in subsequent uses by either partner (for Shared) or only the user (for Personal).
  * Validation error if empty: Display: "Choose or create a category."
* **Type** — segmented control, required: "Shared" or "Personal".
  * Default: "Shared".
  * When editing an existing expense, Type **cannot be changed** (Shared cannot be converted to Personal mid-period and vice versa). The control is disabled with a hint: Display: "Type can't be changed after logging."
* **Who paid** — segmented control, visible only when Type = "Shared", required: "You" or "{Partner display name}".
  * Default: "You".
  * Disabled if the user is unlinked (Type = "Shared" is itself unavailable when unlinked; see § 7c).
* **Description** — text input, optional, up to 200 characters, trimmed.
* **Date / time** — date-time picker, optional, defaults to "Now".
  * For new Shared expenses, the date must fall within the current Settlement Period. If a date outside the current period is selected: Display: "Shared expenses must be dated within the current period."
  * For Personal expenses, any past date is allowed; future dates are not allowed. If future: Display: "Date can't be in the future."
* **Notes** — multiline text, optional, up to 500 characters.

### **7b. Buttons**

* **Cancel** — closes the modal. If any field has been modified, the **unsaved-changes prompt** is shown (per § Destructive, Creation & Unsaved-Changes Actions): Display: "Discard this expense?" with "Keep editing" / "Discard".
* **Save** — submit; label changes to "Save changes" in edit mode.
  * Disabled while validation errors are present.
  * On click: validates all fields per § Inputs & Forms.

### **7c. Submission Behavior**

* If validation fails: inline errors per field; the modal stays open; the form does not submit.
* If validation succeeds:
  * **Shared expense** — the row is appended to the Shared Ledger; the Dashboard Balance card recalculates; the modal closes; the new row appears at the top of the Shared Ledger table.
  * **Personal expense** — the row is appended to the user's Personal Ledger immediately; the modal closes; the new row appears at the top of the Personal Ledger table.
* On network failure: Display: "We couldn't save this expense. Try again." Modal remains open with all entered values preserved; **Save** becomes available again.
* On server error: same message as above.

### **7d. Constraints**

* If the user is **not linked** to a partner: the Type field is locked to "Personal" and a helper line reads: Display: "Link a partner to log shared expenses."
* Editing an existing expense logged by the partner is not permitted — the Add Expense modal does not open in edit mode for partner-owned rows (the Actions column shows only View; see § Shared Ledger).

---

## **8. Telegram Bot**

The Telegram bot is a logging channel that writes to the same underlying data as the web app. The bot is not a separate ledger — every expense logged via Telegram appears in the same Shared Ledger or Personal Ledger as expenses logged via the web app.

* **Entry points**: User chats with the Atlas bot directly in Telegram after pairing via § Onboarding — Connect Telegram or § Settings — Telegram.
* **Scope**: Only a paired Telegram account can log expenses; the bot ignores messages from unpaired chats and responds with: Display: "This account isn't linked to Atlas. Visit your Atlas Settings to pair." (with the web app URL).

### **8a. Logging Commands**

* `we spent $<amount> <description>` — logs a **Shared** expense to the current Settlement Period.
* `me spent $<amount> <description>` — logs a **Personal** expense immediately to the user's Personal Ledger.
* `spent $<amount> <description>` — defaults to **Shared**.

### **8b. Parsing Rules**

* Amount may be written as `$50`, `50`, `50.25`, `1,500`, or `1500.50`. Currency symbol is optional.
* Description is the remainder of the message after the amount.
* Category is **not** specified in the chat command at MVP; the bot assigns the default category **"Other"**, and the user may edit the row from the web app to change the category and add notes.
* Date is the time the message was received.

### **8c. Confirmation Messages**

* On successful Shared expense: Display: "Logged: ${amount} on {description} (SHARED) — current balance: {balance line per § Dashboard — Balance Card}."
* On successful Personal expense: Display: "Logged: ${amount} on {description} (PERSONAL)."
* On default-Shared (`spent …`): same as Shared confirmation, with an extra line: Display: "Assumed SHARED. Reply 'undo' within 60 seconds to remove."
* **Undo** — replying "undo" within 60 seconds of the most recent logging confirmation removes that expense. The bot replies: Display: "Removed your last logged expense." After 60 seconds, "undo" replies: Display: "Nothing recent to undo. You can edit or delete from the web app."

### **8d. Parsing Errors**

* If the amount cannot be parsed: Display: "I couldn't read an amount. Try 'we spent $50 groceries'."
* If the message has no description: Display: "Add a short description, e.g. 'we spent $50 groceries'."
* If the user is unlinked and uses `we spent …` or `spent …` (which defaults to Shared): Display: "You're not linked to a partner yet. I logged this as PERSONAL instead." The expense is logged as Personal and confirmed accordingly.

### **8e. Partner-Linking Command**

* `link me to <partner_handle>` — sends a partnership invite via Telegram.
* The partner replies in their own bot chat with: `accept link from <your_handle>` to confirm.
* On confirmation: both users receive: Display: "You're now linked with {partner display name}. Shared expenses will count for both of you."
* See also web-based invite flow in § Onboarding — Step 2 and § Settings — Partner Link.

### **8f. Bot Availability & Errors**

* If the bot or backend is unreachable from Telegram: Display: "Atlas is having trouble right now. Your message wasn't logged. Try again in a moment." The user may resend the same message; expenses are not silently retried by the system.
* See § Global — Network and Sync for the system-wide guarantees.

### **8g. Constraints**

* The bot can log expenses but does not perform Settlement. Settlement is initiated from the web app (see § Settlements).
* The bot does not display the Shared or Personal Ledger contents (browsing happens in the web app).

---

## **9. Settlements**

A **Settlement** closes a Settlement Period, moves all Shared expenses from that period into both partners' Personal Ledgers at split cost, and creates an immutable **Settlement Receipt**. Settlements may occur on-time (at the period deadline), early (at any time before the deadline), or late (after the deadline; the unsettled period is marked **Outstanding** in the meantime).

* **Entry points**: Sidebar **Settlements** item; **Settle now** buttons on Dashboard and Shared Ledger; **Settle now** inline action on an Outstanding row.
* **Scope**: The signed-in user's partnership. If unlinked, the page displays the same unlinked message as § Shared Ledger.

### **9a. Layout**

1. **Status header**: "Current period: {period label}, ends {end_date}. {Outstanding count} outstanding."
2. **Outstanding section** (only when at least one period is Outstanding):
   * Table of overdue periods with columns: Period label, End date, Days overdue, Balance, Direction (who owes whom), Actions.
   * Action: **Settle now** per row.
3. **Past Settlements section**:
   * Table of completed Settlement Receipts with columns: Period label, Settlement date, Status ("On-time", "Early", "Settled Late"), Total shared, Your share, Amount owed, Actions.
   * Action: **View receipt** per row (navigates to § 9d Receipt subpage).
4. **Pagination** at table footer (see § Tables, Lists & Results).

### **9b. Settle Now (Current Period)**

* Triggered from any **Settle now** button on the current period.
* Opens a confirmation modal:
  * Title: "Settle {period label}?"
  * Body: Display: "This will move all {N} shared expenses from this period into each partner's personal ledger at half cost. Once settled, the period's shared ledger can't be edited."
  * **Summary block** inside the modal:
    * "You paid: ${X}"
    * "{Partner display name} paid: ${Y}"
    * "Total: ${X+Y}"
    * "Your share: ${(X+Y)/2}"
    * Outcome line per § Dashboard — Balance Card.
  * Actions: "Cancel" / "Settle".
* **If the Shared Ledger for the current period is empty**: the **Settle now** button is hidden; nothing to settle.
* On confirm:
  * A Settlement Receipt is created (see § 9d).
  * Each Shared expense is written to both partners' Personal Ledgers at split cost (half the original amount each), preserving the original logged date.
  * The Shared Ledger for the current period is reset to empty.
  * The Settlement is recorded with status:
    * **On-time** if the confirm timestamp falls within the period's last day.
    * **Early** if before the last day.
  * The user is redirected to the Settlement Receipt subpage.
* On network/server failure: Display: "We couldn't complete the settlement. No changes were made. Try again." (See § Global — Network and Sync; settlements are atomic — either all expenses move and the receipt is created, or nothing changes.)

### **9c. Settle Outstanding (Past Period)**

* Triggered from the **Settle now** action on an Outstanding row, or from the Dashboard Outstanding list.
* Opens a confirmation modal:
  * Title: "Settle {period label}? (overdue by {days} days)"
  * Body: Display: "This will move all {N} shared expenses from this period into each partner's personal ledger at half cost. The receipt will be marked 'Settled Late'."
  * Same summary block as § 9b.
  * Actions: "Cancel" / "Settle late".
* On confirm:
  * A Settlement Receipt is created with status **Settled Late**, recording: settlement date, original period end date, and days overdue.
  * Same data movement as § 9b.
  * The Outstanding row is removed from the Outstanding section and the receipt is added to Past Settlements.

### **9d. Settlement Receipt (Subpage)**

* **URL**: `/settlements/{receipt_id}`.
* **Entry points**: Row click in Past Settlements; "View Settlement Receipt" link from a Settled — Shared row in Personal Ledger; redirect after a successful settle action.
* **Breadcrumb**: "Settlements › {period label} ({status})".
* **Content** (read-only, immutable):
  * Period label and dates.
  * Settlement date and time.
  * Status: "On-time", "Early", or "Settled Late". If Settled Late, also: "Original period end: {date}. Days overdue: {N}."
  * **Summary**: "You paid", "{Partner display name} paid", "Total", "Your share", and the outcome line.
  * **Items table**: each Shared expense included in the settlement, with columns Logged date, Amount (original), Your split cost, Category, Description, Payer, Source.
* **Actions**:
  * **Export** — downloads the receipt as PDF. The PDF contains the same fields as the on-screen receipt. If export fails: Display: "We couldn't generate the PDF. Try again." Failure does not delete or modify the receipt. (See § Global — Long-Running Operations.)
  * No edit, delete, or re-settle actions are available — receipts are immutable.

### **9e. Lifecycle & Constraints**

* **Settlement Period statuses** (closed set):
  * **Open** — current period; Shared Ledger accepts new entries; Settle now is available when ≥ 1 expense exists.
  * **Outstanding** — period end date has passed without a Settlement; new Shared expenses logged after the end date roll into the **next** Open period.
  * **Settled** — a Settlement Receipt exists for this period; the period's Shared Ledger is permanently empty/locked.
* **Default status**: Each new Settlement Period begins in **Open**.
* **Allowed transitions**:
  * Open → Settled (via Settle now, on-time or early).
  * Open → Outstanding (automatic when the period end date passes with no Settlement).
  * Outstanding → Settled (via Settle Outstanding; status on the receipt is **Settled Late**).
* **Cannot be reversed**: Once a period is Settled, the Settlement Receipt is permanent. Atlas does not support un-settling. Corrections must be handled outside Atlas (e.g. by logging a compensating Shared expense in a future period).
* **Period boundaries**:
  * A new Open period begins automatically the day after the previous period ends, regardless of whether the previous period is Settled or Outstanding.
  * Expenses with `Logged date` falling inside a period belong to that period. The user cannot move expenses across periods.
* **Initiation**: Either partner may initiate a Settlement; no second-partner confirmation is required at MVP. The other partner is notified in-app on next view (see § Global — Data Integrity for the cross-view propagation guarantee).
* **What does not change on Settlement**:
  * Each expense's original `Logged date` is preserved on the Personal Ledger row.
  * Custom categories created during the period remain available going forward.
  * Display names remain the same on the receipt (the snapshot is implicit — the receipt records the partner's display name at time of settlement).

### **9f. States**

* **Loading**: Table skeletons; Settle now is disabled.
* **Empty (no past settlements)**: Past Settlements section shows Display: "No settlements yet." If Outstanding is also empty, the page primarily shows the Status header.
* **Filtered empty**: N/A at MVP — the Settlements page has no filters.
* **Error**: Display: "We couldn't load settlements. Try again." with **Retry**.

---

## **10. CSV Import**

CSV Import allows a user to seed historical expenses into their account in one operation. Imports run as a long-running operation with a clear progress indicator.

* **Entry points**:
  * **Import CSV** button on Personal Ledger.
  * Onboarding Step 4.
  * **Open CSV import** Quick Action on the Dashboard.
* **Scope**: The signed-in user only. Imported Personal expenses go to the user's Personal Ledger. Imported Shared expenses go directly to the **signed-in user's Personal Ledger at split cost** as historical entries (they are not retroactively run through Settlement, and they are not visible to the partner). *(See § Global — Inputs Conflict regarding the scoping of imported Shared expenses; the inputs describe import for both ledgers but do not specify the cross-account propagation mechanism; at MVP, imports are user-scoped only.)*

### **10a. Flow**

1. **Step 1 — Upload**
   * User selects a `.csv` file.
   * Max file size: 5 MB. Max rows: 5,000.
   * If file is too large or not a CSV: Display: "Choose a CSV file no larger than 5 MB." The flow does not advance.
2. **Step 2 — Map columns**
   * Atlas auto-detects column headers and pre-fills the mapping where possible.
   * Required mappings:
     * **Amount** → Atlas Amount.
     * **Category** → Atlas Category.
     * **Date** → Atlas Logged date.
   * Optional mappings:
     * **Description** → Atlas Description.
     * **Notes** → Atlas Notes.
     * **Type (Shared / Personal)** → Atlas Type. If not provided, the user selects a default in Step 3.
   * Validation:
     * Each Atlas field can be mapped from at most one CSV column.
     * If a required mapping is missing on **Continue**: inline error and the flow does not advance.
3. **Step 3 — Default type**
   * Shown only when the user did not map a Type column.
   * Options: "All Personal" / "All Shared".
   * Default: "All Personal".
4. **Step 4 — Preview**
   * Shows a table of the first 25 rows with their mapped values and a per-row validity indicator.
   * Per-row validation:
     * Amount must be a number > 0.
     * Date must be a parseable date and not in the future.
     * Category is auto-mapped to a suggested category if it matches (case-insensitive, trimmed), or kept as a custom category.
     * If Type = "Shared" but the user is unlinked: row is flagged as invalid with reason: Display: "Can't import as Shared — you're not linked to a partner."
   * Counts displayed: "{X} valid rows", "{Y} invalid rows", "{Z} total".
   * If Y > 0: button **Download invalid rows** allows the user to fix and re-upload only the invalid set.
   * Button **Back** returns to mapping; button **Import {X} valid rows** initiates the import.
5. **Step 5 — Importing**
   * Progress bar showing percent complete and rows processed (e.g. "Importing 1,200 of 4,800 rows…").
   * The user may navigate away; the import continues in the background. A status indicator is shown on the Dashboard until import completes.
   * On completion: Display: "Imported {X} rows. View them in your Personal Ledger." with a **View Personal Ledger** button.
6. **Step 6 — Failure / partial failure**
   * If the import fails partway through: Display: "We couldn't finish importing. {X} of {Y} rows were imported. Retry?" The already-imported rows are kept; remaining rows are not silently retried.

### **10b. Constraints**

* Imports are append-only — they do not modify or delete existing Personal Ledger entries.
* Imported entries are tagged "Imported" in the Personal Ledger's row source field (in addition to the Type tag).
* Imported entries cannot be sent to a Settlement (they are historical-only); the **Type can't be changed after logging** rule applies (see § 7a).

---

## **11. Settings**

The Settings page contains all account, partnership, and notification preferences. It is structured into the sections below in the order shown. Sidebar item: **Settings**.

### **11a. Profile**

* **Display Name** — editable text, validation per § 2a Sign Up.
* **Email** — read-only at MVP. *(Changing email is not in MVP scope per inputs.)*
* **Change password** — opens an inline form:
  * Fields: Current password, New password, Confirm new password.
  * **New password** uses the same validation rules as § 2a Sign Up.
  * **Confirm new password** must match New password.
  * On save: existing session remains valid; Display: "Password updated."
  * On incorrect current password: Display: "Current password is incorrect."

### **11b. Partner Link**

* **If unlinked**:
  * Shows the same partner-invite flow as § Onboarding — Step 2.
  * Displays any pending invites received from other accounts; user may **Accept** or **Decline** each.
* **If linked**:
  * Shows partner's Display Name and link date.
  * **Unlink** button opens a confirmation alert (per § Destructive Actions):
    * Title: "Unlink from {partner display name}?"
    * Body: Display: "Unlinking will stop all shared expense tracking. Any unsettled shared expenses will become Outstanding under both accounts. Already-settled history is preserved."
    * Actions: "Cancel" / "Unlink".
  * On confirm: link is removed for both accounts. Both users see a banner on next Dashboard view: Display: "Your partner link was removed."

### **11c. Settlement Frequency**

* **Frequency** — single-select: "Weekly", "Monthly", "Custom" — same options as § Onboarding — Step 3.
* For **Weekly**: select day-of-week the period starts.
* For **Monthly**: fixed to 1st of month.
* For **Custom**: numeric input for period length in days (1–365); start date input.
* **Save** behavior:
  * If unlinked: the change takes effect immediately at the next period boundary.
  * If linked: the change requires partner confirmation. On save: Display: "Sent {partner display name} a request to change settlement frequency to {new frequency}." The partner sees an in-app banner on their next Dashboard view; if they accept, the change takes effect at the next period boundary; if they decline, the existing frequency remains and the requester sees: Display: "{partner display name} declined the change."

### **11d. Telegram**

* Shows pairing status: "Connected as @{telegram_handle}" or "Not connected".
* **If connected**: **Disconnect** button. Confirmation alert: Display: "Disconnect Telegram? You won't be able to log expenses via the bot until you reconnect." On confirm: the bot stops accepting messages from this user and replies with the unpaired message (see § 8 Scope).
* **If not connected**: same pairing-code flow as § Onboarding — Step 1.

### **11e. Categories**

* Lists all categories the user has used (both suggested and custom).
* Each row shows the category name and the count of expenses (Personal + Settled — Shared) using it.
* For **custom** categories the user created: **Rename** and **Delete** actions.
  * **Rename** updates the label on every existing expense using it.
  * **Delete** confirmation: Display: "Delete category '{name}'? Expenses using this category will be reassigned to 'Other'." Actions: "Cancel" / "Delete".
* Suggested categories cannot be renamed or deleted.

### **11f. Logout**

* **Log Out** button.
* Confirmation dialog and behavior per § 2c Session Management.

### **11g. Constraints**

* The Settings page has no role-gated sections at MVP (single-role product). All sections are visible to every signed-in user.

---

## **12. Global States, Errors & Constraints**

### **12a. Loading & Errors**

* No page or section displays partial or stale data while loading. Skeletons or spinners are shown until data is ready; dependent actions (e.g. Settle now, Save) are disabled until the underlying data is loaded.
* All error messages shown to users are non-technical and human-readable; system-level details (stack traces, error codes) are never displayed.
* Where retry is possible, a **Retry** button is shown adjacent to the error message.
* No silent failures: every action either succeeds and updates the UI, or fails and shows an error. Actions never appear to succeed while the underlying data remains unchanged.

### **12b. Permission & Access**

* Unauthenticated users cannot reach any protected route — all such routes redirect to `/login`.
* A user can never access another account's Personal Ledger. Attempting to do so (e.g. by manipulating a URL to a receipt or expense the user is not party to) returns: Display: "You don't have access to this." with a button to return to the Dashboard. No resource data is shown.
* If a user's partner unlinks while the user has Shared Ledger or Settlements open, on the user's next page interaction the view re-renders into its unlinked state (see § Shared Ledger Scope) and a banner displays the unlink notice (see § 11b).

### **12c. Network and Sync**

* Logging an expense (Telegram or Web), settling a period, and importing CSV rows are **atomic** from the user's perspective: either the full action completes and is reflected in the UI, or no change is made and an error message is shown. Settlement specifically must be atomic — partial movement of expenses to one partner's Personal Ledger but not the other is not permitted.
* Telegram bot messages received while the backend is unreachable result in the user-visible error in § 8f. Atlas does not silently buffer or retry user messages; the user is told to retry.
* Cross-partner views (Shared Ledger, Dashboard Balance card, Settlement Receipt) reflect the same underlying records. Changes made by one partner appear in the other partner's view on next data fetch or page navigation. Both partners view the same authoritative state; there is no per-user fork of the Shared Ledger.

### **12d. Session**

* See § 2c. Sessions persist across browser refresh; expired sessions redirect to `/login` with the expiration message. Logging in on a new browser does not invalidate other sessions at MVP.

### **12e. Data Integrity**

* User content (expenses, settlements, categories, partnership) is never modified without an explicit user action. The only background processes Atlas runs are:
  * **Period rollover** — when a period's end date passes, the period transitions from **Open** to **Outstanding** if not yet settled. No expenses are moved; only the period status changes.
  * **CSV import** — runs in the background while showing a progress indicator (see § 10).
* Settlement Receipts are immutable. The Personal Ledger preserves the original `Logged date` of every entry — both immediate Personal entries and settled Shared entries.
* Expenses logged via Telegram and expenses logged via the web app share one underlying record per expense; editing or deleting via the web reflects in any future Telegram confirmations and balance reads.

### **12f. Inputs & Forms — Global Rules**

* Numeric inputs do not display spinner arrows.
* Amounts ≥ 1,000 are displayed with comma thousands separators (e.g. "$12,500.00") in inputs, table cells, and summary strips.
* All form fields validate per § Inputs & Forms.
* All destructive actions use a confirmation modal or alert per § Destructive, Creation & Unsaved-Changes Actions.
* All forms with editable state honor the unsaved-changes prompt when the user attempts to navigate away with pending changes (per § Destructive, Creation & Unsaved-Changes Actions).

### **12g. Product-Wide Constraints**

* **Two-person scope**: Exactly 2 linked users per partnership. Multi-party splits are out of scope.
* **Split ratio**: Fixed 50/50. Custom split ratios are out of scope.
* **Currency**: Single-currency at MVP — no multi-currency handling. The inputs do not specify a currency; the UI uses "$" as the display symbol consistently.
* **Out of scope (per inputs § 9 Scope Boundaries)**: banking integration, native mobile app, cryptocurrency or payment-method tracking, tax features, recurring expense automation.
* **No notifications at MVP**: The inputs do not specify in-app or email notifications. Atlas does not send notifications outside of in-app banners on next page view (e.g. "Your partner link was removed.", "Settlement complete.") and Telegram bot confirmations to the messaging user. The "Weekly automatic summaries" feature listed under Phase 2 in the inputs is **out of scope** at MVP.

### **12h. Flagged Conflicts in Inputs**

The following inconsistencies exist between sections of the input scoping document. They are flagged here rather than silently resolved:

* **Suggested category list varies** — Section 4 Feature 6 lists: "Food, Shopping, Subscriptions, Other, Investments, Grocery". Section 17 lists: "Food, Shopping, Subscriptions, Entertainment, Other, Investments, Grocery" (adds Entertainment). The SRD uses the union: "Food", "Grocery", "Shopping", "Subscriptions", "Entertainment", "Investments", "Other". Confirm intended list before implementation.
* **CSV import of Shared expenses** — Section 4 Feature 6 states that CSV import supports "shared vs personal" expenses; Section 5 states that Shared Ledger contents go to both partners' ledgers via Settlement, but the input does not specify whether historical Shared imports propagate to the partner. The SRD treats imports as user-scoped only (no cross-partner propagation) per § 10a Scope. Confirm intended behavior before implementation.
* **Settlement initiation authority** — Section 6 implies either partner may settle, but does not state whether the partner is notified or must confirm. The SRD treats Settlement as single-partner initiation with the other partner notified on next view (§ 9e). Confirm before implementation.
* **Telegram default-Shared with no link** — Section 16 defines `spent …` as defaulting to Shared, but the inputs do not address what happens when the user has no linked partner. The SRD logs such expenses as Personal with an explanatory bot message (§ 8d). Confirm before implementation.
* **Account names** — Section 5 Setup uses literal names "You" and "GF" for the two accounts; this is descriptive, not a system constraint. The SRD uses **Display Name** as a per-account user-provided value (§ 11a).

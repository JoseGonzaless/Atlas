# **Product Scoping Document**

## **Expense Splitter App**

**Document Purpose:** Define what the product does and what problems it solves, written for business decision-makers.

---

## **1\. Executive Summary**

### **The Problem**

You and your partner currently split shared expenses the hard way:

* Spend money throughout the week separately  
* Manually record totals in a Telegram chat  
* Manually enter each transaction into individual budget spreadsheets  
* Calculate who owes whom at the end of the week  
* This process is repetitive, error-prone, and takes time

### **The Solution**

An automated Expense Splitter app that:

* Makes logging expenses as easy as sending a text message  
* Automatically calculates who owes whom  
* Keeps a clean record of all shared expenses  
* Eliminates manual spreadsheet entry

### **The Outcome**

**Less friction, more transparency, and zero manual calculations.**

---

## **2\. Business Objectives**

### **Primary Goals**

1. **Reduce time spent on expense tracking** \- from 10-15 minutes per week down to essentially zero (logging happens in real-time)  
2. **Eliminate calculation errors** \- automated math, no manual mistakes  
3. **Create a single source of truth** \- one place to see all shared expenses and balances  
4. **Maintain budget visibility** \- both people can see spending patterns and stay on budget together

### **Success Metrics**

* ✅ All expenses logged within 1 hour of purchase (vs. end-of-week batch entry)  
* ✅ Weekly settlement calculated automatically in \<2 seconds  
* ✅ Zero manual spreadsheet updates needed  
* ✅ Both users can see real-time balance at any time

---

## **3\. User Personas**

### **User 1: You**

* **Need:** Quick, frictionless way to log expenses without breaking workflow  
* **Preference:** Mobile-first (text message style)  
* **Pain point:** Manual data entry into spreadsheets

### **User 2: Your GF**

* **Need:** Same as above  
* **Preference:** Can use app or messaging  
* **Pain point:** Waiting until end of week to see who owes whom

---

## **4\. Core Features (MVP \- Minimum Viable Product)**

### **Feature 1: Quick Expense Logging via Telegram Bot (Shared & Personal)**

**What it does:**

* Send a message in Telegram to log expenses instantly  
* Choose between shared (split with partner) or personal (just you)  
* Bot instantly confirms and routes to correct ledger

**Telegram commands:**

* "we spent $50 groceries" → logs to SHARED ledger (temporary, for settlement period)  
* "me spent $30 shirt" → logs to PERSONAL ledger (immediate, permanent)  
* "spent $50 groceries" → defaults to SHARED (most common case)

**Where it goes:**

* Shared expenses: Go to shared ledger, held there until settlement  
* Personal expenses: Go directly to personal ledger, appear immediately

**Why it matters:**

* Logging takes 5 seconds, zero friction  
* Works seamlessly in your existing Telegram chat  
* No app to download or login required  
* Supports both tracking systems from one place

**User benefits:**

* Log while you're at the store  
* Doesn't interrupt workflow  
* Works from any device (just text)  
* Quick confirmation of what type was logged

---

### **Feature 2: Web Dashboard (Personal Ledger \+ Shared Ledger Views)**

**What it does:**

* Clean dashboard with two main views:

**Personal Ledger View:**

* Your complete spending history (settled expenses only)  
* Shows your half of any shared expenses (at split cost)  
* Categories, trends, historical analysis  
* Personal expenses you logged immediately appear here  
* Shared expenses appear here AFTER settlement at your split cost

**Shared Ledger View (Active During Settlement Period):**

* Current period's expenses you're splitting  
* What you paid, what GF paid  
* Running balance (who owes whom)  
* Time remaining until settlement deadline  
* Option to settle early if needed

**Why it matters:**

* Personal view is your real budget/spending history  
* Shared view is a temporary calculator for the current period  
* Clear separation prevents confusion about what counts as "your spending"  
* See shared expenses at YOUR cost, not the full amount

**User benefits:**

* Know your actual personal spending (important for budgeting)  
* See shared expenses at your split amount, not inflated  
* Understand what you owe clearly  
* Keep permanent record of all settlements

---

### **Feature 3: Automatic Split Calculator (During Settlement Period)**

**What it does:**

* Calculates who owes whom for the CURRENT settlement period only  
* Tracks:  
  * Total amount you paid for shared expenses  
  * Total amount GF paid for shared expenses  
  * Each person's fair share (50/50 split)  
  * Who owes whom and exactly how much  
* Updates in real-time as new shared expenses are logged  
* Shows deadline for settlement  
* Personal expenses are completely excluded

**Example:**

Week 1 Shared Ledger (May 20-26):  
You paid: $50 (groceries) \+ $30 (gas) \= $80  
GF paid: $75 (restaurant) \= $75  
Total shared: $155  
Each owes: $77.50

Your calculation: You paid $80, should pay $77.50  
→ You owe GF: $12.50

(Personal items like your $30 shirt don't show here)

**Settlement Options:**

* Settle by deadline (Friday night, end of month, etc.)  
* Settle early anytime  
* If missed deadline, marked as "Outstanding" and carries to next period

**Why it matters:**

* Replaces manual calculation completely  
* Automatic updates as expenses come in  
* Clear deadline tracking (on-time vs outstanding)  
* Supports both scheduled and manual settlements

**User benefits:**

* Never calculate by hand again  
* Clear, transparent breakdowns  
* Know exactly who owes whom at any moment  
* Flexibility to settle early or handle outstanding balances

---

### **Feature 4: Personal Expense History & Records**

**What it contains:**

* Only settled expenses (your actual spending history)  
* Personal expenses you logged (appear immediately)  
* Shared expenses from completed periods (appear after settlement, at your split cost)  
* All with: Amount, Category, Date logged, Description, Notes

**What you see:**

* Complete history of what you've spent  
* Each item shows your actual cost (half of shared items)  
* Filterable by date range, category, or type  
* Historical trend analysis  
* Never disappears or changes

**Settlement Records:**

* Summary of each completed settlement period  
* Shows all items settled together  
* Calculation breakdown  
* Settlement date  
* Reference for future disputes/questions

**Example:**

Personal Ledger (after settlements):  
\- May 22: $30 shirt (logged immediately as personal)  
\- May 22: $25 groceries (your half, moved here after settlement)  
\- May 24: $37.50 restaurant (your half, moved here after settlement)  
\- May 26: $15 gas (your half, moved here after settlement)

All items show original date they were logged, not settlement date

**Why it matters:**

* Real record of what you spent (your share)  
* Budget tracking and analysis  
* Permanent settlement records  
* Can reference later if needed

**User benefits:**

* See your actual personal spending trends  
* Know what you really spent (not inflated by full amounts)  
* Complete audit trail  
* Historical proof of settlements

---

### **Feature 5: Add Expenses Manually via Web App (Shared & Personal)**

**What it does:**

* Quick form to log expenses either way:  
  * Amount  
  * Category (with suggestions based on your history)  
  * Who paid  
  * Type: SHARED (goes to settlement tracker) or PERSONAL (goes to personal ledger immediately)  
  * Optional description/notes  
  * Optional date/time (defaults to today)

**Where it goes:**

* Personal expenses: Immediately to your personal ledger  
* Shared expenses: To the shared ledger for the current settlement period

**Why it matters:**

* Backup to Telegram if you prefer clicking over texting  
* Better for expenses logged after the fact  
* Good for people who prefer app interface  
* Same logging option as Telegram bot

**User benefits:**

* Flexible logging (Telegram or web, pick your preference)  
* Works for both tech-savvy and less-technical users  
* Can log past expenses with custom dates  
* Quick toggle between personal and shared

---

### **Feature 6: CSV Import (Historical Data \- Personal & Shared)**

**What it does:**

* Import your old expense history from your current spreadsheet into the new app  
* Upload a CSV file with your past expenses  
* Specify during import which column indicates SHARED vs PERSONAL  
* All historical data appears in your dashboard with proper categorization

**What we'll import from your spreadsheet:**

* Purchase name (what you bought)  
* Price (amount)  
* Category (Food, Shopping, Subscriptions, Other, Investments, Grocery, etc.)  
* Notes (optional descriptions)  
* Week/date information (for tracking)  
* Any indication of shared vs personal expenses

**Why it matters:**

* Don't lose historical data from your current tracking  
* Can see long-term trends in spending  
* Start fresh without re-entering months of data  
* Maintains continuity with your existing budget tracking

**User benefits:**

* Seamless migration from spreadsheet to app  
* No manual re-entry of old expenses  
* Historical context for personal and shared spending  
* Ability to see trends over time

---

## **5\. Account Structure & How It Works**

### **Individual Accounts That Link**

**Setup (one-time, takes 2 minutes):**

You: Create account "You" with email/password  
GF: Create account "GF" with email/password  
You: Send command: "link me to \[GF\]" (or via app button)  
GF: Confirms the link  
Done \- you're now connected

**Two Separate Ledgers Per Person:**

Each person has:

1. **Personal Ledger** \- Your permanent spending history  
2. **Shared Ledger** \- Temporary tracker for the current settlement period

---

### **The Personal Ledger (Permanent Budget Record)**

**What it contains:**

* Only settled expenses  
* Shows YOUR half of any shared expenses (at split cost, not full cost)  
* Example: If you paid $50 for groceries split with GF, your personal ledger shows $25 (your half), not $50

**When it gets data:**

* Immediately: Expenses you marked as personal (just you)  
* After settlement: Shared expenses from the completed period (at your split amount)

**What you see:**

* Complete spending history  
* All categories and trends  
* Historical record forever  
* How much you actually spent (your share)

**Example:**

You log: "me spent $30 shirt" (personal)  
→ Immediately appears in YOUR personal ledger: $30 on clothing

You log: "we spent $50 groceries" (shared)  
→ Goes to shared ledger temporarily, NOT personal yet  
→ Shared ledger: $50  
→ Personal ledger: empty (waiting for settlement)

GF logs: "we spent $75 restaurant" (shared)  
→ Goes to shared ledger temporarily  
→ Shared ledger: $50 \+ $75 \= $125 total

Friday \- Settlement happens:  
\- Total shared: $125  
\- Your share: $62.50 (split 50/50)  
\- You paid: $50, so you owe GF: $12.50

After settlement:  
→ Your personal ledger now includes:  
  \- $30 shirt (was already there)  
  \- $25 groceries (your half of the $50, dated when you logged it)  
  \- $37.50 restaurant (your half of the $75, dated when GF logged it)

→ GF's personal ledger now includes:  
  \- $20 coffee (was already there)  
  \- $25 groceries (her half, dated when you logged it)  
  \- $75 restaurant (her half)

→ Shared ledger resets to empty, ready for next period

---

### **The Shared Ledger (Temporary Settlement Tracker)**

**What it contains:**

* Only expenses marked as "we spent..." during current period  
* Full amounts at original payer  
* Used to calculate who owes whom  
* Active only for the settlement period (week, month, custom)

**When it exists:**

* Starts fresh at beginning of period  
* Active throughout the period  
* Gets archived when period settles  
* Replaced by new period's ledger

**What you see:**

* Current expenses for this period only  
* Running total of what you paid  
* Running total of what GF paid  
* Current balance calculation (who owes whom)  
* Timeline to settlement

**Example:**

Week 1 (May 20-26):  
Shared ledger shows:  
  You paid: $50 (groceries) \+ $30 (gas) \= $80 total  
  GF paid: $75 (restaurant) \= $75 total  
    
Current balance: You owe GF $12.50  
(because you paid $80, but should pay $62.50)

---

### **Settlement Scenarios**

**Scenario 1: Normal Weekly Settlement**

Week 1 (May 20-26):  
Friday evening, time to settle

Shared ledger:  
  You: $50 groceries \+ $30 gas \= $80  
  GF: $75 restaurant \= $75  
    
Calculation: You owe GF $12.50

Click "Settle Period":  
→ Expenses move to personal ledgers at split cost:  
   Your personal: $25 groceries \+ $15 gas \+ $37.50 restaurant  
   GF personal: $25 groceries \+ $15 gas \+ $75 restaurant

→ Settlement receipt created:  
   "Week 1 (May 20-26) \- Settlement Complete  
    Total: $155 | Your share: $77.50 | Amount owed: $12.50  
    Settled on: May 26  
    Items: \[list of all 3 expenses\]"

→ Shared ledger wiped clean

Week 2 (May 27-Jun 2):  
Shared ledger is fresh and empty, ready for new expenses  
Personal ledgers retain Week 1 data

**Scenario 2: Early Manual Settlement (Mid-Period)**

Week 1 (May 20-26):  
Wednesday afternoon, you both decide to settle early

Current shared ledger:  
  You: $50 groceries  
  GF: $75 restaurant

Click "Settle Now":  
→ Expenses move to personal ledgers at split cost  
→ Settlement receipt created (marked as early settlement)  
→ Shared ledger wiped

Wednesday 3pm onwards:  
New expenses still count as "Week 1" (May 20-26)  
But shared ledger is now empty and collecting new items

Friday (end of week):  
System shows:  
"Week 1 (May 20-26) \- Summary  
  Early settlement: Wed, May 22 at 3pm  
    Items settled: Groceries, Restaurant  
    Amount owed: $12.50 (settled)  
    
  Remaining (Wed afternoon \- Fri):  
    New items: \[any expenses after settlement\]  
    New calculation: $X owed  
      
  Final summary: 2 settlements this period  
  Total: $XXX"

**Scenario 3: Missed Settlement (Outstanding Balance)**

Week 1 (May 20-26):  
Friday passes, they don't settle

System marks as "Outstanding":  
  Dashboard shows: "Week 1 (May 20-26) \- Outstanding  
                   $12.50 owed to GF  
                   Due: Overdue"

Week 2 (May 27-Jun 2\) starts:  
New shared ledger created for Week 2  
Week 1 remains as "Outstanding"

When they finally settle Week 1 (say, Wed of Week 2):  
"Week 1 (May 20-26) \- Settled Late  
  Settlement date: June 2  
  Original period end: May 26  
  Days overdue: 7  
  Amount: $12.50"

→ Expenses now move to personal  
→ Week 1 marked as complete  
→ Week 2 continues separately

---

### **Privacy Model**

**Personal expenses (marked "me"):**

* Only in YOUR account's personal ledger  
* GF cannot see them  
* Don't affect the split

**Shared expenses (marked "we"):**

* Show in BOTH accounts' shared ledger during period  
* Both can see them equally  
* Count toward the split calculation  
* After settlement, each person's personal ledger shows their half

---

## **6\. Settlement Management**

### **Settlement Periods**

**How they work:**

* You choose a settlement frequency: Weekly, Monthly, or Custom  
* Shared ledger accumulates expenses during this period  
* At the end (or anytime before/after), you settle  
* Once settled, period closes and new period begins

### **Settlement Options**

**Option 1: On-Time Settlement (Ideal)**

* Settle by the deadline (Friday night, end of month, etc.)  
* All expenses from period move to personal ledgers at split cost  
* Settlement receipt created for reference  
* Shared ledger resets, new period begins

**Option 2: Early Settlement (Anytime)**

* Settle mid-period if you want  
* All accumulated expenses move to personal ledgers  
* Settlement receipt created  
* Shared ledger resets immediately  
* Period still continues until the scheduled end date  
* Any new expenses logged before deadline count as same period but show as "after early settlement"

**Option 3: Missed Deadline (Outstanding)**

* If period ends without settling, marked "Outstanding"  
* Dashboard shows: "Week of May 20-26 \- Outstanding, $12.50 owed"  
* New period starts with fresh shared ledger  
* Old period stays in outstanding list  
* When eventually settled, it shows as "Settled Late"  
* Then expenses move to personal

### **Settlement Summary & Records**

**What gets created:**

* Settlement receipt showing:  
  * Period dates  
  * All items included  
  * Who paid what  
  * Calculation breakdown  
  * Amount owed  
  * Settlement date (on-time, early, or late)  
  * Status (completed, outstanding)

**You can:**

* View any past settlement anytime  
* See what was settled when  
* Reference disputes (no guessing)  
* Track payment history

---

## **7\. Non-Core Features (Future/Phase 2\)**

These are nice-to-haves that we could add later if needed:

* **Weekly automatic summaries** \- Bot sends summary every Sunday  
* **Expense categories with analytics** \- Charts showing where money goes  
* **Recurring/subscription expenses** \- Auto-log monthly bills  
* **Payment reminders** \- Reminder when balance is due  
* **Budget limits** \- Alert when spending exceeds target  
* **Multiple splits** \- Support splitting costs more than 2 ways (if you have roommates, etc.)

---

## **8\. User Workflow (Happy Path)**

### **Scenario: Normal Week with Settlement**

**Monday:**

* 10 AM: You buy groceries for $50 (to share)

  * Log: "we spent $50 groceries"  
  * Goes to: SHARED LEDGER (temporary)  
  * Personal ledger: No change yet  
* 2 PM: You buy a shirt for $30 (personal)

  * Log: "me spent $30 shirt"  
  * Goes to: PERSONAL LEDGER (immediate)  
  * Shared ledger: No change

**Tuesday:**

* 6 PM: GF goes to restaurant, spends $75 (to share)  
  * Log: "we spent $75 restaurant"  
  * Goes to: SHARED LEDGER  
  * Dashboard shows running balance: You owe GF $12.50

**Wednesday:**

* Various expenses logged throughout the week  
* Shared ledger accumulates  
* Personal ledger receives any personal expenses immediately

**Friday Evening (Settlement Time):**

Dashboard shows:

 SHARED LEDGER SUMMARY (Week 1: May 20-26)  
You paid: $50 \+ $30 gas \= $80  
GF paid: $75 restaurant \= $75  
Total: $155  
You owe GF: $12.50

*   
* Click "Settle Period"

* Settlement complete

**After Settlement:**

* Shared ledger wiped clean

Expenses moved to personal ledgers at split cost:

 YOUR PERSONAL LEDGER now shows:  
\- May 22: $30 shirt (personal)  
\- May 22: $25 groceries (your half of $50)  
\- May 23: $37.50 restaurant (your half of $75)  
\- May 23: $15 gas (your half of $30)

GF'S PERSONAL LEDGER now shows:  
\- May 22: $25 groceries (her half of $50)  
\- May 23: $75 restaurant (full amount)  
\- May 23: $15 gas (her half of $30)

* 

Settlement receipt created:

 WEEK 1 SETTLEMENT (May 20-26)  
Settled: Friday, May 26 at 8:30 PM  
Total shared: $155  
Your share: $77.50  
Amount owed: $12.50  
Items: Groceries, Restaurant, Gas

* 

**Week 2 (May 27-Jun 2\) Starts:**

* Shared ledger fresh and empty  
* Personal ledgers retain all Week 1 history  
* Ready to log new shared expenses for Week 2

**Result:**

* All expenses logged and settled  
* Zero manual calculations  
* Complete transparency on what you owe  
* Personal budget shows your actual spending (at your share)  
* Complete settlement record for reference  
* Takes 30 seconds to settle instead of 10 minutes

---

## **8\. Success Criteria (How We'll Know It Works)**

✅ **Adoption:** You use the app for 2+ weeks and don't go back to the spreadsheet method

✅ **Time savings:** Weekly settlement takes \<2 minutes (vs. 10-15 before)

✅ **Accuracy:** Zero calculation errors

✅ **Satisfaction:** Both of you agree it's easier than the old way

✅ **Maintenance:** No manual data entry needed (except maybe adding expenses after the fact)

---

## **9\. Scope Boundaries (What We're NOT Building)**

❌ Multi-group splitting (this is just for 2 people) ❌ Banking integration (no automatic expense detection) ❌ Mobile app (web works on phones, no native app) ❌ Cryptocurrency or complex payment methods (simple cash/Venmo) ❌ Advanced tax features or compliance tools ❌ Recurring bills automation (one-time manual logging is fine)

---

## **10\. Timeline & Rollout**

### **Phase 1: MVP (This Is What We'll Build First)**

**Features:** Core logging, dashboard, calculator, history, manual add, CSV import **Timeline:** 1-2 weeks of development **Rollout:** Both of you start using it immediately **Cost:** Free (except hosting \~$0-5/month)

### **Phase 2: Polish (After You've Used It a Week)**

**Features:** Bug fixes, refinements, maybe some Phase 2 features if needed **Timeline:** As-needed

### **Phase 3: Expansion (Only If You Want)**

**Features:** Charts, recurring expenses, analytics, etc. **Timeline:** Later, based on feedback

---

## **11\. Technical Architecture (High Level \- For Context)**

**You don't need to understand this, but here's what's happening:**

* **Telegram Bot:** You text it, it listens and logs to our system  
* **Web App:** Website where you see all expenses and calculations (hosted on Netlify)  
* **Database:** Where all your expense data is safely stored  
* **Backend:** The "brain" that calculates who owes whom

**The good part:** You never have to think about this. It just works.

---

## **12\. Budget & Cost**

**Development cost:** We're building this together, no monetary cost

**Hosting costs (per month):**

* Netlify: FREE (host the website)  
* Database: FREE tier works for years (Firebase/Supabase)  
* Telegram Bot: FREE (runs on basic server)  
* **Total monthly cost: $0-5** (only if we need paid tiers, which we won't)

---

## **13\. Risk Assessment**

### **Potential Issues & Mitigation**

| Risk | Impact | Mitigation |
| ----- | ----- | ----- |
| Data loss | High | Regular backups, trusted database provider |
| Bot goes down | Medium | Easy to re-deploy, can log manually in app |
| Parsing errors in Telegram | Medium | Clear error messages, user can re-submit |
| One person forgets to log | Medium | Both can log on behalf of other person |

---

## **14\. Success Story (Vision)**

**Before:** "Ugh, it's Friday. Now I have to open my spreadsheet, record 8 transactions, calculate the split, and figure out who owes who. This takes 15 minutes and I always mess up the math."

**After:** "I logged each expense in Telegram when I made it. I open the app and it shows me I owe $2.50. I Venmo her, done. Took 30 seconds."

---

## **15\. Questions to Finalize Scope (ANSWERED)**

1. **Splitting logic:** Always 50/50, or do you want more flexible splits?

   * Answer: 50/50 for now \- good starting point, can add flexibility later  
2. **Time period:** Do you settle weekly, or more frequent?

   * Answer: All recommendations accepted \- support weekly, monthly, or custom  
3. **Categories:** Fixed list of categories, or free-form?

   * Answer: All recommendations accepted \- suggested categories but allow custom  
4. **Who can see what:** Can both people see all expenses, or just their own?

   * Answer: DECIDED ON OPTION A \- Individual accounts that link together  
     * Shared expenses visible to both  
     * Personal expenses visible only to that person  
     * This is the privacy \+ flexibility approach  
5. **Payment tracking:** Do you want to track actual Venmo/payments in the app, or just calculate balances?

   * Answer: All recommendations accepted \- just calculate, mark as settled when done

---

## **16\. Telegram Bot Command Format (DECIDED)**

When logging via Telegram bot, use a prefix system:

* **"we spent $50 groceries"** \- Logs as SHARED expense  
* **"me spent $30 shirt"** \- Logs as PERSONAL expense  
* **"spent $50 groceries"** \- Defaults to SHARED (most common case)

Bot will confirm either way:

"Logged: $50 on groceries (SHARED)"  
"Logged: $30 on shirt (PERSONAL)"

---

## **17\. CSV Import Structure**

Based on your current spreadsheet, we'll support importing:

* **Purchase name** (merchant/item description)  
* **Price** (amount spent)  
* **Category** (Food, Shopping, Subscriptions, Entertainment, Other, Investments, Grocery, etc.)  
* **Notes** (optional additional info)  
* **Week/Date** (for proper date tracking)  
* **SHARED vs PERSONAL** (you'll specify during import)

The import process:

1. Upload your CSV file  
2. Map columns to our system  
3. Choose: Is this shared or personal expenses?  
4. Confirm and import  
5. All data appears in your historical records


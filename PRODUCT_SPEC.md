# Envis Platform Product Specification

**Document Purpose**: Comprehensive product spec derived from the EnvisDemo codebase, designed to guide development of the production Envis platform integrated with Yapily sandbox.

**Version**: 2.0
**Date**: March 2026
**Status**: Active Development

---

## Table of Contents

1. [Executive Summary & Vision](#1-executive-summary--vision)
2. [Yapily Integration Architecture](#2-yapily-integration-architecture)
3. [Core Feature Specifications](#3-core-feature-specifications)
4. [Intelligence & Coaching Engine](#4-intelligence--coaching-engine)
5. [Family Management & Fairness Engine](#5-family-management--fairness-engine)
6. [Data Models & API Contracts](#6-data-models--api-contracts)
7. [Roadmap & Success Metrics](#7-roadmap--success-metrics)

---

## 1. Executive Summary & Vision

### 1.1 Product Definition

**Envis** is an intelligent family financial management platform that proactively coordinates goals, prevents financial stress, and builds collective wealth. Unlike traditional finance apps that simply track spending, Envis acts as a financial coach — anticipating needs, identifying opportunities, and helping families make better financial decisions together.

**Tagline**: Your family's financial partner

### 1.2 Problem Statement

Modern families face five critical financial challenges:

| Problem | Impact |
|---------|--------|
| **Fragmented Financial Picture** | Money spread across multiple accounts (joint, personal, credit cards) — impossible to see the complete picture |
| **Reactive Management** | Issues discovered only when it's too late (overdrafts, missed payments, budget overruns) |
| **Missed Opportunities** | No intelligent analysis means families miss savings from subscription consolidation, spending pattern changes, or investment opportunities |
| **Coordination Challenges** | Multiple family members making financial decisions without visibility into the bigger picture |
| **Goal Misalignment** | Individual spending decisions undermining collective family financial goals |

### 1.3 Product Vision

Transform family financial management from a reactive chore into a proactive partnership by:

- Aggregating all financial data via **Yapily Open Banking** into a unified family view
- Applying intelligent analysis to surface actionable insights before problems occur
- Coordinating spending and saving toward shared family goals
- Recognising unpaid labour contributions through the Fairness Engine
- Coaching families with emotionally-aware, context-driven recommendations

### 1.4 Target Users

**Primary Persona — The Family Financial Coordinator**
- Age: 30–50
- Role: Primary financial decision-maker in household
- Pain Points: Tracking spending across multiple accounts, unexpected shortfalls, coordinating finances with partner, tracking goal progress

**Secondary Persona — The Partner/Spouse**
- Age: 30–50
- Role: Joint decision-maker, may have separate accounts
- Pain Points: Limited visibility, wants to contribute to goals, needs awareness of spending impact

### 1.5 Target Market

- **Geography**: UK initially (Open Banking maturity via Yapily)
- **Segment**: Families with £40k+ household income
- **Size**: ~8M UK households (estimated addressable market)

### 1.6 Demo-to-Production Gap Analysis

The EnvisDemo codebase is a fully functional interactive prototype using mock data and a "Wizard of Oz" approach. The production Envis platform must bridge these gaps:

| Area | Demo State | Production Target |
|------|-----------|-------------------|
| Open Banking | Simulated bank selection + static accounts | Yapily sandbox → production API integration |
| Data Persistence | In-memory state, resets on refresh | PostgreSQL via Drizzle ORM (schema ready) |
| Authentication | Console log stubs | OAuth 2.0 / Passport.js session-based auth |
| Transactions | 32 hardcoded mock transactions | Real-time Yapily transaction feeds |
| Insights | Static insight objects per category | AI-generated insights from transaction analysis |
| Coaching | Keyword-matched responses | LLM-powered conversational coach |
| Notifications | 4 static mock notifications | Real-time event-driven notification system |
| Family Invites | UI-only email input | Email service + token-based invite flow |
| Fairness Engine | Client-side calculation only | Server-persisted with historical tracking |

---

## 2. Yapily Integration Architecture

### 2.1 Overview

The demo simulates Open Banking with a static bank list (Monzo, Starling, Barclays, NatWest, HSBC, Lloyds) and hardcoded account data. The production platform must replace this with real Yapily API calls while preserving the same user experience flow.

### 2.2 Account Linking Flow — Demo vs Production

The demo implements a 5-step onboarding flow in `AccountLinkingFlow.tsx`:

```
intro → selectBank → selectAccounts → success → uploadStatements
```

**Production mapping to Yapily:**

| Demo Step | What Happens Now | Yapily Production Equivalent |
|-----------|-----------------|------------------------------|
| **intro** | Static security messaging card | Same UI — no API call needed |
| **selectBank** | User picks from 6 hardcoded UK banks | `GET /institutions` — fetch available institutions filtered by country (GB) and features (ACCOUNT_TRANSACTIONS) |
| **selectAccounts** (auth) | Simulated 500ms delay, no real auth | `POST /account-auth-requests` — create consent, redirect user to bank's auth page, handle callback |
| **selectAccounts** (fetch) | 4 hardcoded accounts shown with checkboxes | `GET /accounts` using consent token — display real accounts with balances |
| **success** | Static confirmation with account list | Persist selected accounts to `connected_accounts` table, trigger initial transaction sync |
| **uploadStatements** | PDF/CSV upload UI for investments | Remains manual — investments not covered by Open Banking |

### 2.3 Yapily API Integration Points

#### 2.3.1 Institution Discovery

Replace the hardcoded `UK_BANKS` array:

```
Demo:  const UK_BANKS = [{ id: "monzo", name: "Monzo" }, ...]
Prod:  GET /institutions?country=GB → display with real logos, features
```

**Fields to map:**
- `institution.id` → bank identifier for auth requests
- `institution.name` → display name
- `institution.media[].source` → bank logo URL
- `institution.features[]` → filter to banks supporting `ACCOUNT_TRANSACTIONS`

#### 2.3.2 Account Authorisation

Replace the simulated auth step:

```
Demo:  setTimeout(() => setStep("selectAccounts"), 500)
Prod:  POST /account-auth-requests → redirect to authorisation URL → handle callback
```

**Flow:**
1. `POST /account-auth-requests` with `institutionId`, `callback` URL
2. Redirect user to `data.authorisationUrl`
3. User authenticates at their bank
4. Bank redirects back with consent token
5. Store consent token server-side, linked to family

#### 2.3.3 Account Retrieval

Replace hardcoded `DEMO_ACCOUNTS`:

```
Demo:  const DEMO_ACCOUNTS = [{ id: "joint", name: "Joint Account", balance: 800.50 }, ...]
Prod:  GET /accounts (with consent token) → real accounts with live balances
```

**Fields to map to `connected_accounts` table:**
- `account.id` → `externalAccountId`
- `account.accountNames[0].name` → display name
- `account.accountType` → `accountType` (CURRENT, SAVINGS, CREDIT_CARD)
- `account.accountBalances[0].balanceAmount.amount` → `balance`
- `account.accountBalances[0].balanceAmount.currency` → `currency`
- `account.accountIdentifications[0].identification` → `accountNumber` (masked)
- `account.institution.id` → derive `bankName`

#### 2.3.4 Transaction Retrieval

Replace the 32 hardcoded mock transactions in `Dashboard.tsx`:

```
Demo:  const mockCategories = [{ transactions: [...] }, ...]
Prod:  GET /accounts/{accountId}/transactions → real transaction feeds
```

**Fields to map to `transactions` table:**
- `transaction.id` → for deduplication
- `transaction.description` → `description` (merchant name)
- `transaction.amount` → `amount` (negative for debits)
- `transaction.bookingDateTime` → `date`
- `transaction.transactionCategory` → seed initial `category` (then allow user recategorisation)

**Sync strategy:**
- Initial sync: Fetch up to 12 months of history on first connection
- Ongoing sync: Poll every 4 hours or on user-triggered refresh
- Store `lastSyncedAt` on `connected_accounts` to track freshness
- Handle pagination via Yapily's `next` cursor

#### 2.3.5 Balance Refresh

Replace the simulated refresh in `Accounts.tsx`:

```
Demo:  setTimeout(() => { setRefreshingId(null); }, 1500)
Prod:  GET /accounts (with consent token) → update balances in connected_accounts
```

### 2.4 Consent Management

Yapily consents have a 90-day validity window (PSD2 requirement). The platform must:

1. **Track consent expiry** — add `consentToken` and `consentExpiresAt` columns to `connected_accounts`
2. **Proactive re-consent** — when consent is within 7 days of expiry, show "Needs Refresh" status (already in demo UI as `status: "needs_refresh"`)
3. **Re-authorisation flow** — reuse the same auth flow to obtain a new consent
4. **Grace period handling** — queue failed syncs and retry after re-consent

### 2.5 Yapily Sandbox Testing Strategy

| Scenario | Sandbox Approach |
|----------|-----------------|
| Multi-bank linking | Use sandbox institutions (modelo-sandbox) to simulate different banks |
| Joint vs individual accounts | Tag accounts with `ownershipType` during linking (user-selected, as in demo) |
| Transaction categorisation | Use sandbox transactions, apply categorisation engine |
| Balance updates | Sandbox provides consistent test balances for verification |
| Error handling | Test consent expiry, network failures, rate limits |
| Edge cases | Accounts with no transactions, zero balances, multiple currencies |

### 2.6 Data Flow Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Envis UI   │────▶│  Envis API   │────▶│  Yapily API     │
│  (React)    │◀────│  (Express)   │◀────│  (Open Banking) │
└─────────────┘     └──────┬───────┘     └─────────────────┘
                           │
                    ┌──────▼───────┐
                    │  PostgreSQL  │
                    │  (Neon)      │
                    └──────────────┘
```

**Key principle**: The Envis API acts as a proxy and cache layer. Yapily is never called directly from the client. All consent tokens and API keys are server-side only.

---

## 3. Core Feature Specifications

### 3.1 Onboarding & Account Linking

**Source**: `Welcome.tsx`, `AuthForm.tsx`, `AccountLinkingFlow.tsx`, `LoadingTransition.tsx`

#### 3.1.1 User Flow

```
Welcome Hero → Sign Up/Log In → Account Linking → Loading Transition → Dashboard
```

**Stage 1 — Welcome Hero** (`WelcomeHero.tsx`)
- Hero image with gradient overlay
- "Get Started" and "Log In" CTAs
- Security messaging: FCA-compliant, read-only access, bank-level encryption

**Stage 2 — Authentication** (`AuthForm.tsx`)
- Signup mode: First name, last name, email, password
- Login mode: Email, password
- Mode switching between signup/login
- Production: Wire to Passport.js local strategy + session management

**Stage 3 — Account Linking** (`AccountLinkingFlow.tsx`)
- 5-step flow as detailed in Section 2.2
- Multi-bank support: user can link accounts from multiple banks in sequence
- Statement upload option for investment accounts and premium bonds not covered by Open Banking
- Security copy: "Read-only access — we can only view your transactions and balances"

**Stage 4 — Loading Transition** (`LoadingTransition.tsx`)
- 3-step animated sequence:
  1. "Syncing your accounts..." (1500ms) — triggers Yapily account + transaction fetch
  2. "Analyzing transactions..." (1500ms) — runs categorisation engine
  3. "Building your dashboard..." (1200ms) — aggregates data for display
- Framer Motion animated progress bar
- Step completion checkmarks

#### 3.1.2 Statement Upload

**Source**: `StatementUpload.tsx`

For accounts not covered by Open Banking (investments, premium bonds):
- PDF/CSV file upload with type validation
- Account type selector: Investment Account or Premium Bonds
- Manual entry: Account name, provider, balance
- Upload simulation with progress feedback
- Stored separately from Yapily-linked accounts

### 3.2 Unified Family Dashboard

**Source**: `Dashboard.tsx`, `BalanceSummary.tsx`, `TransactionGroups.tsx`, `CategoryInsightSheet.tsx`

#### 3.2.1 Balance Summary

**Source**: `BalanceSummary.tsx`

Five metric cards in a responsive grid:

| Card | Demo Value | Data Source (Production) |
|------|-----------|------------------------|
| **Total Family Balance** | £15,300.50 | Sum of all `connected_accounts.balance` for family |
| **Monthly Net Flow** | +£750.00 | Sum of current month income minus spending from `transactions` |
| **Active Goals** | 4 | Count of `goals` where `currentAmount < targetAmount` |
| **Pending Insights** | 6 | Count of unread/unactioned insights |
| **Fairness Tracker** | 48/52 ratio | From fairness engine calculation |

Each card is clickable, navigating to the relevant detail page (Goals, Insights, Family).

#### 3.2.2 Transaction Categorisation & Display

**Source**: `TransactionGroups.tsx`

**Demo categories with mock data:**

| Category | Demo Total | Transactions | Key Insight |
|----------|-----------|-------------|-------------|
| Groceries | £375.90 | 6 | On track, 8% above average (holiday shopping) |
| Eating Out | £374.70 | 6 | 43% above £112 monthly average |
| Entertainment | £61.94 | 6 | 3 streaming subs at £31/month, consolidation opportunity |
| Transport | £158.90 | 4 | 15% increase from holiday travel |
| Shopping | £438.48 | 4 | 85% December spike (Christmas gifts) |
| Income | £8,600.00 | 4 | Alex £2,500/mo + Sam £1,800/mo |
| Savings | £1,000.00 | 2 | £500/month consistent transfers |

**Transaction display fields** (per the demo mock structure):
- `merchantName` — e.g., "Tesco", "Netflix", "Salary Deposit"
- `amount` — negative for spending, positive for income (green with + prefix)
- `date` — format "DD Mon YYYY" (e.g., "27 Jan 2026")
- `accountLabel` — e.g., "Joint Account", "Personal Account"
- `accountOwner` — e.g., "Alex & Sam" (joint), "Alex" (individual)
- `ownershipType` — "individual" or "joint"

**Production**: Replace with auto-categorised Yapily transactions. Use merchant name + transaction category from Yapily as seed, allow user overrides.

#### 3.2.3 Filtering

**Timeline Filters** (7 options):
- Current Month
- Previous Month
- Current + Previous Month (default)
- Last 3 Months
- Last 6 Months
- Year to Date
- Last 2 Years

**Ownership Filters** (3 options):
- All accounts
- Individual accounts only
- Joint accounts only

**Search**: Free-text search across all transaction descriptions.

#### 3.2.4 Transaction Management

- **Select transactions** via checkboxes on individual transactions
- **Bulk move** selected transactions between categories
- **Create custom categories** with duplicate name handling (appends counter)
- All changes must persist server-side in production

#### 3.2.5 Category Insight Sheet

**Source**: `CategoryInsightSheet.tsx`

Side panel (Radix Sheet) opened via "View Insights" button on each category:

- **Headline**: e.g., "Multiple Streaming Subscriptions"
- **Body**: Detailed explanation with specific numbers
- **Key Metrics**: Label/value pairs (e.g., "Monthly Cost: £30.97", "Annual Cost: £371.64")
- **Savings Opportunity** (priority-based detection):
  1. **Priority 1 — Explicit Opportunities**: Identified savings (e.g., "consolidate streaming = £35/month")
  2. **Priority 2 — Spending Increases**: Current month vs last month (only if increased)
  3. **Priority 3 — Above Average**: Current month vs monthly average (only if above)
- **Yearly Growth Projections**: Monthly savings × 12, with 8% index fund and 4.5% savings account projections

### 3.3 Account Management

**Source**: `Accounts.tsx`

Two-column layout:

#### Left Column — Connected Accounts (via Yapily)

**Demo mock accounts:**
- Barclays Joint Current Account: £2,450.75 (active, synced 2 hours ago)
- Nationwide Shen's ISA: £8,500 (active, synced 1 hour ago)
- Santander Personal Savings: £12,500 (needs refresh, synced 5 days ago)

**Per-account display:**
- Bank name and icon
- Account name and type
- Current balance (tabular-nums for alignment)
- Status indicator: Connected (green), Needs Refresh (amber), Error (red)
- Last synced timestamp

**Actions:**
- **Refresh**: Re-fetch balance via Yapily API (demo: 1.5s simulated delay)
- **Add Account**: Returns to bank selection flow
- **Remove Account**: Confirmation dialog, then delete from `connected_accounts`

#### Right Column — Uploaded Accounts (Investments/Premium Bonds)

- Manually uploaded via statement upload
- Display: Account name, provider, balance, upload date
- Actions: Remove with confirmation

**Educational copy** (already in demo):
- "FCA regulated and secure"
- "Read-only access to your accounts"
- "Automatic refresh keeps data current"
- "Remove accounts anytime"

### 3.4 Collaborative Goal Management

**Source**: `Goals.tsx`, `GoalCard.tsx`, `GoalForm.tsx`

#### 3.4.1 Demo Goals

| Goal | Target | Current | Target Date | Linked Accounts |
|------|--------|---------|-------------|-----------------|
| House Deposit | £20,000 | £5,500 | Oct 2028 | Joint + Personal |
| Family Holiday | £5,000 | £2,800 | Jul 2026 | Joint |
| Emergency Fund | £9,000 | £2,400 | Dec 2026 | Joint + Savings |
| Kids Education | £15,000 | £3,200 | Sep 2030 | Personal + Savings |

#### 3.4.2 Goal Card Display (`GoalCard.tsx`)

- Goal name and icon
- Progress bar with percentage
- Current amount / target amount
- Days remaining until target date
- On-track / Behind indicator
- Edit and Delete action buttons

#### 3.4.3 Goal Form (`GoalForm.tsx`)

- **Goal name** — text input
- **Target amount** — currency input (£)
- **Target date** — date picker
- **Auto-calculated monthly contribution**: `(targetAmount - currentAmount) / monthsRemaining`
- **Linked accounts** — multi-select of connected accounts
- Form validation via React Hook Form + Zod

#### 3.4.4 CRUD Operations

- **Create**: Add new goal via modal form
- **Read**: Display all family goals in card grid
- **Update**: Edit via pre-filled form
- **Delete**: Confirmation dialog before removal

**Production**: Persist to `goals` table. Auto-track `currentAmount` by monitoring savings transfers to linked accounts.

### 3.5 Notification System

**Source**: `NotificationBell.tsx`

Header dropdown triggered by bell icon with unread badge counter.

**Notification types** (4 in demo):

| Type | Icon | Example |
|------|------|---------|
| `goal` | Target | "Your House Deposit goal is 27.5% complete!" |
| `insight` | Lightbulb | "New insight: Your eating out spending is 43% above average" |
| `account` | Building | "Your Santander account needs re-authentication" |
| `family` | Users | "Sam accepted your family invitation" |

**Actions:**
- Mark individual notification as read
- Mark all as read
- Remove individual notification

**Production**: Event-driven notification generation — trigger on balance changes, goal milestones, consent expiry, insight generation, family member actions.

---

## 4. Intelligence & Coaching Engine

### 4.1 Insight Generation System

**Source**: `CategoryInsightSheet.tsx`, insight data in `Dashboard.tsx`

#### 4.1.1 Current Demo Implementation

Each transaction category has a static `insight` object with:

```typescript
interface CategoryInsight {
  headline: string;    // e.g., "Multiple Streaming Subscriptions"
  body: string;        // Detailed explanation with specific figures
  metrics?: {
    label: string;     // e.g., "Monthly Cost", "Potential Savings"
    value: string;     // e.g., "£30.97", "£35/month"
  }[];
}
```

**Demo insights defined:**

| Category | Headline | Key Finding |
|----------|----------|-------------|
| Groceries | "Groceries on Track" | 8% above average due to holiday shopping, normalising |
| Eating Out | "Eating Out Above Average" | 43% above £112 monthly average, could accelerate House Deposit by 11 months |
| Entertainment | "Multiple Streaming Subscriptions" | 3 subs at £31/month, consolidation saves £35/month |
| Transport | "Transport Costs Higher" | 15% increase from holiday travel, expected to normalise |
| Shopping | "Holiday Shopping Spike" | 85% December spike from Christmas gifts, January normal |
| Savings | "Great Savings Progress" | £1,000 over two months, 12% savings rate |

#### 4.1.2 Savings Opportunity Detection (Priority System)

The demo establishes a 3-tier priority system for detecting savings opportunities:

**Priority 1 — Explicit Opportunities**
- Trigger: Pattern-matched savings (e.g., multiple subscriptions for same service type)
- Label: "Potential Savings"
- Example: "Consolidate 3 streaming services → save £35/month"
- Message: "If you saved this amount for a year, here's what it could grow to:"

**Priority 2 — Spending Increases from Last Month**
- Trigger: Current month spending > previous month spending
- Label: "Monthly Excess"
- Example: Eating Out £158.30 this month vs £216.40 last month = spike detected
- Message: "By avoiding this increase from last month, here's what you could save in a year:"

**Priority 3 — Spending Above Average**
- Trigger: Current month spending > rolling monthly average
- Label: "Monthly Excess"
- Example: Eating Out £152 vs £112 average = £40 monthly opportunity
- Message: "By avoiding this spending above average, here's what you could save in a year:"

**Yearly Growth Projections** (shown for all savings opportunities):
- Monthly amount × 12 = Yearly total
- Index Fund Growth projection at 8% annual return
- Savings Account Interest at 4.5% annual rate
- Values displayed in green for positive growth

#### 4.1.3 Production Insight Engine

Replace static insights with a computed pipeline:

```
Yapily Transactions → Categorisation → Pattern Analysis → Insight Generation → Notification
```

**Insight triggers to implement:**
1. **Subscription detection**: Group recurring same-merchant transactions, flag duplicates
2. **Spending anomaly detection**: Compare current period vs rolling 3-month average
3. **Cashflow forecasting**: Project balance forward based on recurring debits, warn of shortfalls
4. **Goal impact analysis**: Connect spending changes to goal timeline effects
5. **Seasonal pattern recognition**: Detect holiday spikes vs genuine lifestyle changes

### 4.2 Financial Coaching

**Source**: `Coaching.tsx`

#### 4.2.1 UI Layout

Two-column layout:
- **Left (3fr)**: Goal accordion cards with pathway steps
- **Right (2fr)**: Sticky chat interface (600px height)

#### 4.2.2 Goal Pathway System

Each goal has structured pathway steps:

```typescript
interface PathwayStep {
  id: string;
  step: string;         // Action title — e.g., "This week: Review your eating out spending"
  description: string;  // Explanation — e.g., "Look at your last few restaurant purchases..."
  completed: boolean;   // Checkbox state
}
```

**Demo pathways:**

**House Deposit (4 steps):**
1. "This week: Review your eating out spending"
2. "Next payday: Move £68 to your deposit" (the amount above usual average)
3. "By end of month: Plan one special meal at home"
4. "Ongoing: Keep your grocery spending steady at £420/month"

**Family Holiday (2 steps):**
1. "This month: Maintain £200/month contribution"
2. "Consider: Early booking discounts (15-20% savings)"

**Emergency Fund (4 steps — marked critical):**
1. "Urgent: Move £700 from savings to cover mortgage" (cashflow alert)
2. "This month: Set up automatic £300/month transfer"
3. "Review: Check streaming subscriptions" (£35/month opportunity)
4. "Goal: Reach 3 months of expenses (£9,000)"

**Kids Education (3 steps):**
1. "This month: Continue £150/month contribution"
2. "Consider: Junior ISA for tax-free growth (£200-300/year boost)"
3. "Future: Increase by 5% annually to match inflation"

**Connected Insights**: Goals link to dashboard insights via `relatedInsights` array:
- House Deposit → "Unusual spending detected on eating out"
- Emergency Fund → "Low balance cashflow alert", "Subscription consolidation opportunity"

#### 4.2.3 Conversational Coach

**Demo implementation**: Keyword-matched "Wizard of Oz" responses.

The demo defines response maps per goal with keyword triggers:

| Goal Context | Keywords | Response Topic |
|-------------|----------|---------------|
| House Deposit | "eating out" | £68 above average, grocery comparison |
| House Deposit | "timeline" | £500/month → Oct 2028, with £568 → Dec 2027 (11 months earlier) |
| House Deposit | "why" | Eating out is the only variable category |
| House Deposit | "how" | Track restaurant spending for a week, be selective |
| House Deposit | "alternative" | Shopping category or income increase options |
| Family Holiday | "timeline" | 3 months ahead of schedule at £200/month |
| Family Holiday | "booking"/"save" | 15-20% savings by booking 6 months ahead |
| Family Holiday | "increase"/"contributions" | +£50/month gets there 5 months sooner |
| Emergency Fund | "cashflow"/"alert" | Mortgage due in 3 days, £700 short |
| Emergency Fund | "subscription"/"streaming" | £35/month from consolidation = £210 in 6 months |
| Emergency Fund | "how"/"build" | £700 transfer → £300/month auto → subscription savings |
| Kids Education | "timeline" | On track at £150/month for Sep 2030 |
| Kids Education | "junior"/"isa" | Junior ISA: up to £9k/year, £200-300/year tax-free boost |
| Kids Education | "increase"/"grow" | 5% annual increases to match inflation |

**Fairness integration**: If fairness data is set, coach references the agreed ratio in its intro message:
> "I'm tracking your goal progress based on your agreed 48/52 fairness split."

**Quick Reply Buttons**: Context-sensitive buttons change per active goal:
- House Deposit: "Why eating out?", "Timeline details?", "Alternatives?"
- Family Holiday: "Timeline?", "Booking tips?", "Increase savings?"
- Emergency Fund: "Cashflow alert?", "Use subscription savings?", "How to build?"
- Kids Education: "Timeline?", "Junior ISA?", "Increase contributions?"

#### 4.2.4 Production Coach

Replace keyword matching with LLM-powered coaching:

**Context to provide per conversation:**
- Family's complete financial snapshot (balances, income, spending by category)
- All active goals with progress and pathway steps
- Recent insights and savings opportunities
- Fairness engine data (if configured)
- Conversation history

**Behavioural guidelines** (derived from demo tone):
- Specific numbers, not vague advice ("£68 above average" not "you're spending too much")
- Celebrate successes alongside warnings
- Connect recommendations to specific goals
- Suggest alternatives, never dictate
- Acknowledge family context ("Many families find this creates better memories")

### 4.3 AI Insight Engine — Emotional Framing

**Source**: `InsightEngineDemo.tsx`

#### 4.3.1 Three-Layer Analysis Model

The demo demonstrates a concept for emotionally-adaptive messaging:

```
Layer 1: Financial Check → "Analyzing spending patterns" → "Overspent by £45"
Layer 2: Emotional Check → "Reading emotional context" → Stress level detection
Layer 3: Risk Assessment → "Calculating notification approach" → Framing decision
```

#### 4.3.2 Adaptive Message Framing

Same financial data, different delivery based on detected stress level:

**High Stress Frame** (warm, empathetic, solution-oriented):
> "We know managing family finances is tough. You've had a spike in dining costs — shall we adjust your holiday goal slightly to keep you on track?"
- Stress badge: Red "High" indicator
- Visual: Warm border tones

**Low Stress Frame** (direct, informational, action-oriented):
> "Heads up: You've exceeded your dining budget by £45. Tap to view transactions."
- Stress badge: Green "Low" indicator
- Visual: Neutral border tones

#### 4.3.3 Production Implementation Considerations

- **Stress signal inputs**: Transaction velocity, balance trajectory, time since last login, interaction patterns
- **Framing engine**: LLM prompt template that adjusts tone based on stress classification
- **A/B testing**: Measure engagement and action rates across framing styles
- **User override**: Allow users to set preferred communication style

---

## 5. Family Management & Fairness Engine

### 5.1 Family Member Management

**Source**: `FamilyMembers.tsx`

#### 5.1.1 Active Members

**Demo data:**
- **Alex Morgan** — Admin role, 3 linked accounts, joined Jan 2024
- **Sam Morgan** — Member role, 2 linked accounts, joined Jan 2024

**Display per member:**
- Avatar with initials
- Full name and role badge (Admin / Member)
- Number of linked accounts
- Join date
- Fairness contribution status (if fairness engine configured)

#### 5.1.2 Family Invitations

**Demo data:**
- jamie@example.com — Pending, invited 2 days ago, expires in 5 days

**Invite flow:**
1. Admin enters email address
2. System generates unique invite token (stored in `family_invites` table)
3. Email sent with invite link (production: email service integration)
4. Token expires after 7 days
5. Recipient clicks link → creates account → auto-joins family
6. Status tracked: pending → accepted / expired

**Actions:**
- Send new invitation (email input + send button)
- Cancel pending invitation
- Resend expired invitation

#### 5.1.3 Member Roles

| Role | Permissions |
|------|------------|
| **Admin** | Full access: manage accounts, goals, members, fairness settings, remove members |
| **Member** | View access: see dashboard, goals, accounts. Can link own accounts, contribute to goals |

#### 5.1.4 Member Removal

- Confirmation dialog with warning
- Removes member from `family_members` (status → "removed")
- Does not delete their linked accounts (decision point for production)

### 5.2 Fairness Engine

**Source**: `FairnessContext.tsx`, `FairnessCalculatorModal.tsx`

#### 5.2.1 Purpose

Calculate fair financial contributions between partners by recognising unpaid labour (childcare, housework, elder care) alongside monetary income. This shifts the contribution ratio from income-only to a holistic view.

#### 5.2.2 Data Model

```typescript
interface PartnerData {
  name: string;          // "Alex" or "Sam"
  grossIncome: number;   // Annual gross income in £
  unpaidHours: number;   // Weekly hours of unpaid labour
  hourlyValue: number;   // £/hour value assigned to unpaid labour
}

interface FairnessData {
  partner1: PartnerData;
  partner2: PartnerData;
  beforeRatio: [number, number];  // Income-only split e.g., [56, 44]
  afterRatio: [number, number];   // Fairness-adjusted split e.g., [48, 52]
  ratioShift: number;             // Percentage shift e.g., 8
}
```

#### 5.2.3 Calculation

**Demo default values:**

| Field | Alex (Partner 1) | Sam (Partner 2) |
|-------|-----------------|-----------------|
| Gross Income | £45,000 | £35,000 |
| Unpaid Hours/Week | 10 | 30 |
| Hourly Value | £15 | £15 |

**Formula:**
```
Virtual Income = unpaidHours × hourlyValue × 52
Total Contribution = grossIncome + virtualIncome

Alex: £45,000 + (10 × £15 × 52) = £45,000 + £7,800 = £52,800
Sam:  £35,000 + (30 × £15 × 52) = £35,000 + £23,400 = £58,400

Income-Only Ratio:    Alex 56% / Sam 44%
Fairness Ratio:       Alex 47.5% / Sam 52.5% → rounded to 48/52
Ratio Shift:          8 percentage points
```

#### 5.2.4 Calculator Modal (`FairnessCalculatorModal.tsx`)

**Inputs per partner:**
- Gross annual income (£)
- Weekly unpaid labour hours
- Hourly value for unpaid labour (£)

**Outputs displayed:**
- Before ratio (income-only) with visual progress bars
- After ratio (fairness-adjusted) with visual progress bars
- Virtual income per partner
- Percentage shift

#### 5.2.5 Platform Integration Points

The fairness engine feeds into multiple features:

| Integration | How |
|------------|-----|
| **Dashboard** (`BalanceSummary.tsx`) | Fairness tracker card shows agreed ratio + on-track status |
| **Coaching** (`Coaching.tsx`) | Coach references agreed ratio in intro: "I'm tracking based on your 48/52 split" |
| **Family Members** (`FamilyMembers.tsx`) | Shows each member's fairness contribution status |
| **Goal Allocation** | Suggests contribution splits per goal aligned to fairness ratio |

#### 5.2.6 Fairness Status Tracking

```typescript
interface FairnessStatus {
  agreedRatio: [number, number];   // The calculated fair split
  actualRatio: [number, number];   // Real spending/saving behaviour
  isOnTrack: boolean;              // Whether actual matches agreed (within tolerance)
}
```

**Production enhancements:**
- Persist fairness settings to database
- Track actual contribution ratios from transaction data over time
- Show trend: "This month you're at 47/53 vs agreed 48/52 — on track"
- Historical fairness tracking with monthly snapshots

---

## 6. Data Models & API Contracts

### 6.1 Database Schema

**Source**: `shared/schema.ts` (Drizzle ORM + PostgreSQL via Neon serverless)

#### 6.1.1 Existing Tables (from demo schema)

**users**
| Column | Type | Constraints |
|--------|------|------------|
| id | varchar (UUID) | PK, auto-generated |
| username | text | NOT NULL, UNIQUE |
| password | text | NOT NULL |
| firstName | text | nullable |
| lastName | text | nullable |
| email | text | UNIQUE |
| createdAt | timestamp | DEFAULT now() |

**families**
| Column | Type | Constraints |
|--------|------|------------|
| id | varchar (UUID) | PK |
| name | text | NOT NULL |
| createdById | varchar | FK → users.id |
| createdAt | timestamp | DEFAULT now() |

**family_members**
| Column | Type | Constraints |
|--------|------|------------|
| id | varchar (UUID) | PK |
| familyId | varchar | FK → families.id, NOT NULL |
| userId | varchar | FK → users.id, NOT NULL |
| role | text | NOT NULL ("admin" / "member") |
| status | text | NOT NULL ("active" / "pending" / "removed") |
| joinedAt | timestamp | DEFAULT now() |

**family_invites**
| Column | Type | Constraints |
|--------|------|------------|
| id | varchar (UUID) | PK |
| familyId | varchar | FK → families.id, NOT NULL |
| email | text | NOT NULL |
| invitedBy | varchar | FK → users.id |
| status | text | NOT NULL, DEFAULT "pending" |
| token | text | NOT NULL, UNIQUE |
| expiresAt | timestamp | NOT NULL |
| createdAt | timestamp | DEFAULT now() |

**connected_accounts**
| Column | Type | Constraints |
|--------|------|------------|
| id | varchar (UUID) | PK |
| familyId | varchar | FK → families.id, NOT NULL |
| externalAccountId | text | NOT NULL (Yapily account ID) |
| ownershipType | text | NOT NULL ("individual" / "joint") |
| bankName | text | NOT NULL |
| accountType | text | NOT NULL |
| accountNumber | text | nullable (masked) |
| balance | decimal(10,2) | nullable |
| currency | text | DEFAULT "GBP" |
| status | text | NOT NULL, DEFAULT "connected" |
| lastSyncedAt | timestamp | nullable |
| createdAt | timestamp | DEFAULT now() |

**account_owners**
| Column | Type | Constraints |
|--------|------|------------|
| id | varchar (UUID) | PK |
| accountId | varchar | FK → connected_accounts.id, NOT NULL |
| userId | varchar | FK → users.id, NOT NULL |
| isPrimary | boolean | DEFAULT false |
| addedAt | timestamp | DEFAULT now() |

**transactions**
| Column | Type | Constraints |
|--------|------|------------|
| id | varchar (UUID) | PK |
| accountId | varchar | FK → connected_accounts.id, NOT NULL |
| familyId | varchar | FK → families.id, NOT NULL |
| description | text | NOT NULL |
| amount | decimal(10,2) | NOT NULL |
| category | text | NOT NULL |
| date | timestamp | NOT NULL |
| createdAt | timestamp | DEFAULT now() |

**goals**
| Column | Type | Constraints |
|--------|------|------------|
| id | varchar (UUID) | PK |
| familyId | varchar | FK → families.id, NOT NULL |
| name | text | NOT NULL |
| targetAmount | decimal(10,2) | NOT NULL |
| currentAmount | decimal(10,2) | DEFAULT 0 |
| targetDate | timestamp | NOT NULL |
| createdAt | timestamp | DEFAULT now() |

#### 6.1.2 Production Schema Additions

The following tables/columns should be added for production:

**connected_accounts** (new columns for Yapily consent):
| Column | Type | Purpose |
|--------|------|---------|
| consentToken | text | Yapily consent token (encrypted at rest) |
| consentExpiresAt | timestamp | 90-day PSD2 consent expiry |
| institutionId | text | Yapily institution identifier |

**transactions** (new columns for richer data):
| Column | Type | Purpose |
|--------|------|---------|
| externalTransactionId | text | Yapily transaction ID for deduplication |
| merchantName | text | Parsed merchant name |
| originalCategory | text | Yapily-provided category (immutable) |
| userCategory | text | User-overridden category |
| isRecurring | boolean | Detected recurring transaction flag |

**New table: fairness_settings**
| Column | Type | Purpose |
|--------|------|---------|
| id | varchar (UUID) | PK |
| familyId | varchar | FK → families.id |
| partner1UserId | varchar | FK → users.id |
| partner2UserId | varchar | FK → users.id |
| partner1Income | decimal | Gross annual income |
| partner2Income | decimal | Gross annual income |
| partner1UnpaidHours | integer | Weekly hours |
| partner2UnpaidHours | integer | Weekly hours |
| hourlyValue | decimal | £/hour for unpaid labour |
| agreedRatio | text | JSON "[48, 52]" |
| updatedAt | timestamp | Last modified |

**New table: notifications**
| Column | Type | Purpose |
|--------|------|---------|
| id | varchar (UUID) | PK |
| familyId | varchar | FK → families.id |
| userId | varchar | FK → users.id (recipient) |
| type | text | "goal" / "insight" / "account" / "family" |
| title | text | Notification headline |
| body | text | Detail text |
| isRead | boolean | DEFAULT false |
| createdAt | timestamp | DEFAULT now() |

**New table: insights**
| Column | Type | Purpose |
|--------|------|---------|
| id | varchar (UUID) | PK |
| familyId | varchar | FK → families.id |
| category | text | Transaction category this relates to |
| type | text | "explicit" / "increase" / "above_average" |
| headline | text | Short summary |
| body | text | Detailed explanation |
| metrics | jsonb | Key metrics array |
| savingsAmount | decimal | Monthly savings opportunity |
| isActioned | boolean | DEFAULT false |
| createdAt | timestamp | DEFAULT now() |

#### 6.1.3 Uniqueness Constraints (noted in demo schema comments)

```sql
UNIQUE (family_id, user_id) ON family_members
UNIQUE (family_id, external_account_id) ON connected_accounts
UNIQUE (account_id, user_id) ON account_owners
```

### 6.2 API Contract Specification

#### 6.2.1 Authentication

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | Create account (firstName, lastName, email, password) |
| POST | `/api/auth/login` | Authenticate (email, password) → session |
| POST | `/api/auth/logout` | Destroy session |
| GET | `/api/auth/me` | Get current user profile |

#### 6.2.2 Family Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/families` | Create family (name) |
| GET | `/api/families/:familyId` | Get family details |
| GET | `/api/families/:familyId/members` | List family members |
| POST | `/api/families/:familyId/invites` | Send invitation (email) |
| DELETE | `/api/families/:familyId/invites/:inviteId` | Cancel invitation |
| POST | `/api/families/join/:token` | Accept invitation |
| DELETE | `/api/families/:familyId/members/:userId` | Remove member |

#### 6.2.3 Accounts (Yapily-backed)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/institutions` | List available banks (proxy to Yapily) |
| POST | `/api/accounts/auth` | Create Yapily consent → return auth URL |
| GET | `/api/accounts/callback` | Handle Yapily auth callback |
| GET | `/api/accounts` | List connected accounts for family |
| POST | `/api/accounts/:accountId/refresh` | Re-sync account balance |
| DELETE | `/api/accounts/:accountId` | Disconnect account |
| POST | `/api/accounts/upload` | Upload investment statement |

#### 6.2.4 Transactions

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/transactions?timeline=&ownership=&search=` | Filtered transaction list |
| PATCH | `/api/transactions/:transactionId/category` | Recategorise transaction |
| POST | `/api/transactions/bulk-move` | Move multiple transactions to category |
| GET | `/api/transactions/categories` | List all categories (system + custom) |
| POST | `/api/transactions/categories` | Create custom category |

#### 6.2.5 Goals

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/goals` | List family goals |
| POST | `/api/goals` | Create goal |
| PUT | `/api/goals/:goalId` | Update goal |
| DELETE | `/api/goals/:goalId` | Delete goal |

#### 6.2.6 Insights & Coaching

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/insights` | List generated insights |
| GET | `/api/insights/:categoryId` | Get insight for specific category |
| POST | `/api/insights/:insightId/action` | Mark insight as actioned |
| POST | `/api/coaching/message` | Send message to coach, get response |
| GET | `/api/coaching/pathways` | Get goal pathways with steps |
| PATCH | `/api/coaching/pathways/:goalId/steps/:stepId` | Toggle step completion |

#### 6.2.7 Fairness

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/fairness` | Get current fairness settings |
| PUT | `/api/fairness` | Update fairness calculation |
| GET | `/api/fairness/status` | Get current vs agreed ratio |

#### 6.2.8 Notifications

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/notifications` | List notifications (with unread count) |
| PATCH | `/api/notifications/:id/read` | Mark as read |
| POST | `/api/notifications/read-all` | Mark all as read |
| DELETE | `/api/notifications/:id` | Remove notification |

### 6.3 Frontend Architecture

**Source**: `App.tsx`, component files

#### 6.3.1 Route Map

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Welcome → Dashboard | Onboarding or main view |
| `/dashboard` | Dashboard | Family financial overview |
| `/coaching` | Coaching | Goal pathways + chat coach |
| `/goals` | Goals | Goal management CRUD |
| `/accounts` | Accounts | Connected account management |
| `/family` | FamilyMembers | Family member management |
| `/insight-engine` | InsightEngineDemo | AI insight engine demo |

#### 6.3.2 Navigation

6 items in header nav bar:
- Dashboard (LayoutDashboard icon)
- Coaching (Sparkles icon)
- Goals (Target icon)
- Accounts (Building2 icon)
- Family (Users icon)
- AI Insights (Brain icon)

Header right section: NotificationBell, ThemeToggle (light/dark), UserProfileDropdown

#### 6.3.3 State Management

| Layer | Tool | Purpose |
|-------|------|---------|
| Server state | TanStack React Query | API data fetching, caching, sync |
| Form state | React Hook Form + Zod | Validated form inputs |
| Global state | React Context | FairnessContext (fairness data across pages) |
| Local state | React useState/useMemo | Component-level UI state |
| Theme | next-themes ThemeProvider | Light/dark mode persistence |

#### 6.3.4 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | HSL 220 85% 25% | Deep trust blue — buttons, links, active nav |
| Secondary | HSL 200 100% 45% | Accent blue — secondary elements |
| Success | HSL 142 76% 36% | Goal progress, positive amounts, savings |
| Warning | HSL 38 92% 50% | Cashflow alerts, needs refresh, caution |
| Destructive | HSL 0 84% 60% | Delete actions, errors, negative status |
| Heading font | Plus Jakarta Sans 700 | All headings |
| Body font | Inter 400/500/600 | All UI text |
| Financial numbers | tabular-nums | Aligned monetary values |

---

## 7. Roadmap & Success Metrics

### 7.1 Implementation Phases

#### Phase 1: Foundation (Current Priority)
- [ ] Yapily sandbox integration — institutions, auth, accounts, transactions
- [ ] Database persistence — migrate from in-memory to PostgreSQL
- [ ] Authentication — Passport.js session-based auth
- [ ] Core API endpoints — accounts, transactions, goals CRUD
- [ ] Replace mock data — dashboard fed by real Yapily transactions
- [ ] Transaction categorisation engine — auto-categorise with user override
- [ ] Consent management — track and refresh 90-day Yapily consents

#### Phase 2: Intelligence
- [ ] Insight generation pipeline — subscription detection, anomaly detection, cashflow forecasting
- [ ] Savings opportunity calculator — implement 3-tier priority system
- [ ] Notification engine — event-driven notifications for all trigger types
- [ ] Goal progress tracking — auto-update currentAmount from transaction analysis
- [ ] Category insight computation — replace static insights with calculated ones

#### Phase 3: Coaching & Personalisation
- [ ] LLM-powered financial coach — replace keyword matching with contextual AI
- [ ] Goal pathway generation — dynamic pathways based on actual spending data
- [ ] Emotional framing engine — stress-adaptive message delivery
- [ ] Fairness engine persistence — server-side storage with historical tracking
- [ ] Email invitation service — real invite emails with token-based acceptance

#### Phase 4: Family Ecosystem
- [ ] Multi-family support — users can belong to multiple families
- [ ] Role-based permissions — granular access control beyond admin/member
- [ ] Shared budgets — family-level budget targets per category
- [ ] Child accounts — age-appropriate financial visibility
- [ ] Financial education content — contextual learning tied to insights

#### Phase 5: Wealth Building
- [ ] Investment account tracking — portfolio monitoring from uploaded statements
- [ ] Retirement planning tools — long-term projections
- [ ] Tax optimisation insights — ISA allowance tracking, gift aid
- [ ] Direct bill payments — initiate payments via Yapily Payment API
- [ ] Smart savings rules — round-ups, auto-transfers based on rules

### 7.2 Success Metrics

#### Engagement Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Daily Active Users | 40% of registered | Unique daily logins |
| Accounts linked per user | 3+ | Average connected accounts |
| Insight interaction rate | 60%+ | Insights viewed / insights generated |
| Goal creation rate | 2+ per family | Goals created within first week |
| Coach conversation length | 5+ messages | Average messages per session |
| Transaction recategorisation | < 10% | Percentage of transactions users re-categorise (lower = better auto-categorisation) |

#### Financial Impact Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Average savings identified | £150/month | Sum of savings opportunities surfaced |
| Overdraft prevention rate | 80%+ | Cashflow alerts acted on before shortfall |
| Goal achievement rate | 70%+ | Goals reaching target by target date |
| Subscription savings | £30+/month | Actual cancellations following insights |

#### Product Quality Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Account sync reliability | 99.5%+ | Successful Yapily syncs / total attempts |
| Insight accuracy | 4.0+/5.0 | User rating of insight relevance |
| Time to value | < 5 minutes | Account link → first insight displayed |
| NPS score | 50+ | Quarterly survey |

### 7.3 Pricing Strategy (Proposed)

| Tier | Price | Features |
|------|-------|----------|
| **Free** | £0 | Basic account aggregation, 2 accounts, limited insights |
| **Family** | £9.99/month | Unlimited accounts + insights, goals, coaching, fairness engine |
| **Premium** | £19.99/month | AI investment recommendations, bill negotiation, financial advisor access |

### 7.4 Regulatory & Compliance

| Requirement | Status | Notes |
|-------------|--------|-------|
| FCA registration | Required | Account Information Service Provider (AISP) |
| PSD2 / UK Open Banking | Required | Strong Customer Authentication (SCA), 90-day consent |
| GDPR | Required | Data portability, right to deletion, consent management |
| Financial promotions | Required | Clear disclosure, no misleading projections |
| Security audits | Required | Annual penetration testing, SOC 2 Type II |

---

## Appendix A: Component File Reference

| Component | File Path | Primary Purpose |
|-----------|-----------|-----------------|
| App | `client/src/App.tsx` | Root router + providers |
| Welcome | `client/src/pages/Welcome.tsx` | Onboarding flow |
| Dashboard | `client/src/pages/Dashboard.tsx` | Main financial view |
| Goals | `client/src/pages/Goals.tsx` | Goal management |
| Accounts | `client/src/pages/Accounts.tsx` | Account management |
| Coaching | `client/src/pages/Coaching.tsx` | Financial coach |
| FamilyMembers | `client/src/pages/FamilyMembers.tsx` | Family management |
| InsightEngineDemo | `client/src/pages/InsightEngineDemo.tsx` | AI coaching demo |
| AccountLinkingFlow | `client/src/components/AccountLinkingFlow.tsx` | Multi-step bank linking |
| BalanceSummary | `client/src/components/BalanceSummary.tsx` | 5-card summary grid |
| TransactionGroups | `client/src/components/TransactionGroups.tsx` | Category accordion |
| CategoryInsightSheet | `client/src/components/CategoryInsightSheet.tsx` | Insight side panel |
| GoalCard | `client/src/components/GoalCard.tsx` | Goal display card |
| GoalForm | `client/src/components/GoalForm.tsx` | Goal create/edit form |
| AuthForm | `client/src/components/AuthForm.tsx` | Login/signup form |
| StatementUpload | `client/src/components/StatementUpload.tsx` | PDF/CSV upload |
| FairnessCalculatorModal | `client/src/components/FairnessCalculatorModal.tsx` | Fairness calculation |
| NotificationBell | `client/src/components/NotificationBell.tsx` | Notification dropdown |
| LoadingTransition | `client/src/components/LoadingTransition.tsx` | Onboarding loader |
| FairnessContext | `client/src/context/FairnessContext.tsx` | Global fairness state |
| Schema | `shared/schema.ts` | Database models + types |
| Server | `server/index.ts` | Express server entry |
| Storage | `server/storage.ts` | Data persistence interface |
| Database | `server/db.ts` | Neon PostgreSQL connection |

---

**Document Version**: 2.0
**Derived From**: EnvisDemo codebase (commit history: b5c18e6)
**Next Review**: April 2026

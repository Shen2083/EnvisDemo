# Envis Product Requirements Document (PRD)

## Executive Summary

**Product Name**: Envis  
**Tagline**: Your family's financial partner  
**Version**: 1.0 (Interactive Demo)  
**Last Updated**: October 3, 2025

Envis is an intelligent family financial management platform that proactively coordinates goals, prevents financial stress, and builds collective wealth. Unlike traditional finance apps that simply track spending, Envis acts as a financial coach—anticipating needs, identifying opportunities, and helping families make better financial decisions together.

## Problem Statement

Modern families face several critical financial challenges:

1. **Fragmented Financial Picture**: Money is spread across multiple accounts (joint accounts, personal accounts, credit cards) making it impossible to see the complete picture
2. **Reactive Management**: Families only discover issues when it's too late (overdrafts, missed payments, budget overruns)
3. **Missed Opportunities**: Without intelligent analysis, families don't realize potential savings from subscription consolidation, spending pattern changes, or investment opportunities
4. **Coordination Challenges**: Multiple family members making financial decisions without visibility into the bigger picture
5. **Goal Misalignment**: Individual spending decisions undermining collective family financial goals

## Product Vision

Envis transforms family financial management from a reactive chore into a proactive partnership. By aggregating all financial data, applying intelligent analysis, and providing actionable insights, Envis helps families:

- Maintain a unified view of their complete financial picture
- Avoid financial stress through proactive alerts and recommendations
- Identify and capitalize on savings opportunities
- Coordinate spending and saving toward shared family goals
- Build long-term wealth through smarter financial decisions

## Target Users

### Primary Persona: The Family Financial Coordinator
- Age: 30-50
- Role: Primary financial decision-maker in household
- Pain Points:
  - Struggles to track spending across multiple family accounts
  - Worries about unexpected shortfalls or overdrafts
  - Wants to save more but doesn't know where money is going
  - Needs to coordinate finances with partner/spouse
  - Has family financial goals but struggles to track progress

### Secondary Persona: The Partner/Spouse
- Age: 30-50
- Role: Joint decision-maker, may have separate accounts
- Pain Points:
  - Limited visibility into household finances
  - Wants to contribute to family goals
  - Needs awareness of spending patterns affecting family budget

## Core Features (Implemented in Demo)

### 1. Open Banking Account Linking

**User Value**: Securely connect all family financial accounts in one place

**Implementation**:
- Bank selection interface with major UK banks (Monzo, Starling, Revolut, Lloyds, HSBC, etc.)
- Account type selection (Joint Account, Personal Account, Business Account, Credit Card)
- OAuth-based secure authentication (simulated in demo)
- Multi-account aggregation from multiple institutions
- Real-time balance synchronization

**User Flow**:
1. User clicks "Connect My First Account"
2. Selects their bank from visual grid
3. Authenticates via Open Banking (simulated)
4. Selects which accounts to link
5. Confirms and sees success confirmation
6. Views unified dashboard with all linked accounts

### 2. Unified Family Dashboard

**User Value**: Single view of complete family financial picture with intelligent transaction categorization

**Implementation**:
- **Total Family Balance**: Aggregated balance across all linked accounts
- **Monthly Net Flow**: Income vs spending with visual indicator
- **Active Goals Counter**: Quick view of goals in progress
- **Transaction Grouping by Category**: 
  - Accordion-based expandable categories (Groceries, Eating Out, Entertainment, Transport, etc.)
  - Real-time category totals with month-over-month comparison
  - Transaction count per category
  - Visual trend indicators (up/down spending)
- **Timeline Filtering**: View transactions by period
  - Current Month
  - Previous Month
  - Current + Previous Month (default for better data visibility)
  - Last 3 Months
  - Last 6 Months
  - Year to Date
  - Last 2 Years
- **Transaction Management**:
  - Search across all transactions
  - Select individual transactions with checkboxes
  - Bulk move transactions between categories
  - Custom category creation with duplicate handling
- **Amount Formatting**:
  - Income: Positive values (+£2,500) in green
  - Spending: Negative values (-£165.40) in standard text

**User Flow**:
1. User completes account linking
2. Loading transition with progress indicators:
   - "Syncing your accounts..." (1.5s)
   - "Analyzing transactions..." (1.5s)
   - "Building your dashboard..." (1.2s)
3. Dashboard displays with categorized transactions
4. User can filter timeline, search, and manage categories
5. Click category to expand and view transaction details
6. Select transactions and move between categories as needed

### 3. Smart Financial Insights

**User Value**: Proactive recommendations to prevent financial stress and identify opportunities

**Implementation**:

**Insight Types**:
1. **Cashflow Alerts**: Low balance warnings before payments due
2. **Subscription Optimization**: Identify duplicate or unnecessary subscriptions
3. **Spending Pattern Analysis**: Unusual spending detection
4. **Goal Progress**: Celebrate achievements, warn about delays

**Intelligent Savings Opportunity Detection** (Priority-based):

1. **Explicit Opportunities** (Priority 1):
   - Identified from insight analysis (e.g., "consolidate 3 streaming services")
   - Shows "Potential Savings" metric
   - Label: "Monthly Savings"
   - Message: "If you saved this amount for a year, here's what it could grow to:"

2. **Spending Increases from Last Month** (Priority 2):
   - Compares current month vs last month spending
   - Only triggers if spending increased
   - Label: "Monthly Excess"
   - Message: "By avoiding this increase from last month, here's what you could save in a year:"
   - Example: Groceries £165 vs £147 last month = £18 increase opportunity

3. **Spending Above Average** (Priority 3):
   - Compares current month vs monthly average
   - Only triggers if spending above baseline
   - Label: "Monthly Excess"
   - Message: "By avoiding this spending above average, here's what you could save in a year:"
   - Example: Eating Out £152 vs £112 average = £40 opportunity

**Yearly Growth Projections**:
- Monthly amount (excess or identified savings)
- Yearly Total (12 months)
- Index Fund Growth (8% annual return)
- Savings Account Interest (4.5% annual rate)
- Color-coded green for growth values

**Category Insights**:
- Available via "View Insights" button on each category
- Opens side panel (Sheet) with detailed analysis
- Shows summary metrics, smart insights, and savings opportunities
- Context-aware messaging based on detection method

**User Flow**:
1. User views dashboard with insight indicators
2. Clicks "View Insights" on category card
3. Side panel opens with:
   - Category summary (total spend, transactions, trends)
   - Smart insight with headline and detailed explanation
   - Key metrics relevant to the insight
   - Savings Opportunity section (if applicable) with yearly projections
4. User reviews recommendations and can take action
5. Close panel and view other category insights

### 4. Collaborative Goal Management

**User Value**: Track shared family financial goals with visual progress indicators

**Implementation**:
- **Goal Creation**: 
  - Goal name (e.g., "House Deposit", "Family Holiday")
  - Target amount
  - Target date
  - Automatic monthly contribution calculator
- **Goal Tracking**:
  - Current savings amount
  - Progress percentage with visual bar
  - Days remaining counter
  - On track / Behind indicators
- **CRUD Operations**:
  - Create new goals with form validation
  - Edit existing goals with pre-filled data
  - Delete goals with confirmation dialog
  - Real-time progress updates

**User Flow**:
1. User navigates to Goals page
2. Views existing goals with progress indicators
3. Can add new goal with target and date
4. Edit goal details as circumstances change
5. Delete goals when completed or no longer relevant
6. Insights page shows goal-related recommendations

### 5. Account Management

**User Value**: Full control over connected bank accounts and synchronization

**Implementation**:
- **Account List View**:
  - Bank name and logo
  - Account type and balance
  - Connection status (Connected, Needs Refresh, Error)
  - Last sync timestamp
- **Account Actions**:
  - Refresh connection (simulated re-authentication)
  - Add new accounts (returns to linking flow)
  - Remove accounts with confirmation
- **Status Indicators**:
  - Green checkmark: Connected and synced
  - Warning icon: Needs refresh
  - Error icon: Connection issue

**User Flow**:
1. User navigates to Accounts page
2. Views all connected accounts with statuses
3. Can refresh individual account connections
4. Add additional accounts from other banks
5. Remove accounts no longer needed
6. System updates dashboard when accounts change

## Technical Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast dev server and optimized builds)
- **Routing**: Wouter (lightweight client-side routing)
- **UI Components**: Radix UI primitives + shadcn/ui design system
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: 
  - React Query (TanStack) for server state
  - React hooks for local state
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for polished transitions

### Design System
- **Typography**: 
  - Inter for UI elements
  - Plus Jakarta Sans for headings
- **Color Palette**:
  - Primary: Deep trust blue (HSL 220 85% 25%)
  - Success, Warning, Error states for financial feedback
  - Dark mode support throughout
- **Component Patterns**:
  - Elevation states on hover/active
  - Consistent border radius and spacing
  - Tabular number formatting for financial data
  - Accessible color contrasts (WCAG AA)

### Backend Architecture (Demo Simulation)
- **Current**: "Wizard of Oz" approach with in-memory mock data
- **Prepared For**: 
  - Express.js API server
  - PostgreSQL database (Neon serverless)
  - Drizzle ORM for type-safe database operations
  - Session-based authentication
  - Open Banking API integration (Plaid or TrueLayer)

### Data Models
- **Users**: Authentication and profile data
- **Accounts**: Bank account connections and balances
- **Transactions**: Categorized financial transactions
- **Categories**: User-defined and system categories
- **Goals**: Family savings goals with targets
- **Insights**: AI-generated financial recommendations

## User Experience Principles

### 1. Trust & Security
- FCA-compliant Open Banking integration
- Secure credential handling
- Clear privacy communications
- No data shared without explicit consent

### 2. Proactive Intelligence
- Insights appear before problems occur
- Recommendations are specific and actionable
- Context-aware messaging based on spending patterns
- Celebrates successes, not just warnings

### 3. Family-First Design
- Unified view of all family accounts
- Collaborative goal tracking
- Shared insights benefit entire household
- Respectful of individual and joint finances

### 4. Clarity & Simplicity
- Plain language, no financial jargon
- Visual indicators over numbers
- Progressive disclosure (details on demand)
- Consistent patterns throughout

### 5. Delightful Interactions
- Smooth animations and transitions
- Immediate feedback on actions
- Loading states with progress indicators
- Polished micro-interactions

## Success Metrics

### Engagement Metrics
- Daily Active Users (DAU)
- Number of accounts linked per user
- Insight interaction rate (views, actions taken)
- Goal creation and completion rates
- Transaction recategorization frequency

### Financial Impact Metrics
- Average savings identified per user per month
- Percentage of users avoiding overdrafts
- Goal achievement rate
- Subscription cancellations following insights
- Average amount saved through identified opportunities

### Product Quality Metrics
- Account sync reliability (uptime %)
- Insight accuracy and relevance (user ratings)
- Time to value (account link to first insight)
- Feature adoption rates
- User satisfaction (NPS score)

## Future Roadmap Considerations

### Phase 2: Enhanced Intelligence
- AI-powered spending predictions
- Personalized budget recommendations
- Automated bill negotiation
- Smart savings rules (round-ups, auto-transfers)

### Phase 3: Deeper Integration
- Direct bill payments from app
- Investment account integration
- Mortgage and loan tracking
- Tax optimization insights

### Phase 4: Family Ecosystem
- Child accounts with spending limits
- Financial education content
- Shared shopping lists with budget tracking
- Family member permissions and roles

### Phase 5: Wealth Building
- Investment recommendations
- Retirement planning tools
- Estate planning integration
- Financial advisor marketplace

## Competitive Differentiation

### vs. Traditional Banking Apps
- Multi-institution aggregation (not just one bank)
- Intelligent insights (not just transaction history)
- Family-focused (not individual-only)

### vs. Budgeting Apps (Mint, YNAB)
- Proactive alerts (not reactive tracking)
- Collaborative features (not solo management)
- Growth projections (not just spending categories)

### vs. Investment Apps (Nutmeg, Wealthify)
- Complete financial picture (not just investments)
- Day-to-day management (not just long-term)
- Family coordination (not just personal wealth)

## Design Specifications

### Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### Color System (HSL)
- Primary: 220 85% 25%
- Background: 0 0% 100% (light) / 220 15% 10% (dark)
- Foreground: 220 15% 10% (light) / 0 0% 100% (dark)
- Success: 142 76% 36%
- Warning: 38 92% 50%
- Destructive: 0 84% 60%

### Typography Scale
- Headings: Plus Jakarta Sans (700 weight)
- Body: Inter (400, 500, 600 weights)
- Sizes: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px

### Spacing System
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px

## Demo Limitations & Production Considerations

### Current Demo Limitations
1. **Static Mock Data**: Transactions from September 2025
2. **Simulated APIs**: No real Open Banking integration
3. **In-Memory Storage**: Data resets on refresh
4. **Single User**: No multi-user authentication
5. **No Persistence**: Changes don't survive browser reload

### Production Requirements
1. **Open Banking Integration**:
   - FCA authorization and compliance
   - Plaid or TrueLayer API integration
   - Secure token management
   - Multi-institution support

2. **Data Infrastructure**:
   - PostgreSQL database with proper schema
   - Database migrations and versioning
   - Backup and disaster recovery
   - GDPR-compliant data handling

3. **Authentication & Security**:
   - OAuth 2.0 implementation
   - Session management
   - Role-based access control
   - Encryption at rest and in transit

4. **AI/ML Pipeline**:
   - Transaction categorization model
   - Insight generation engine
   - Anomaly detection algorithms
   - Personalization system

5. **Scalability**:
   - Load balancing
   - Caching strategy (Redis)
   - Database optimization
   - CDN for static assets

6. **Monitoring & Analytics**:
   - Error tracking (Sentry)
   - Performance monitoring (New Relic)
   - User analytics (Mixpanel)
   - A/B testing framework

## Regulatory & Compliance

### Open Banking Compliance
- FCA registration required
- PSD2 compliance (EU) / Open Banking Standards (UK)
- Strong Customer Authentication (SCA)
- Regular security audits

### Data Protection
- GDPR compliance (data portability, right to deletion)
- Secure data storage and transmission
- Clear privacy policy and terms of service
- User consent management

### Financial Services
- Clear disclosure of fees (if applicable)
- Transparent data usage policies
- Complaint handling procedures
- Financial promotions compliance

## Go-to-Market Strategy

### Target Market
- **Geography**: UK initially (Open Banking maturity)
- **Segment**: Families with £40k+ household income
- **Size**: 8M UK households (estimated addressable market)

### Pricing Strategy (Proposed)
- **Free Tier**: Basic account aggregation, limited insights
- **Family Plan** (£9.99/month): 
  - Unlimited accounts and insights
  - Collaborative goals
  - Priority support
- **Premium** (£19.99/month):
  - AI investment recommendations
  - Bill negotiation service
  - Financial advisor access

### Launch Phases
1. **Beta** (3 months): Invite-only, 1,000 families
2. **Soft Launch** (6 months): UK market, organic growth
3. **Marketing Push** (12 months): Paid acquisition campaigns
4. **Expansion** (18+ months): Additional markets (EU, US)

## Conclusion

Envis represents a fundamental shift in family financial management—from reactive tracking to proactive partnership. The interactive demo validates core user flows and proves the value proposition. With proper production implementation, regulatory compliance, and go-to-market execution, Envis has the potential to become the essential financial operating system for modern families.

The technology foundation is solid, the user experience is polished, and the problem we're solving is real and pressing. The next step is to transform this compelling demo into a production-ready platform that can serve millions of families in building better financial futures together.

---

**Document Version**: 1.0  
**Last Updated**: October 3, 2025  
**Next Review**: November 2025

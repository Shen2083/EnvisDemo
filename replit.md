# Envis Interactive Demo

## Overview

Envis is an intelligent financial coach for families, designed to coordinate financial goals, prevent stress, and build collective wealth. This interactive demo showcases core product features to stakeholders, utilizing a "Wizard of Oz" methodology where the front-end is fully functional and polished, backed by mock data and simulated responses.

The demo covers five key experiences:
- Onboarding & Account Linking
- Dashboard View with unified family finances
- Financial Coach providing conversational, intelligent guidance
- Goal Management for shared family goals
- Account Management for connected bank accounts

## Recent Changes (October 2025)

### Watermark Applied to All Application Screens (October 29, 2025)
Extended the watermark pattern to appear throughout the entire application:

**Implementation**:
- Created reusable `Watermark` component in `client/src/components/Watermark.tsx`
- Applied watermark to all main app screens via Router component in `client/src/App.tsx`
- Watermark also appears on landing page via `WelcomeHero.tsx`

**Visual Design**:
- Text: "MVP prototype built by Shenbagaraja Vanamamalai"
- Diagonal strips rotated 45 degrees across the screen
- 10% opacity for subtle, professional appearance
- Repeating pattern (18 rows × 10 columns) covering full background
- Fixed positioning with `pointer-events-none` ensures no interference with interactions

**Coverage**:
- Landing page (welcome screen)
- Dashboard
- Financial Coach (Coaching page)
- Goals
- Accounts
- Family Members

**Rationale**:
- Provides consistent professional watermarking across entire demo experience
- Clearly identifies prototype status to stakeholders
- Non-intrusive design maintains full readability and usability of all features

### Statement Upload for Investment Accounts & Premium Bonds (October 11, 2025)
Added statement upload capability for account types not supported by Open Banking:

**Statement Upload Feature**:
- Upload PDF or CSV statements for investment accounts and premium bonds
- Form fields: Account type, provider/institution, account name, current balance, statement file
- Two account types supported:
  - **Investment Accounts**: For stocks, shares, ISAs (TrendingUp icon)
  - **Premium Bonds**: For NS&I Premium Bonds (Landmark icon)

**Onboarding Integration**:
- Added "Add Investment Accounts" option to onboarding success screen
- New upload statements step appears after bank account linking
- Users can upload multiple statements or skip to dashboard
- "Back to Summary" button allows navigation between screens without losing data
- Button text changes from "Skip for Now" to "Continue to Dashboard" when accounts are uploaded

**Account Display**:
- Uploaded accounts shown separately from Open Banking connected accounts (both in onboarding and Accounts page)
- Shows provider, account name, balance, upload date, and filename
- "Statement Upload" badge to distinguish from automatically synced accounts
- Remove functionality with confirmation dialog

**Rationale**:
- Open Banking infrastructure doesn't currently support investment accounts or premium bonds
- Manual statement upload provides workaround until API support is available
- Integration into onboarding ensures users can add all accounts at the start
- Keeps all family finances visible in one unified dashboard

### Notification System Replaces Insights Tab (October 5, 2025)
Removed the standalone Insights tab and replaced it with a notification bell in the header:

**Notification Bell Component**:
- Bell icon in header with unread count badge
- Dropdown popover showing recent alerts and updates
- Four notification types with distinct icons and colors:
  - **Goal updates**: Target icon (chart-3 color)
  - **Dashboard insights**: Lightbulb icon (chart-1 color)
  - **Account changes**: Building2 icon (chart-2 color)
  - **Family updates**: Users icon (chart-4 color)

**Notification Features**:
- Click notification to mark as read (unread indicator dot)
- "Mark all read" button for bulk actions
- Remove individual notifications with X button (visible on hover)
- Empty state display when no notifications exist
- Smooth interactions using shadcn Popover primitives

**Rationale**:
- Insights are better served contextually within Dashboard's category breakdowns
- Notification system provides a central hub for alerts across all features
- Reduces navigation complexity while improving information density

### Financial Coach Redesign with Smart Insights Integration
Redesigned the Financial Coach page to provide a more interactive, goal-focused coaching experience with intelligent connections to insights:

**Two-Column Interactive Layout**:
- **Left Column (3fr)**: Goal accordion cards showing progress summaries. When expanded, reveals detailed pathway steps with checkboxes.
- **Right Column (2fr)**: Conversational chat interface for meaningful dialogue about recommendations.

**Four Family Financial Goals**:
- **House Deposit**: £20,000 target - accelerate by optimizing eating out spending
- **Family Holiday**: £5,000 target - on track 3 months ahead of schedule
- **Emergency Fund**: £9,000 target - critical safety net to prevent cashflow issues
- **Kids Education Fund**: £15,000 target - long-term savings with compound growth

**Smart Connections Between Insights and Goals**:
- Visual indicators show which goals have related insights (lightbulb badge with count)
- "Connected Insights" section appears when goals are expanded
- Goals explicitly link to relevant insights:
  - House Deposit → Eating out spending alert
  - Emergency Fund → Cashflow alert + Subscription consolidation
- Coach responses reference specific insights with exact numbers (£700 shortage, £35/month savings)
- Insights page updated to reference goals, creating bidirectional connections
- Dashboard balance summary shows accurate counts: 4 active goals, 6 insights
- Dashboard category insights reference related goals:
  - Eating Out insight mentions "House Deposit goal by 11 months"
  - Entertainment insight mentions "Emergency Fund" and "£35/month savings"
- "Connected Goal" metric added to category insight side panel

**Goal-Specific Quick Replies**:
- Persistent quick reply buttons that remain visible when a goal is active
- Different suggested questions per goal:
  - **House Deposit**: "Why eating out?", "Timeline details?", "Alternatives?"
  - **Family Holiday**: "Timeline?", "Booking tips?", "Increase savings?"
  - **Emergency Fund**: "Cashflow alert?", "Use subscription savings?", "How to build?"
  - **Kids Education**: "Timeline?", "Junior ISA?", "Increase contributions?"
- Quick replies trigger contextual coach responses based on active goal

**Wizard-of-Oz Chat System**:
- Keyword-based response matching for intelligent, goal-aware conversations
- Context messages when goals are expanded
- Smooth chat flow with user messages (primary color) and coach messages (muted)
- Responses echo specific insight details to reinforce connections

**Technical Implementation**:
- Fixed async state issue: Quick replies pass messages directly to avoid stale React state
- Conditional rendering of goal-specific quick replies based on `activeGoalId`
- Chat history maintains conversation flow across goal switches
- Goals have `relatedInsights` field for smart linking
- Visual indicators use Badge component with Lightbulb icon

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite.
**Routing**: Wouter for client-side routing.
**UI Component System**: Radix UI primitives with shadcn/ui styling, blending fintech aesthetics (Monzo, Starling, Revolut) with Material Design.
**Design System**:
- **Typography**: Inter (UI) and Plus Jakarta Sans (headings).
- **Color Palette**: Deep trust blue primary with financial feedback colors.
- **Theme Support**: Light and dark modes using CSS custom properties and Tailwind CSS.
- **Component Patterns**: Consistent hover/active states, border radius, tabular number formatting.
**State Management**: React Query for server state, React hooks for local state.
**Form Handling**: React Hook Form with Zod validation.
**Styling**: Tailwind CSS with custom design tokens.

### Backend Architecture

**Server Framework**: Express.js on Node.js.
**Development Strategy**: "Wizard of Oz" approach using in-memory mock data instead of live AI or real financial data.
**Storage Interface**: Abstract `IStorage` with `MemStorage` for easy transition to persistent storage.
**API Structure**: RESTful endpoints prefixed with `/api`.
**Build Process**: Vite for frontend, esbuild for backend.

### Data Storage

**Database**: PostgreSQL via Neon serverless (for production readiness); demo uses in-memory storage.
**ORM**: Drizzle ORM with TypeScript-first schema.
**Schema Management**: Drizzle Kit for migrations.
**Type Safety**: Zod schemas generated from Drizzle schemas.

### Authentication & Authorization

**Current Implementation**: Basic user schema with signup/login UI flows; authentication not yet enforced.
**Planned Approach**: Session-based authentication using Express sessions backed by PostgreSQL.

## External Dependencies

### UI Component Library
- **Radix UI**: Unstyled, accessible component primitives.
- **shadcn/ui**: Design system built on Radix with Tailwind styling.
- **lucide-react**: Icon library.
- **cmdk**: Command menu component.

### Data Fetching & State
- **TanStack React Query**: Server state management.
- **date-fns**: Date manipulation and formatting.

### Forms & Validation
- **React Hook Form**: Form state management.
- **Zod**: Schema validation.
- **@hookform/resolvers**: Bridge between React Hook Form and Zod.

### Styling
- **Tailwind CSS**: Utility-first CSS framework.
- **class-variance-authority**: Type-safe variant management.
- **tailwindcss-animate**: Animation utilities.

### Database & Backend
- **Neon Serverless PostgreSQL**: Cloud-native PostgreSQL.
- **Drizzle ORM**: TypeScript ORM.
- **connect-pg-simple**: PostgreSQL session store for Express.

### Open Banking Integration (Planned)
The demo is designed to integrate with Open Banking API providers (Plaid or TrueLayer sandbox) for secure bank account connection, transaction data retrieval, and real-time balance updates. The current demo simulates this with static mock data.

### Development Tools
- **Vite**: Fast development server and build tool.
- **esbuild**: JavaScript bundler for server code.
- **TypeScript**: Type safety.
- **@replit/vite-plugin-***: Replit-specific development enhancements.
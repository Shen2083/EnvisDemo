# Envis Interactive Demo

## Overview

Envis is your family's financial partner—an intelligent financial coach that proactively coordinates goals, prevents financial stress, and builds collective wealth. This is a high-fidelity interactive demo built to showcase core product features to stakeholders using a "Wizard of Oz" methodology—the front-end experience is fully functional and polished, while the back-end uses mock data and simulated responses rather than production AI systems.

The demo guides users through five key experiences:
1. **Onboarding & Account Linking** - Secure bank account connection via Open Banking
2. **Dashboard View** - Unified family financial overview with transaction feeds across all accounts
3. **Goal Management** - Create, edit, and delete shared family financial goals with progress tracking
4. **Smart Insights** - Proactive financial recommendations with detailed review screens and actionable next steps
5. **Account Management** - View, refresh, add, and remove connected bank accounts

## Recent Updates

**October 3, 2025**
- Redesigned Dashboard with transaction grouping by category
- Added accordion-based category view with expandable transaction tables
- Implemented transaction selection and bulk move functionality between categories
- Category-level insights now display in side panel (Sheet component) instead of full page
- Real-time category totals update after transactions are moved
- Amount formatting: Income shows positive (+£2500) in green, spending negative (-£165.40)
- Fixed "View Insights" button alignment using CSS Grid layout for consistent column positioning
- Added custom category creation feature - users can now create new categories via dialog form
- Implemented duplicate category name handling with automatic ID suffix generation
- Added yearly savings potential projections showing index fund (8% return) and savings account (4.5% interest) growth for potential savings
- Added timeline filter for transactions with 7 options: current month, previous month, current + previous, last 3/6 months, year to date, last 2 years
- Implemented polished loading transition with animated progress indicators when moving from account linking to dashboard

**October 2, 2025**
- Updated messaging to match envis.money brand (focus on problems solved vs. AI features)
- Added full CRUD for Goals: create, edit, delete with confirmation dialogs
- Created Insight Detail view with data breakdowns and actionable recommendations
- Built Connected Accounts page with refresh, add, and remove functionality
- All interactive elements include proper test IDs for end-to-end testing

## User Preferences

Preferred communication style: Simple, everyday language.

## Key Features Implemented

### 1. Account Management (/accounts)
- View all connected bank accounts with balances, statuses, and sync times
- Refresh account connections with loading states
- Add new accounts via Open Banking flow
- Remove accounts with confirmation dialogs
- Status indicators: Connected, Needs Refresh, Connection Error

### 2. Goal Management (/goals)
- Create new family savings goals with target amounts and dates
- Edit existing goals with pre-filled forms
- Delete goals with confirmation
- Automatic monthly contribution calculator
- Progress tracking with visual indicators

### 3. Smart Insights (/insights)
- Four insight types: cashflow, subscriptions, spending, goal progress
- Click any insight for detailed review screen
- Data breakdowns with specific recommendations
- "Take Action" and "Dismiss" functionality
- Color-coded by insight type

### 4. Dashboard (/dashboard)
- Unified balance summary across all family accounts
- Transaction grouping by category with accordion view
- Expandable categories showing transaction tables with selection checkboxes
- Bulk transaction actions: select and move transactions between categories
- Create custom categories with dialog form (automatically handles duplicate names)
- Category-level insights accessible via side panel (Sheet component)
- Real-time category totals with month-over-month comparisons
- Timeline filter: View transactions by current month, previous month, current + previous, last 3/6 months, year to date, or last 2 years
- Search functionality across all transactions
- Amount formatting with proper signs: Income positive (+£2500) in green, spending negative (-£165.40)
- Grid-based layout ensures consistent alignment of View Insights buttons and amounts

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for client-side routing—a lightweight alternative to React Router suitable for single-page applications.

**UI Component System**: Radix UI primitives with shadcn/ui styling patterns. The design follows a hybrid approach combining modern fintech aesthetics (inspired by Monzo, Starling, Revolut) with Material Design principles for trust and consistency.

**Design System**:
- **Typography**: Inter (UI) and Plus Jakarta Sans (headings) for a balance of professionalism and approachability
- **Color Palette**: Deep trust blue primary (220 85% 25%), with success/warning/error colors for financial feedback
- **Theme Support**: Light and dark modes with CSS custom properties and Tailwind CSS
- **Component Patterns**: Hover and active elevation states, consistent border radius, tabular number formatting for financial data

**State Management**: React Query (@tanstack/react-query) for server state management and caching. Local component state managed with React hooks.

**Form Handling**: React Hook Form with Zod schema validation via @hookform/resolvers.

**Styling**: Tailwind CSS with custom design tokens defined in CSS variables. The configuration uses HSL color space for dynamic theming.

### Backend Architecture

**Server Framework**: Express.js running on Node.js.

**Development Strategy**: Currently implements a "Wizard of Oz" approach where the UI is fully functional but backend services use mock data stored in-memory rather than live AI processing or real financial data aggregation.

**Storage Interface**: Abstract storage layer (`IStorage`) with in-memory implementation (`MemStorage`). This allows easy transition to persistent database storage without changing application logic.

**API Structure**: RESTful endpoints prefixed with `/api`. The routes module (`server/routes.ts`) is prepared for expansion but currently minimal as demo uses client-side mock data.

**Session Management**: Infrastructure includes connect-pg-simple for PostgreSQL-backed sessions (not yet fully implemented in demo).

**Build Process**: 
- Frontend: Vite builds optimized production bundle
- Backend: esbuild bundles server code for deployment
- Separate dev and production modes with hot module reloading in development

### Data Storage

**Database**: PostgreSQL via Neon serverless (@neondatabase/serverless) for production readiness, though demo currently uses in-memory storage.

**ORM**: Drizzle ORM with TypeScript-first schema definition. Schema includes user authentication foundation with extensibility for financial data models.

**Schema Management**: Drizzle Kit for migrations and schema synchronization. Schema defined in `shared/schema.ts` for type sharing between client and server.

**Type Safety**: Zod schemas generated from Drizzle schemas (drizzle-zod) ensure runtime validation matches compile-time types.

### Authentication & Authorization

**Current Implementation**: Basic user schema with username/password fields. Demo includes signup/login UI flows but authentication is not yet enforced.

**Planned Approach**: Session-based authentication using Express sessions backed by PostgreSQL. User credentials will be hashed (infrastructure ready but not implemented in demo).

**Security Considerations**: Prepared for FCA-regulated Open Banking integration with secure credential handling and consent management.

## External Dependencies

### UI Component Library
- **Radix UI**: Unstyled, accessible component primitives (@radix-ui/react-*)
- **shadcn/ui**: Design system built on Radix with Tailwind styling
- **lucide-react**: Icon library for consistent iconography
- **cmdk**: Command menu component for search/navigation

### Data Fetching & State
- **TanStack React Query**: Server state management, caching, and synchronization
- **date-fns**: Date manipulation and formatting for financial data

### Forms & Validation
- **React Hook Form**: Form state management with performance optimization
- **Zod**: Schema validation for forms and API data
- **@hookform/resolvers**: Bridge between React Hook Form and Zod

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management for components
- **tailwindcss-animate**: Animation utilities

### Database & Backend
- **Neon Serverless PostgreSQL**: Cloud-native PostgreSQL (@neondatabase/serverless)
- **Drizzle ORM**: TypeScript ORM with full type inference
- **connect-pg-simple**: PostgreSQL session store for Express

### Open Banking Integration (Planned)
The demo is designed to integrate with Open Banking API providers (Plaid or TrueLayer sandbox) for:
- Secure bank account connection
- Transaction data retrieval
- Real-time balance updates
- Multi-institution aggregation

**Note**: Current demo simulates this with static mock data and UI flows. Production implementation will use actual Open Banking APIs with proper FCA compliance.

### Development Tools
- **Vite**: Fast development server and build tool
- **esbuild**: JavaScript bundler for server code
- **TypeScript**: Type safety across full stack
- **@replit/vite-plugin-***: Replit-specific development enhancements (error overlay, cartographer, dev banner)

### Asset Management
Images stored in `attached_assets/` directory, including generated UI mockups and design references accessed via `@assets` path alias.
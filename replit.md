# Envis Interactive Demo

## Overview

Envis is an intelligent financial coach for families, designed to coordinate financial goals, prevent stress, and build collective wealth. This interactive demo showcases core product features to stakeholders using a "Wizard of Oz" methodology with a fully functional front-end backed by mock data.

Key capabilities include:
- Onboarding & Account Linking
- Unified family financial dashboard
- Conversational, intelligent financial coaching
- Shared family goal management
- Connected account management
- Insight Engine for AI-driven notifications and emotional framing
- Fairness Engine to calculate financial contributions valuing unpaid labor

The project aims to demonstrate a cohesive financial management platform that promotes family well-being and wealth building.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite.
- **Routing**: Wouter for client-side routing.
- **UI Component System**: Radix UI primitives with shadcn/ui styling, drawing inspiration from fintech aesthetics (Monzo, Starling, Revolut) and Material Design.
- **Design System**: Inter and Plus Jakarta Sans typography, deep trust blue primary color palette, light/dark mode support, consistent component patterns.
- **State Management**: React Query for server state, React hooks for local state.
- **Form Handling**: React Hook Form with Zod validation.
- **Styling**: Tailwind CSS with custom design tokens.
- **UI/UX Decisions**: Watermark applied across all screens for prototype identification, bank-grade secure but friendly aesthetic with warm, non-aggressive color schemes (Pastel Orange, Soft Blue).

### Backend Architecture
- **Server Framework**: Express.js on Node.js.
- **Development Strategy**: "Wizard of Oz" approach using in-memory mock data to simulate AI and real financial data.
- **Storage Interface**: Abstract `IStorage` with `MemStorage` for future persistent storage integration.
- **API Structure**: RESTful endpoints prefixed with `/api`.
- **Build Process**: Vite for frontend, esbuild for backend.

### Data Storage
- **Database**: PostgreSQL via Neon serverless (production readiness); demo uses in-memory storage.
- **ORM**: Drizzle ORM with TypeScript-first schema.
- **Schema Management**: Drizzle Kit for migrations.
- **Type Safety**: Zod schemas generated from Drizzle schemas.

### Authentication & Authorization
- **Current Implementation**: Basic user schema with signup/login UI flows; authentication not yet enforced.
- **Planned Approach**: Session-based authentication using Express sessions backed by PostgreSQL.

### Feature Specifications
- **Insight Engine Demo Page**: Standalone page showcasing AI notification framing based on emotional distress, with visual processing indicators and adaptive messaging.
- **Fairness Engine**: Calculates fair financial contribution ratios by valuing unpaid labor, integrated into family settings, dashboard, and coaching.
- **Statement Upload**: Allows uploading PDF/CSV for investment accounts and premium bonds not supported by Open Banking, integrated into onboarding and accounts display.
- **Notification System**: Replaced Insights tab with a header notification bell for goal updates, dashboard insights, account changes, and family updates.
- **Financial Coach Redesign**: Interactive two-column layout with goal accordion cards and a conversational chat interface, connecting insights directly to goals with goal-specific quick replies and a Wizard-of-Oz chat system.
- **Mock Data**: Updated transaction data to reflect current dates (Dec 2025/Jan 2026) including holiday transactions and realistic income/spending patterns.

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

### Development Tools
- **Vite**: Fast development server and build tool.
- **esbuild**: JavaScript bundler for server code.
- **TypeScript**: Type safety.
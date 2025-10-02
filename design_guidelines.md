# Envis Interactive Demo - Design Guidelines

## Design Approach

**Selected Approach:** Hybrid - Modern Fintech Reference + Material Design System

**Primary References:** Monzo, Starling Bank, Revolut (for friendly fintech aesthetic), combined with Material Design principles for consistency and trust signals

**Design Philosophy:** Create a polished, trustworthy financial interface that balances professional credibility (for investors) with user-friendly approachability (for families). The design must convey security, clarity, and intelligent innovation.

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 220 85% 25% (Deep trust blue - financial security)
- Primary Hover: 220 85% 20%
- Secondary: 200 100% 45% (Vibrant accent blue)
- Success: 142 76% 36% (Goal progress, positive insights)
- Warning: 38 92% 50% (Cash flow alerts, important nudges)
- Error: 0 84% 60%
- Background: 0 0% 98%
- Card/Surface: 0 0% 100%
- Text Primary: 220 20% 15%
- Text Secondary: 220 10% 45%
- Border: 220 15% 88%

**Dark Mode:**
- Primary: 220 80% 55%
- Primary Hover: 220 80% 60%
- Secondary: 200 90% 55%
- Success: 142 70% 45%
- Warning: 38 95% 55%
- Background: 220 25% 8%
- Card/Surface: 220 20% 12%
- Text Primary: 220 15% 95%
- Text Secondary: 220 10% 65%
- Border: 220 15% 20%

### B. Typography

**Font Families:**
- Primary (UI): "Inter" - clean, modern, excellent for financial data
- Accent (Headlines): "Plus Jakarta Sans" - friendly, approachable for family context

**Type Scale:**
- Headings: font-bold tracking-tight (H1: text-4xl, H2: text-3xl, H3: text-2xl)
- Body: text-base leading-relaxed
- Financial Data: font-medium tabular-nums (for aligned numbers)
- Labels/Metadata: text-sm text-secondary

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, and 12 for consistency
- Micro spacing: p-2, gap-2 (within components)
- Standard spacing: p-4, gap-4, mb-6 (component padding)
- Section spacing: py-8, py-12 (between major sections)
- Container max-width: max-w-7xl for dashboard, max-w-2xl for forms

### D. Component Library

**Navigation:**
- Top navbar: Sticky with logo left, navigation center, user profile right
- Subtle shadow on scroll (shadow-sm)
- Tab navigation for main sections (Dashboard, Goals, Insights) with pill-style active states

**Cards & Surfaces:**
- Transaction items: List cards with hover states (hover:bg-surface/50)
- Goal cards: Elevated cards (shadow-md) with progress bars
- Insight cards: Bordered cards with colored left accent bar (4px) indicating type
- Account cards: Compact, with institution logo placeholder, balance prominent

**Data Display:**
- Transaction feed: Clean list with merchant icon/placeholder, name, amount (right-aligned, colored by debit/credit), date, account tag (pill badge)
- Balance displays: Large tabular numbers, currency symbol smaller
- Progress bars: 8px height, rounded-full, smooth gradient fills
- Account tags: Small pill badges (px-2 py-1 rounded-full text-xs) with account-specific colors

**Forms & Inputs:**
- Input fields: border-2, rounded-lg, focus:ring-2 focus:ring-primary, dark mode compatible with filled backgrounds
- Date pickers: Material-style with clear affordances
- Multi-select: Checkbox groups with card-style selection states
- CTA buttons: Primary (solid blue), Secondary (outline), sizes lg for hero CTAs

**Insights Feed:**
- Card-based feed with icon indicators (size-10 in colored circle backgrounds)
- Headline: font-semibold text-lg
- Body: text-base text-secondary leading-relaxed
- Action buttons: text-sm font-medium (Review, Dismiss, View Details)
- Visual hierarchy with spacing: gap-6 between insights

**Goal Interface:**
- Progress visualization: Circular progress (for goal cards) and linear (for detail view)
- Contribution calculator: Real-time display in highlighted box with icon
- Linked accounts: Chip-style multi-select with checkmarks

**Dashboard Layout:**
- Two-column grid on desktop (lg:grid-cols-3): 2-column transaction feed, 1-column summary/insights sidebar
- Single column on mobile/tablet: Stack naturally
- Summary cards: Grid of 2-4 metric cards at top (Total Balance, Net Flow, Goals, Alerts)

### E. Animations

**Minimal & Purposeful:**
- Micro-interactions only: Button hover scales (scale-[1.02]), focus rings
- Page transitions: Simple fade-in for content loads
- Progress bars: Smooth width transitions (transition-all duration-300)
- NO scroll-triggered animations, parallax, or complex motions

## Images

**Hero Section (Welcome Screen):**
- Large hero image showcasing diverse family using devices together, warm and trustworthy atmosphere
- Dimensions: Full-width, ~60vh height
- Overlay: Semi-transparent gradient (from bottom) for text readability
- Position: Background of welcome section with centered content overlay

**Illustration Assets:**
- Empty states: Simple line illustrations for "No goals yet," "No insights yet"
- Bank logos: Use standard fintech placeholder icons (building icon) until bank brand assets available
- Success screens: Friendly checkmark illustrations with subtle celebration colors

**No images needed for:** Dashboard, transaction lists, forms, insights feed (focus on data clarity)

## Special Considerations

**Trust Signals:**
- FCA regulated badge in footer
- SSL/security icons in account linking flow
- "Read-only access" messaging with lock icons
- Bank-grade encryption copy

**Financial Data Presentation:**
- Always use tabular-nums for aligned amounts
- Color coding: Red/negative for debits, green/positive for credits (subtle, not aggressive)
- Currency symbols: Consistent positioning, slightly smaller than numbers
- Large numbers: Add comma separators, 2 decimal places for precision

**Accessibility:**
- Dark mode: Ensure all form inputs, text fields, and interactive elements maintain consistent treatment
- Color contrast: All text meets WCAG AA standards
- Focus indicators: Clear 2px ring on all interactive elements
- Touch targets: Minimum 44px for mobile demo views
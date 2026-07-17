# Project: Namaa Family Banking Theme & Layout Redesign

## Architecture
- **Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS v3.
- **Frontend Entry**: `src/main.tsx` loads `src/App.tsx`.
- **State Management**: React Context (`src/context/AppContext.tsx`) with optimistic local storage fallback and Supabase database connector.
- **Layout Boundaries**:
  - `src/components/layout/DashboardLayout.tsx` wraps the Sidebar, Topbar, and children components.
  - Sidebar (`src/components/layout/Sidebar.tsx`) provides navigation.
  - Topbar (`src/components/layout/Topbar.tsx`) shows the active profile, search, notifications, and avatar.
- **Page Layouts**: Multiple feature pages for Father (Dashboard, Kids, Projects, AI Coach, League, Village) and Kids (Dashboard, Savings, Tasks, Investments, Donations, League, Castle).
- **Isometric Board**: `src/components/village/VillageBoard.tsx` renders the kids' village in 3D isometric view.

## Code Layout
- `src/App.tsx` - Root app router & toast container
- `src/components/layout/` - Sidebar, Topbar, DashboardLayout
- `src/components/ui/` - Modals (transfer, assign task, transactions, AIActionMenu) and widgets
- `src/components/village/` - Isometric SVGs and board renderer
- `src/context/` - State context and operations
- `src/data/` - Mock data structures and type definitions
- `src/pages/` - All role-based user pages
- `src/utils/` - Gemini AI service and Supabase client

## Milestones

### E2E Testing Track Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|--------------|--------|
| E1 | Test Suite Design | Setup test runner infrastructure, configure environment, inspect feasibility of Playwright/offline testing, and write test framework skeleton. | None | DONE |
| E2 | Feature Coverage (Tier 1) | Write Tier 1 tests (happy-path navigation, sidebar layout checks with outline SVGs, topbar search alignment checks, rounded white cards layout checks, form submissions, light theme modals styling, full screen backdrop overlay, toast layout, and AI coach tools). | E1 | PLANNED |
| E3 | Boundaries & Corners (Tier 2) | Write Tier 2 tests (limits, negative validations, input bounds, modal boundary checks, viewport margins). | E2 | PLANNED |
| E4 | Integration & Workloads (Tiers 3 & 4) | Write Tier 3 (cross-feature) and Tier 4 (real workloads), publish `TEST_READY.md`. | E3 | PLANNED |

### Implementation Track Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|--------------|--------|
| I1 | Base Theme & Background | Set background to warm cream/gray (`#F5F4F0`/`#F2EFE9`) with radial masked graph grid pattern and blurred blobs. | None | DONE |
| I2 | Floating Pill Sidebar | Redesign Sidebar to be narrow vertical floating strip detached with margins, SVG outline icons, active circular lavender/copper bg, brand logo, bottom settings/avatar/logout. | I1 | DONE |
| I3 | Frosted Topbar & Search Bar | Redesign Topbar with frosted background, search input with perfect alignment, rounded black search button, notification badge, and profile bubble. | I2 | PLANNED |
| I4 | Page & Card Refactor | Convert all dashboards, sub-pages, panels, lists, forms to white cards with rounded-3xl/rounded-[32px] and soft shadows. | I3 | PLANNED |
| I4b | Light Theme Modals & Overlay | Revamp all modals (TransactionsModal, TransferModal, AssignTaskModal, page inline modals) to use light theme (`bg-white`, rounded-[28px], stone-200 borders, `#0C2341` typography). Adjust overlay z-index to cover 100% viewport and put sidebar z-index behind active modal backdrop. | I4 | PLANNED |
| I4c | Toast & AI Coach Redesign | Redesign toast alert banner to light theme (soft green/cream/navy) and AI Coach tools popup to match the light theme card design. | I4b | PLANNED |
| I5 | Isometric Board & Castle | Integrate Village Board & castle cleanly with no layout clipping or overlap. | I4c | PLANNED |
| I6 | Integration & E2E Pass | Ensure all E2E tests (Tiers 1-4) pass and `npx tsc --noEmit` returns zero errors. | I5, E4 | PLANNED |
| I7 | Coverage Hardening | Run adversarial testing (Tier 5) with Challenger, fix gaps. | I6 | PLANNED |

## Interface Contracts
### Components ↔ AppContext
- State reads: `useApp()` context hook.
- Functions: `transferMoney`, `assignManualTask`, `addSavingsGoal`, `startFamilyLeague`, `endFamilyLeague`.
- Types: `UserProfile`, `Kid`, `SavingsGoal`, `Task`, `ActiveLeague`, `FamilyProject` from `src/data/mockData.ts`.

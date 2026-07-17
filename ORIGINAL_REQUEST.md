# Original User Request

## Initial Request — 2026-07-16T03:53:47+03:00

Redesign the "Namaa" family banking web application to use the aesthetic theme, color palette, and layout styling inspired by the "amad.tuwaiq.edu.sa" website. All existing functionality, buttons, and local data bindings must remain 100% operational.

Working directory: c:\Users\ehabz\Documents\projects\nama
Integrity mode: development

## Requirements

### R1. Theme and Color Migration
- Implement the "Amad" color palette across the entire application:
  - Base Background: `--bg: #F2EFE9` (soft warm cream).
  - Deep Accents: `--bg-deep: #EED6C6` (terracotta/rose-sand).
  - Text: `--text: #0C2341` (royal navy/ink blue).
  - Primary Action/Highlight: `--primary: #C66E4E` (Alinma copper orange).
  - Secondary Action/Lavender: `--secondary: #8B84D7` (Tuwaiq purple/lavender).
- Integrate the graph-paper grid pattern background (`background-size: 72px 72px` or similar) masked with a soft radial gradient.
- Add soft blurred color blobs in the background to create visual depth.

### R2. Navigation Layout Revamp (Sidebar & Topbar)
- Redesign the Sidebar to be a floating, glassmorphic panel with rounded corners, smooth hover scaling, and clean navigation links featuring Lavender underline transitions.
- Redesign the Topbar with a frosted glass backdrop effect (`backdrop-blur-md`) that adapts when scrolling, with modern copper/lavender buttons.

### R3. Component & Page Refactor
- Update all dashboards, pages (Savings, Tasks, Investments, Donations, League), and card elements to use the new glassmorphic styles with deep navy text and clean borders.
- Keep the isometric 2.5D village board and floating cards perfectly integrated and visible without overlapping or clipping.

### R4. Integrity and Functionality Preservation
- Every single button, modal, form submission, and route link must remain fully active and connected to local state.
- No text or UI elements should be hidden or cut off on standard viewports.

## Acceptance Criteria

### Visual Fidelity & Modernization
- [ ] No default system colors (plain black, raw white, basic primary colors) are used.
- [ ] The background features the cream theme, grid layout, and purple/copper blurred blobs.
- [ ] All sidebar and topbar menus use modern hover transitions and correct active routes.

### Structural & Operational Safety
- [ ] Running `npx tsc --noEmit` succeeds with zero errors.
- [ ] All page navigations (Father and Kid views) work correctly.
- [ ] Dynamic forms (adding a saving goal, completing a task, ending a league, starting a league, or transferring money) submit correctly.

## Follow-up — 2026-07-16T10:08:01Z

Redesign the "Namaa" family banking web application's dashboard layouts, sidebar, topbar, cards, and sub-pages to match the visual styling, spacing, and structural layout of the user-provided screenshot, while preserving the Amad/Tuwaiq color palette (terracotta copper, lavender, navy text, cream background).

Working directory: c:\Users\ehabz\Documents\projects\nama
Integrity mode: development

## Requirements

### R1. Screenshot Layout with Amad Theme
- **Base Background**: Warm light cream/gray (`#F5F4F0` or `#F2EFE9`). Keep the subtle graph grid pattern.
- **Floating Pill Sidebar**:
  - Redesign the Sidebar to be a narrow, vertical floating white strip detached from the page edges (margins on all sides).
  - Use high-quality SVG outline icons for navigation items (home, kids, projects, AI coach, league, village).
  - Use a solid circular lavender (`#8B84D7`) or terracotta copper (`#C66E4E`) active background for the selected page icon.
  - Place a custom brand logo/symbol at the top of the sidebar.
  - Place the settings, logout, and profile avatar/badge at the bottom of the sidebar.
- **Frosted Topbar Layout**:
  - Implement a clean header alignment matching the screenshot: a modern search input box, notification bell icon, and a profile avatar bubble.
- **Card Styling**:
  - Convert all main panels, sub-page components, lists, and forms into pure white cards (`bg-white`) with high corner rounding (`rounded-3xl` or `rounded-[32px]`), thin subtle borders, and soft shadows.
- **Color Palette & Accents**:
  - Keep the Amad/Tuwaiq colors: terracotta copper (`#C66E4E`) for highlights, lavender (`#8B84D7`) for secondary actions, and royal navy (`#0C2341`) for text.

### R2. Navigation Layout Consistency
- Ensure that the sidebar and topbar are shared components (using the existing `Sidebar.tsx` and `Topbar.tsx` or new layout wrappers) so that the redesigned menus are unified across all Father and Kid routes.

### R3. Preserving Functional Integrity
- Ensure every single button, page transition, local state binding, form submission (e.g. creating a task, depositing into a savings goal, contributing to investments), and village board levels remains 100% functional.
- The 2.5D village board and castle should remain fully integrated and properly proportioned without layout clipping.

## Acceptance Criteria

### Visual Layout & Spacing
- [ ] No primitive layouts are used; all cards follow the rounded white design with subtle slate-100/stone-200 borders.
- [ ] The narrow vertical floating sidebar is detached from the viewport edges and matches the screenshot structure.
- [ ] All sidebar navigation links correctly point to their respective routes and render SVG outline icons.
- [ ] The topbar is cleanly aligned with a search input, rounded black search button, notification badge, and profile bubble.

### Technical & Functional Integrity
- [ ] Running `npx tsc --noEmit` succeeds with zero errors.
- [ ] All page navigations (Father and Kid views) work correctly.
- [ ] Dynamic forms (adding a saving goal, completing a task, ending a league, starting a league, or transferring money) submit correctly.

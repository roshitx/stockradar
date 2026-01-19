# StockRadar Changelog

## 2026-01-19

### 20:40 - Security: Enable Row Level Security (RLS)

**Completed:**
- **Critical Security Fix**: Enabled RLS on all Supabase tables
  - Created migration file: `drizzle/0001_enable_rls.sql`
  - Applied 11 RLS policies across 3 tables
  - Verified RLS enabled on all tables

**RLS Policies Created:**
- **Users Table (3 policies)**:
  - `users_select_own`: Users can only read their own profile
  - `users_update_own`: Users can only update their own profile
  - `users_prevent_delete`: Direct deletion disabled (use Supabase Auth)

- **Watchlists Table (4 policies)**:
  - `watchlists_select_own`: Users can only read own watchlist
  - `watchlists_insert_own`: Users can only add to own watchlist
  - `watchlists_update_own`: Users can only update own entries
  - `watchlists_delete_own`: Users can only delete own entries

- **API Cache Table (4 policies)**:
  - `api_cache_public_read`: Public read access (anonymous allowed)
  - `api_cache_no_insert`: Blocked via RLS (server-side only)
  - `api_cache_no_update`: Blocked via RLS (server-side only)
  - `api_cache_no_delete`: Blocked via RLS (server-side only)

**Documentation Added:**
- `.claude/docs/SECURITY.md`: Security guidelines and RLS testing procedures

**Security Impact:**
- ✅ Users isolated to their own data
- ✅ No cross-user data access vulnerability
- ✅ Public cache remains readable, server-controlled writes

---

## 2026-01-19

### 16:35 - Phase 1 Tasks 2-4 Complete

**Completed:**
- **Task 2**: Configure Geist Fonts & Base Typography
  - Installed `geist` package
  - Updated `app/layout.tsx` with GeistSans and GeistMono
  - Set language to Indonesian (`lang="id"`)
  - Added `suppressHydrationWarning` for theme support

- **Task 3**: Setup Complete Design System
  - Replaced `app/globals.css` with full design system
  - Financial semantic colors (positive/negative/neutral)
  - Glass morphism CSS variables
  - Light/dark mode support
  - Accessibility features (focus-visible, reduced-motion)
  - Typography utilities for financial data (tabular-nums)
  - Updated `tailwind.config.ts` with extended theme
  - Installed `tailwindcss-animate` plugin

- **Task 4**: Initialize ShadCN/UI
  - Installed dependencies: clsx, tailwind-merge, class-variance-authority
  - Created `lib/utils.ts` with `cn()` helper
  - Created `components.json` (New York style)
  - Added components: button, card, input, skeleton

**Build Verification:** ✅ Passed (commit: 618dbe5)

**Pending Tasks:**
- [ ] Task 11: Create Header Component (with tests)
- [ ] Task 12: Create Footer Component (with tests)
- [ ] Task 13: Build Landing Page (with tests)
- [ ] Task 14: Final Verification & Cleanup

---

### Added
- `docs/plans/DESIGN.md` - Comprehensive UI/UX design document
  - Design Philosophy: "Luxury Financial Terminal" aesthetic
  - Color System: Emerald/rose semantic colors with dark/light mode CSS variables
  - Typography Scale: Geist Sans/Mono font family with 8-point rhythm
  - Component Specifications: Glass cards, price badges, stock cards, buttons, data tables, chart containers
  - Page Layouts: Homepage, stock list, stock detail, watchlist
  - Animation Guidelines: Framer Motion patterns for page transitions, staggered lists, micro-interactions
  - Responsive Design: Mobile-first breakpoints and patterns
  - Accessibility: WCAG 2.1 AA compliance guidelines

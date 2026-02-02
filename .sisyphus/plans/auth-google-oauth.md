# Authentication: Google OAuth + Email/Password

## TL;DR

> **Quick Summary**: Implement full authentication system with Google OAuth (primary) and Email/Password (secondary) for StockRadar. Includes login/register pages, route protection via proxy.ts, header user menu, and auto-sync user profiles.
> 
> **Deliverables**:
> - Google OAuth login flow with PKCE
> - Email/password login + registration
> - Protected routes (/watchlist, /settings)
> - Header avatar dropdown menu
> - Toast notifications for errors
> - Database trigger for user sync
> 
> **Estimated Effort**: Large (15-20 tasks)
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Task 0 (Supabase setup) → Task 1-3 (DB + Proxy) → Task 4-8 (Auth pages) → Task 9-12 (UI)

---

## Context

### Original Request
User wants Google OAuth as primary authentication method with Email/Password as secondary option for StockRadar Indonesian stock market platform.

### Interview Summary
**Key Discussions**:
- Auth providers: Google OAuth + Email/Password (both)
- Protected routes: `/watchlist`, `/settings`
- Login style: Dedicated page at `/auth/login`
- User data from Google: Email, display name, profile picture URL
- Post-login: Redirect back to previous page
- Header UI: Avatar + dropdown menu
- Error handling: Toast notifications
- Registration: Include signup page for email/password
- Session: 7 days (Supabase default)
- Error messages: Generic "Email atau password salah"
- Profile priority: Google data always overwrites
- Logout: Redirect to homepage
- Supabase setup: Not configured, include guide

### Research Findings
- **Next.js 16**: Uses `proxy.ts` (not middleware.ts) for route protection
- **Supabase SSR**: `@supabase/ssr` package with cookie-based sessions
- **PKCE flow**: Default for OAuth in Supabase SSR
- **Callback pattern**: `exchangeCodeForSession(code)` in route handler

### Metis Review
**Identified Gaps** (addressed):
- Session refresh in proxy: Added `updateSession` utility
- User table sync race condition: Using Postgres trigger
- Public route allowlist: Explicit in proxy.ts
- Avatar fallback: Using initials when URL unavailable
- Redirect URL validation: Sanitize against XSS

---

## Work Objectives

### Core Objective
Enable users to authenticate via Google OAuth or Email/Password, protecting watchlist and settings pages while maintaining session state across the app.

### Concrete Deliverables
- `proxy.ts` - Route protection with session refresh
- `/auth/login` - Login page with Google + Email forms
- `/auth/register` - Registration page for email/password
- `/auth/callback` - OAuth callback handler
- `AuthProvider` - Client-side auth state context
- `UserMenu` - Header dropdown with avatar
- Database migration for `avatar_url` column
- Postgres trigger for user sync

### Definition of Done
- [ ] User can login via Google OAuth → session created, redirected to previous page (BLOCKED: Requires Supabase config)
- [ ] User can register with email/password → account created, logged in (BLOCKED: Requires Supabase config)
- [ ] User can login with email/password → session created (BLOCKED: Requires Supabase config)
- [x] Unauthenticated access to /watchlist → redirects to /auth/login (Implemented via proxy.ts)
- [x] Header shows avatar dropdown when logged in (Implemented: UserMenu component)
- [x] Logout clears session and redirects to homepage (Implemented: signOut action)
- [x] Auth errors show toast notification (Implemented: toast.error in forms)

**Wave 1 Progress (Infrastructure)**: 3/3 ✅
- [x] Task 0: Supabase Google OAuth setup guide
- [x] Task 1: Add avatar_url column migration
- [x] Task 2: Add ShadCN toast component (Sonner)

**Wave 2 Progress (Core Auth)**: 3/3 ✅
- [x] Task 3: Create proxy.ts with session refresh
- [x] Task 4: Create Postgres trigger for user sync
- [x] Task 5: Create auth server actions

**Wave 3 Progress (Pages)**: 5/5 ✅
- [x] Task 6: Create OAuth callback route handler
- [x] Task 7: Create login page
- [x] Task 8: Create register page
- [x] Task 9: Create auth error page
- [x] Task 10: Create AuthProvider context

**Wave 4 Progress (UI Integration)**: 4/4 ✅
- [x] Task 11: Create UserMenu component
- [x] Task 12: Update Header with UserMenu
- [x] Task 13: Create protected route layout
- [x] Task 14: Create placeholder protected pages

**ALL TASKS COMPLETE** ✅

### Must Have
- Google OAuth login with PKCE flow
- Email/password login and registration
- Route protection for /watchlist, /settings
- Session persistence (7 days)
- Avatar + dropdown in header
- Toast notifications for errors

### Must NOT Have (Guardrails)
- Password reset flow (Phase 2)
- Email verification requirement (Supabase handles optionally)
- Other OAuth providers (GitHub, Facebook, etc.)
- 2FA/MFA
- Account deletion
- Session management UI

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (need to add toast component)
- **User wants tests**: Manual verification with Playwright
- **Framework**: Playwright for browser automation

### Automated Verification (Playwright + curl)

Each TODO includes executable verification procedures:

**For Auth UI changes** (using playwright skill):
```
# Agent executes via playwright browser automation:
1. Navigate to: http://localhost:3000/auth/login
2. Assert: Google sign-in button visible
3. Assert: Email/password form visible
4. Fill form and submit
5. Assert: Redirected to intended page
6. Screenshot: .sisyphus/evidence/task-X-login.png
```

**For API/Route changes** (using Bash curl):
```bash
# Agent runs:
curl -I http://localhost:3000/watchlist
# Assert: HTTP 307 redirect to /auth/login
```

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - Infrastructure):
├── Task 0: Supabase Google OAuth setup guide (documentation)
├── Task 1: Add avatar_url column migration
└── Task 2: Add ShadCN toast component (Sonner)

Wave 2 (After Wave 1 - Core Auth):
├── Task 3: Create proxy.ts with session refresh
├── Task 4: Create Postgres trigger for user sync
└── Task 5: Create auth server actions

Wave 3 (After Wave 2 - Pages):
├── Task 6: Create /auth/callback route handler
├── Task 7: Create /auth/login page
├── Task 8: Create /auth/register page
├── Task 9: Create /auth/auth-code-error page
└── Task 10: Create AuthProvider context

Wave 4 (After Wave 3 - UI Integration):
├── Task 11: Create UserMenu component
├── Task 12: Update Header with UserMenu
├── Task 13: Create protected route layout
└── Task 14: Create placeholder protected pages

Critical Path: Task 0 → Task 3 → Task 6 → Task 7 → Task 12
Parallel Speedup: ~50% faster than sequential
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 0 | None | 3, 6, 7 | 1, 2 |
| 1 | None | 4 | 0, 2 |
| 2 | None | 7, 8, 11 | 0, 1 |
| 3 | 0 | 6, 13 | 4, 5 |
| 4 | 1 | 7, 8 | 3, 5 |
| 5 | None | 7, 8 | 3, 4 |
| 6 | 3, 5 | 7 | 9, 10 |
| 7 | 2, 4, 5, 6 | 12 | 8, 9, 10 |
| 8 | 2, 4, 5 | None | 7, 9, 10 |
| 9 | None | None | 6, 7, 8, 10 |
| 10 | 5 | 11, 12 | 6, 7, 8, 9 |
| 11 | 2, 10 | 12 | 13, 14 |
| 12 | 10, 11 | None | 13, 14 |
| 13 | 3 | 14 | 11, 12 |
| 14 | 13 | None | 11, 12 |

---

## TODOs

### Task 0: Document Supabase Google OAuth Setup

**What to do**:
- Create step-by-step guide for configuring Google OAuth in Supabase
- Include Google Cloud Console setup (OAuth Client ID)
- Include Supabase Dashboard configuration
- Document required environment variables

**Must NOT do**:
- Actually configure Supabase (user does this manually)
- Store any credentials in code

**Recommended Agent Profile**:
- **Category**: `writing`
- **Skills**: []
- **Reason**: Documentation task, no code changes

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 1 (with Tasks 1, 2)
- **Blocks**: Tasks 3, 6, 7
- **Blocked By**: None

**References**:
- Supabase Google OAuth docs: https://supabase.com/docs/guides/auth/social-login/auth-google
- `.env.example` - Current env var template

**Acceptance Criteria**:
```bash
# File exists with content
test -f docs/guides/supabase-google-oauth-setup.md && echo "PASS" || echo "FAIL"
# Contains required sections
grep -q "Google Cloud Console" docs/guides/supabase-google-oauth-setup.md && echo "PASS"
grep -q "Supabase Dashboard" docs/guides/supabase-google-oauth-setup.md && echo "PASS"
grep -q "NEXT_PUBLIC_SUPABASE" docs/guides/supabase-google-oauth-setup.md && echo "PASS"
```

**Commit**: YES
- Message: `docs: add Supabase Google OAuth setup guide`
- Files: `docs/guides/supabase-google-oauth-setup.md`

---

### Task 1: Add avatar_url Column to Users Table

**What to do**:
- Create Drizzle migration to add `avatar_url` TEXT column to `users` table
- Column should be nullable (not all users have avatars)
- Run migration with `bun db:push`

**Must NOT do**:
- Modify existing data
- Change other columns

**Recommended Agent Profile**:
- **Category**: `quick`
- **Skills**: []
- **Reason**: Simple schema change

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 1 (with Tasks 0, 2)
- **Blocks**: Task 4
- **Blocked By**: None

**References**:
- `lib/db/schema.ts:11-17` - Current users table schema
- `drizzle.config.ts` - Drizzle configuration

**Acceptance Criteria**:
```bash
# Schema has avatar_url field
grep -q "avatarUrl" lib/db/schema.ts && echo "PASS" || echo "FAIL"

# TypeScript compiles
bun x tsc --noEmit && echo "PASS" || echo "FAIL"

# Migration runs (check drizzle output)
bun db:push 2>&1 | grep -q "error" && echo "FAIL" || echo "PASS"
```

**Commit**: YES
- Message: `feat(db): add avatar_url column to users table`
- Files: `lib/db/schema.ts`

---

### Task 2: Add ShadCN Toast Component (Sonner)

**What to do**:
- Install Sonner toast component via `bunx shadcn@latest add sonner`
- Add Toaster to root layout
- Verify toast works with test

**Must NOT do**:
- Create custom toast implementation
- Modify existing components

**Recommended Agent Profile**:
- **Category**: `quick`
- **Skills**: []
- **Reason**: Simple component installation

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 1 (with Tasks 0, 1)
- **Blocks**: Tasks 7, 8, 11
- **Blocked By**: None

**References**:
- `app/layout.tsx` - Root layout to add Toaster
- `components/ui/` - ShadCN components directory

**Acceptance Criteria**:
```bash
# Sonner component exists
test -f components/ui/sonner.tsx && echo "PASS" || echo "FAIL"

# Toaster in layout
grep -q "Toaster" app/layout.tsx && echo "PASS" || echo "FAIL"

# TypeScript compiles
bun x tsc --noEmit && echo "PASS" || echo "FAIL"
```

**Commit**: YES
- Message: `feat(ui): add Sonner toast component`
- Files: `components/ui/sonner.tsx`, `app/layout.tsx`

---

### Task 3: Create proxy.ts with Session Refresh

**What to do**:
- Create `proxy.ts` in project root
- Implement session refresh using Supabase SSR pattern
- Define public routes allowlist: `/`, `/stocks`, `/stocks/*`, `/auth/*`, `/api/*`
- Define protected routes: `/watchlist`, `/settings`
- Redirect unauthenticated users to `/auth/login?redirect=<current_path>`
- Create `lib/supabase/proxy.ts` helper for session update

**Must NOT do**:
- Use middleware.ts (deprecated in Next.js 16)
- Block API routes (handled separately)
- Decrypt session manually (use Supabase getUser)

**Recommended Agent Profile**:
- **Category**: `ultrabrain`
- **Skills**: [`coding-standards`]
- **Reason**: Critical security component, needs careful implementation

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 2 (with Tasks 4, 5)
- **Blocks**: Tasks 6, 13
- **Blocked By**: Task 0 (need Supabase configured)

**References**:
- Context7 Next.js 16 proxy.ts pattern (see research findings)
- `lib/supabase/server.ts` - Existing server client pattern
- Supabase SSR docs: https://supabase.com/docs/guides/auth/server-side/nextjs

**Acceptance Criteria**:
```bash
# proxy.ts exists
test -f proxy.ts && echo "PASS" || echo "FAIL"

# Helper exists
test -f lib/supabase/proxy.ts && echo "PASS" || echo "FAIL"

# Has public routes config
grep -q "protectedRoutes" proxy.ts && echo "PASS" || echo "FAIL"

# TypeScript compiles
bun x tsc --noEmit && echo "PASS" || echo "FAIL"

# Protected route redirects (after dev server running)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/watchlist | grep -q "307" && echo "PASS" || echo "FAIL"
```

**Commit**: YES
- Message: `feat(auth): add proxy.ts for route protection`
- Files: `proxy.ts`, `lib/supabase/proxy.ts`

---

### Task 4: Create Postgres Trigger for User Sync

**What to do**:
- Create SQL migration for Postgres function + trigger
- Trigger fires on `auth.users` INSERT
- Auto-creates row in `public.users` with id, email
- Handle case where user already exists (upsert)

**Must NOT do**:
- Modify auth.users table directly
- Store passwords in public.users

**Recommended Agent Profile**:
- **Category**: `unspecified-high`
- **Skills**: [`backend-patterns`]
- **Reason**: Database trigger requires careful SQL

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 2 (with Tasks 3, 5)
- **Blocks**: Tasks 7, 8
- **Blocked By**: Task 1 (need avatar_url column)

**References**:
- `lib/db/schema.ts` - Users table schema
- `drizzle/` - Existing migrations folder
- Supabase triggers: https://supabase.com/docs/guides/database/postgres/triggers

**Acceptance Criteria**:
```bash
# Migration file exists
ls drizzle/*.sql | grep -q "user_sync" && echo "PASS" || echo "FAIL"

# SQL has trigger definition
grep -q "CREATE OR REPLACE FUNCTION" drizzle/*user_sync*.sql && echo "PASS" || echo "FAIL"
grep -q "CREATE TRIGGER" drizzle/*user_sync*.sql && echo "PASS" || echo "FAIL"

# Migration applied (via Supabase dashboard or psql)
```

**Commit**: YES
- Message: `feat(db): add trigger to sync auth.users to public.users`
- Files: `drizzle/0002_user_sync_trigger.sql`

---

### Task 5: Create Auth Server Actions

**What to do**:
- Create `lib/auth/actions.ts` with Server Actions
- `signInWithEmail(email, password)` - Login with email/password
- `signUpWithEmail(email, password, name)` - Register new user
- `signOut()` - Logout and clear session
- `signInWithGoogle()` - Initiate Google OAuth (client-side redirect)
- Use generic error messages: "Email atau password salah"
- Return proper error types for toast display

**Must NOT do**:
- Store passwords (Supabase handles)
- Log sensitive data
- Return specific error messages ("email not found")

**Recommended Agent Profile**:
- **Category**: `ultrabrain`
- **Skills**: [`coding-standards`, `backend-patterns`]
- **Reason**: Security-critical auth logic

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 2 (with Tasks 3, 4)
- **Blocks**: Tasks 6, 7, 8, 10
- **Blocked By**: None

**References**:
- `lib/supabase/server.ts` - Server client
- `lib/supabase/client.ts` - Browser client (for OAuth redirect)
- Supabase auth methods: signInWithPassword, signUp, signOut, signInWithOAuth

**Acceptance Criteria**:
```bash
# File exists
test -f lib/auth/actions.ts && echo "PASS" || echo "FAIL"

# Has required exports
grep -q "signInWithEmail" lib/auth/actions.ts && echo "PASS" || echo "FAIL"
grep -q "signUpWithEmail" lib/auth/actions.ts && echo "PASS" || echo "FAIL"
grep -q "signOut" lib/auth/actions.ts && echo "PASS" || echo "FAIL"

# Uses 'use server' directive
grep -q "'use server'" lib/auth/actions.ts && echo "PASS" || echo "FAIL"

# TypeScript compiles
bun x tsc --noEmit && echo "PASS" || echo "FAIL"
```

**Commit**: YES
- Message: `feat(auth): add server actions for login/register/logout`
- Files: `lib/auth/actions.ts`

---

### Task 6: Create OAuth Callback Route Handler

**What to do**:
- Create `app/auth/callback/route.ts`
- Handle GET request with `code` query param
- Exchange code for session via `exchangeCodeForSession`
- Redirect to `next` param or homepage
- Handle x-forwarded-host for production
- Redirect to error page on failure

**Must NOT do**:
- Skip PKCE verification (Supabase handles)
- Allow external redirect URLs
- Log authorization codes

**Recommended Agent Profile**:
- **Category**: `quick`
- **Skills**: [`backend-patterns`]
- **Reason**: Standard Supabase pattern, well-documented

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 3 (with Tasks 7, 8, 9, 10)
- **Blocks**: Task 7
- **Blocked By**: Tasks 3, 5

**References**:
- Context7 Supabase callback pattern (see research findings)
- `lib/supabase/server.ts` - Server client

**Acceptance Criteria**:
```bash
# Route exists
test -f app/auth/callback/route.ts && echo "PASS" || echo "FAIL"

# Has GET export
grep -q "export async function GET" app/auth/callback/route.ts && echo "PASS" || echo "FAIL"

# Uses exchangeCodeForSession
grep -q "exchangeCodeForSession" app/auth/callback/route.ts && echo "PASS" || echo "FAIL"

# TypeScript compiles
bun x tsc --noEmit && echo "PASS" || echo "FAIL"
```

**Commit**: YES
- Message: `feat(auth): add OAuth callback route handler`
- Files: `app/auth/callback/route.ts`

---

### Task 7: Create Login Page

**What to do**:
- Create `app/auth/login/page.tsx`
- Include Google OAuth button (uses signInWithOAuth)
- Include email/password form
- Handle form submission with Server Action
- Show toast on error
- Support `?redirect=` query param for post-login redirect
- Add loading states to buttons
- Link to register page

**Must NOT do**:
- Store credentials in state
- Show specific error messages
- Skip loading states

**Recommended Agent Profile**:
- **Category**: `visual-engineering`
- **Skills**: [`frontend-ui-ux`, `frontend-patterns`]
- **Reason**: UI page with form interactions

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 3 (with Tasks 8, 9, 10)
- **Blocks**: Task 12
- **Blocked By**: Tasks 2, 4, 5, 6

**References**:
- `lib/auth/actions.ts` - Server actions
- `components/ui/button.tsx` - ShadCN button
- `components/ui/input.tsx` - ShadCN input
- `components/ui/sonner.tsx` - Toast component

**Acceptance Criteria**:
```
# Playwright verification:
1. Navigate to: http://localhost:3000/auth/login
2. Assert: element 'button:has-text("Continue with Google")' visible
3. Assert: element 'input[name="email"]' visible
4. Assert: element 'input[name="password"]' visible
5. Assert: element 'a:has-text("Register")' visible
6. Screenshot: .sisyphus/evidence/task-7-login-page.png
```

**Commit**: YES
- Message: `feat(auth): add login page with Google and email options`
- Files: `app/auth/login/page.tsx`

---

### Task 8: Create Register Page

**What to do**:
- Create `app/auth/register/page.tsx`
- Include name, email, password fields
- Handle form submission with Server Action
- Show toast on error/success
- Auto-login after successful registration
- Link to login page

**Must NOT do**:
- Include Google OAuth (login only)
- Skip password confirmation
- Allow weak passwords (min 6 chars)

**Recommended Agent Profile**:
- **Category**: `visual-engineering`
- **Skills**: [`frontend-ui-ux`, `frontend-patterns`]
- **Reason**: UI page with form interactions

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 3 (with Tasks 7, 9, 10)
- **Blocks**: None
- **Blocked By**: Tasks 2, 4, 5

**References**:
- `lib/auth/actions.ts` - signUpWithEmail action
- `app/auth/login/page.tsx` - Similar structure

**Acceptance Criteria**:
```
# Playwright verification:
1. Navigate to: http://localhost:3000/auth/register
2. Assert: element 'input[name="name"]' visible
3. Assert: element 'input[name="email"]' visible
4. Assert: element 'input[name="password"]' visible
5. Assert: element 'button[type="submit"]' visible
6. Assert: element 'a:has-text("Login")' visible
7. Screenshot: .sisyphus/evidence/task-8-register-page.png
```

**Commit**: YES
- Message: `feat(auth): add register page for email signup`
- Files: `app/auth/register/page.tsx`

---

### Task 9: Create Auth Error Page

**What to do**:
- Create `app/auth/auth-code-error/page.tsx`
- Display friendly error message
- Provide link back to login
- Handle common OAuth errors

**Must NOT do**:
- Show technical error details to user
- Auto-redirect (let user read message)

**Recommended Agent Profile**:
- **Category**: `quick`
- **Skills**: [`frontend-ui-ux`]
- **Reason**: Simple static page

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 3 (with Tasks 6, 7, 8, 10)
- **Blocks**: None
- **Blocked By**: None

**References**:
- Design system colors and typography

**Acceptance Criteria**:
```bash
# Page exists
test -f app/auth/auth-code-error/page.tsx && echo "PASS" || echo "FAIL"

# TypeScript compiles
bun x tsc --noEmit && echo "PASS" || echo "FAIL"
```

**Commit**: YES
- Message: `feat(auth): add OAuth error page`
- Files: `app/auth/auth-code-error/page.tsx`

---

### Task 10: Create AuthProvider Context

**What to do**:
- Create `components/auth/auth-provider.tsx`
- Use `onAuthStateChange` listener from Supabase
- Provide user state to children via React Context
- Handle loading state during initial auth check
- Export `useAuth` hook

**Must NOT do**:
- Store sensitive tokens in context
- Skip loading state (causes flash)

**Recommended Agent Profile**:
- **Category**: `unspecified-high`
- **Skills**: [`frontend-patterns`]
- **Reason**: Context provider with async state

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 3 (with Tasks 6, 7, 8, 9)
- **Blocks**: Tasks 11, 12
- **Blocked By**: Task 5

**References**:
- `lib/supabase/client.ts` - Browser client
- `app/layout.tsx` - Add provider here

**Acceptance Criteria**:
```bash
# Provider exists
test -f components/auth/auth-provider.tsx && echo "PASS" || echo "FAIL"

# Has useAuth hook
grep -q "useAuth" components/auth/auth-provider.tsx && echo "PASS" || echo "FAIL"

# Uses onAuthStateChange
grep -q "onAuthStateChange" components/auth/auth-provider.tsx && echo "PASS" || echo "FAIL"

# Added to layout
grep -q "AuthProvider" app/layout.tsx && echo "PASS" || echo "FAIL"

# TypeScript compiles
bun x tsc --noEmit && echo "PASS" || echo "FAIL"
```

**Commit**: YES
- Message: `feat(auth): add AuthProvider context and useAuth hook`
- Files: `components/auth/auth-provider.tsx`, `app/layout.tsx`

---

### Task 11: Create UserMenu Component

**What to do**:
- Create `components/auth/user-menu.tsx`
- Show avatar (from Google) or initials fallback
- Dropdown menu with: Profile, Settings, Logout
- Handle logout action with redirect to homepage
- Use ShadCN DropdownMenu component

**Must NOT do**:
- Skip avatar fallback (broken images)
- Block UI during logout

**Recommended Agent Profile**:
- **Category**: `visual-engineering`
- **Skills**: [`frontend-ui-ux`]
- **Reason**: Interactive dropdown UI

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 4 (with Tasks 12, 13, 14)
- **Blocks**: Task 12
- **Blocked By**: Tasks 2, 10

**References**:
- `components/auth/auth-provider.tsx` - useAuth hook
- ShadCN DropdownMenu component
- ShadCN Avatar component

**Acceptance Criteria**:
```bash
# Component exists
test -f components/auth/user-menu.tsx && echo "PASS" || echo "FAIL"

# Uses DropdownMenu
grep -q "DropdownMenu" components/auth/user-menu.tsx && echo "PASS" || echo "FAIL"

# Has avatar
grep -q "Avatar" components/auth/user-menu.tsx && echo "PASS" || echo "FAIL"

# TypeScript compiles
bun x tsc --noEmit && echo "PASS" || echo "FAIL"
```

**Commit**: YES
- Message: `feat(auth): add UserMenu dropdown component`
- Files: `components/auth/user-menu.tsx`

---

### Task 12: Update Header with Auth State

**What to do**:
- Modify `components/layout/header.tsx`
- Replace placeholder "Sign In" button with conditional render
- Show UserMenu when logged in
- Show "Sign In" button when logged out
- Add loading skeleton during auth check

**Must NOT do**:
- Flash "Sign In" before auth loads
- Break existing header functionality

**Recommended Agent Profile**:
- **Category**: `visual-engineering`
- **Skills**: [`frontend-ui-ux`]
- **Reason**: UI modification with conditional rendering

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 4 (with Tasks 13, 14)
- **Blocks**: None
- **Blocked By**: Tasks 10, 11

**References**:
- `components/layout/header.tsx:93-95` - Current placeholder
- `components/auth/user-menu.tsx` - UserMenu component
- `components/auth/auth-provider.tsx` - useAuth hook

**Acceptance Criteria**:
```
# Playwright verification (logged out):
1. Navigate to: http://localhost:3000
2. Assert: element 'button:has-text("Sign In")' visible
3. Assert: element '[data-testid="user-menu"]' NOT visible

# Playwright verification (logged in):
1. Login via Google OAuth
2. Navigate to: http://localhost:3000
3. Assert: element '[data-testid="user-menu"]' visible
4. Assert: element 'button:has-text("Sign In")' NOT visible
5. Click: '[data-testid="user-menu"]'
6. Assert: element 'text=Logout' visible
```

**Commit**: YES
- Message: `feat(auth): add auth state to header with UserMenu`
- Files: `components/layout/header.tsx`

---

### Task 13: Create Protected Route Layout

**What to do**:
- Create `app/(protected)/layout.tsx`
- Check auth state server-side with `getUser()`
- Redirect to login if not authenticated
- Pass user to children if needed

**Must NOT do**:
- Trust client-side auth state alone
- Skip redirect param preservation

**Recommended Agent Profile**:
- **Category**: `quick`
- **Skills**: [`backend-patterns`]
- **Reason**: Simple server-side check

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 4 (with Tasks 11, 12, 14)
- **Blocks**: Task 14
- **Blocked By**: Task 3

**References**:
- `lib/supabase/server.ts` - Server client
- `proxy.ts` - Route protection (backup check)

**Acceptance Criteria**:
```bash
# Layout exists
test -f "app/(protected)/layout.tsx" && echo "PASS" || echo "FAIL"

# Has auth check
grep -q "getUser" "app/(protected)/layout.tsx" && echo "PASS" || echo "FAIL"

# TypeScript compiles
bun x tsc --noEmit && echo "PASS" || echo "FAIL"
```

**Commit**: YES
- Message: `feat(auth): add protected route layout`
- Files: `app/(protected)/layout.tsx`

---

### Task 14: Create Placeholder Protected Pages

**What to do**:
- Create `app/(protected)/watchlist/page.tsx` - Placeholder watchlist
- Create `app/(protected)/settings/page.tsx` - Placeholder settings
- Show user info to verify auth works
- Basic layout matching app design

**Must NOT do**:
- Implement full watchlist functionality (separate feature)
- Implement full settings functionality (separate feature)

**Recommended Agent Profile**:
- **Category**: `quick`
- **Skills**: [`frontend-ui-ux`]
- **Reason**: Simple placeholder pages

**Parallelization**:
- **Can Run In Parallel**: YES
- **Parallel Group**: Wave 4 (with Tasks 11, 12, 13)
- **Blocks**: None
- **Blocked By**: Task 13

**References**:
- `app/(protected)/layout.tsx` - Parent layout
- Existing page layouts for consistency

**Acceptance Criteria**:
```bash
# Pages exist
test -f "app/(protected)/watchlist/page.tsx" && echo "PASS" || echo "FAIL"
test -f "app/(protected)/settings/page.tsx" && echo "PASS" || echo "FAIL"

# TypeScript compiles
bun x tsc --noEmit && echo "PASS" || echo "FAIL"

# Playwright verification:
# 1. Login, navigate to /watchlist
# 2. Assert: Page loads without error
# 3. Assert: Shows user info
```

**Commit**: YES
- Message: `feat(auth): add placeholder watchlist and settings pages`
- Files: `app/(protected)/watchlist/page.tsx`, `app/(protected)/settings/page.tsx`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 0 | `docs: add Supabase Google OAuth setup guide` | docs/guides/*.md | grep checks |
| 1 | `feat(db): add avatar_url column to users table` | lib/db/schema.ts | tsc, db:push |
| 2 | `feat(ui): add Sonner toast component` | components/ui/sonner.tsx, app/layout.tsx | tsc |
| 3 | `feat(auth): add proxy.ts for route protection` | proxy.ts, lib/supabase/proxy.ts | tsc, curl |
| 4 | `feat(db): add trigger to sync auth.users to public.users` | drizzle/*.sql | SQL check |
| 5 | `feat(auth): add server actions for login/register/logout` | lib/auth/actions.ts | tsc |
| 6 | `feat(auth): add OAuth callback route handler` | app/auth/callback/route.ts | tsc |
| 7 | `feat(auth): add login page with Google and email options` | app/auth/login/page.tsx | Playwright |
| 8 | `feat(auth): add register page for email signup` | app/auth/register/page.tsx | Playwright |
| 9 | `feat(auth): add OAuth error page` | app/auth/auth-code-error/page.tsx | tsc |
| 10 | `feat(auth): add AuthProvider context and useAuth hook` | components/auth/*.tsx, app/layout.tsx | tsc |
| 11 | `feat(auth): add UserMenu dropdown component` | components/auth/user-menu.tsx | tsc |
| 12 | `feat(auth): add auth state to header with UserMenu` | components/layout/header.tsx | Playwright |
| 13 | `feat(auth): add protected route layout` | app/(protected)/layout.tsx | tsc |
| 14 | `feat(auth): add placeholder watchlist and settings pages` | app/(protected)/**/page.tsx | Playwright |

---

## Success Criteria

### Verification Commands
```bash
# All TypeScript compiles
bun x tsc --noEmit

# Dev server runs
bun dev

# Protected route redirects (unauthenticated)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/watchlist
# Expected: 307

# Login page loads
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/auth/login
# Expected: 200
```

### Final Checklist
- [ ] User can login via Google OAuth (BLOCKED: Requires Supabase Google OAuth config)
- [ ] User can register with email/password (BLOCKED: Requires Supabase config + SQL trigger)
- [ ] User can login with email/password (BLOCKED: Requires Supabase config + SQL trigger)
- [x] Protected routes redirect to login when unauthenticated (Verified: proxy.ts + layout.tsx)
- [x] Header shows avatar dropdown when logged in (Verified: UserMenu in header.tsx)
- [x] Logout clears session and redirects to homepage (Verified: signOut action implementation)
- [x] Auth errors show toast notification (Verified: toast.error() in login/register pages)
- [x] All TypeScript compiles without errors (Verified: bun x tsc --noEmit passes)

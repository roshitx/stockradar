# StockRadar Phase 1: Project Setup & Landing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Initialize Next.js 16 project with Bun, configure Drizzle ORM with Supabase, create database schema with migrations, and build a stunning "Luxury Financial Terminal" landing page.

**Architecture:** Server-first Next.js 16 App Router with React Server Components. Supabase for PostgreSQL database and authentication. Drizzle ORM for type-safe database operations. ShadCN/UI for accessible components with custom glass morphism styling.

**Tech Stack:** Bun, Next.js 16, TypeScript 5.x, Tailwind CSS 3.x, ShadCN/UI, Supabase, Drizzle ORM, Geist fonts, next-themes

---

## Task 1: Initialize Next.js 16 Project with Bun

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `.env.example`

**Step 1: Create Next.js 16 project**

Run:
```bash
cd /Volumes/WORKSPACES/02-AREAS/mini-projects/stockradar
bunx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --turbopack
```

Expected: Project scaffolded with App Router structure

**Step 2: Verify installation**

Run: `bun dev`
Expected: Dev server starts at http://localhost:3000

**Step 3: Create environment template**

Create `.env.example`:
```env
# Datasaham API
DATASAHAM_API_KEY=your_api_key_here
DATASAHAM_API_URL=https://api.datasaham.io

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database (Supabase Postgres direct connection)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 16 project with Bun and Tailwind"
```

---

## Task 2: Configure Geist Fonts & Base Typography

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Step 1: Update layout with Geist fonts**

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockRadar - Indonesian Stock Analysis",
  description: "Track Indonesian stocks with confidence. Real-time IDX data, charts, and personal watchlists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

**Step 2: Install Geist font package**

Run: `bun add geist`

**Step 3: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: configure Geist fonts for premium typography"
```

---

## Task 3: Setup Complete Design System (globals.css)

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

**Step 1: Replace globals.css with full design system**

Replace `app/globals.css`:
```css
@import "tailwindcss";

@layer base {
  :root {
    /* === SEMANTIC COLORS === */

    /* Backgrounds */
    --background: 0 0% 100%;
    --background-subtle: 0 0% 98%;
    --background-muted: 0 0% 96%;

    /* Foregrounds */
    --foreground: 0 0% 3.9%;
    --foreground-muted: 0 0% 45%;
    --foreground-subtle: 0 0% 63%;

    /* Cards & Surfaces */
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --card-border: 0 0% 89.8%;

    /* Glass Effect (Light) */
    --glass-background: 0 0% 100% / 0.7;
    --glass-border: 0 0% 100% / 0.2;
    --glass-blur: 12px;

    /* === FINANCIAL SEMANTICS === */

    /* Positive (Gains) - Emerald */
    --positive: 158 64% 40%;
    --positive-foreground: 158 64% 98%;
    --positive-muted: 158 45% 92%;
    --positive-subtle: 158 45% 96%;

    /* Negative (Losses) - Rose */
    --negative: 350 89% 55%;
    --negative-foreground: 350 89% 98%;
    --negative-muted: 350 70% 93%;
    --negative-subtle: 350 70% 96%;

    /* Neutral (No Change) */
    --neutral: 0 0% 63%;
    --neutral-foreground: 0 0% 98%;

    /* === INTERACTIVE === */

    /* Primary */
    --primary: 220 70% 50%;
    --primary-foreground: 0 0% 98%;
    --primary-hover: 220 70% 45%;

    /* Secondary */
    --secondary: 220 14% 96%;
    --secondary-foreground: 220 9% 46%;

    /* Accent */
    --accent: 38 92% 50%;
    --accent-foreground: 38 92% 10%;

    /* Destructive */
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;

    /* Muted */
    --muted: 0 0% 96%;
    --muted-foreground: 0 0% 45%;

    /* === COMPONENT TOKENS === */

    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 220 70% 50%;
    --radius: 0.75rem;

    /* Chart Colors */
    --chart-1: 158 64% 40%;
    --chart-2: 220 70% 50%;
    --chart-3: 38 92% 50%;
    --chart-4: 280 65% 60%;
    --chart-5: 350 89% 55%;

    /* Popover */
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;

    /* Sidebar */
    --sidebar: 0 0% 98%;
    --sidebar-foreground: 0 0% 3.9%;
    --sidebar-primary: 220 70% 50%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 0 0% 96%;
    --sidebar-accent-foreground: 0 0% 3.9%;
    --sidebar-border: 0 0% 89.8%;
    --sidebar-ring: 220 70% 50%;
  }

  .dark {
    /* === SEMANTIC COLORS === */

    /* Backgrounds */
    --background: 0 0% 4%;
    --background-subtle: 0 0% 7%;
    --background-muted: 0 0% 10%;

    /* Foregrounds */
    --foreground: 0 0% 95%;
    --foreground-muted: 0 0% 64%;
    --foreground-subtle: 0 0% 45%;

    /* Cards & Surfaces */
    --card: 0 0% 7%;
    --card-foreground: 0 0% 95%;
    --card-border: 0 0% 15%;

    /* Glass Effect (Dark) */
    --glass-background: 0 0% 10% / 0.6;
    --glass-border: 0 0% 100% / 0.08;
    --glass-blur: 16px;

    /* === FINANCIAL SEMANTICS === */

    /* Positive (Gains) - Emerald */
    --positive: 158 64% 52%;
    --positive-foreground: 158 64% 10%;
    --positive-muted: 158 35% 15%;
    --positive-subtle: 158 35% 10%;

    /* Negative (Losses) - Rose */
    --negative: 350 89% 60%;
    --negative-foreground: 350 89% 10%;
    --negative-muted: 350 50% 15%;
    --negative-subtle: 350 50% 10%;

    /* Neutral */
    --neutral: 0 0% 50%;
    --neutral-foreground: 0 0% 10%;

    /* === INTERACTIVE === */

    --primary: 220 70% 55%;
    --primary-foreground: 0 0% 98%;
    --primary-hover: 220 70% 60%;

    --secondary: 220 10% 15%;
    --secondary-foreground: 220 10% 70%;

    --accent: 38 92% 55%;
    --accent-foreground: 38 92% 10%;

    --destructive: 0 62% 50%;
    --destructive-foreground: 0 0% 98%;

    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 64%;

    /* === COMPONENT TOKENS === */

    --border: 0 0% 15%;
    --input: 0 0% 15%;
    --ring: 220 70% 55%;

    /* Popover */
    --popover: 0 0% 7%;
    --popover-foreground: 0 0% 95%;

    /* Sidebar */
    --sidebar: 0 0% 7%;
    --sidebar-foreground: 0 0% 95%;
    --sidebar-primary: 220 70% 55%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 0 0% 15%;
    --sidebar-accent-foreground: 0 0% 95%;
    --sidebar-border: 0 0% 15%;
    --sidebar-ring: 220 70% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  html {
    scroll-behavior: smooth;
    color-scheme: light;
  }

  html.dark {
    color-scheme: dark;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  /* Tabular numerals for financial data */
  .font-tabular {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum" 1;
  }

  /* Focus visible for accessibility */
  *:focus-visible {
    @apply outline-2 outline-offset-2 outline-ring rounded-sm;
  }

  /* Text wrapping for headings */
  h1, h2, h3, h4, h5, h6 {
    text-wrap: balance;
  }

  p {
    text-wrap: pretty;
  }
}

/* Price display typography */
.price-display {
  font-family: var(--font-geist-mono);
  font-size: 1.5rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

/* Percentage badge */
.percentage {
  font-family: var(--font-geist-mono);
  font-size: 0.875rem;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Step 2: Update tailwind.config.ts with extended theme**

Replace `tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
      },
      fontSize: {
        "display-1": ["3rem", { lineHeight: "1.1", fontWeight: "600" }],
        "display-2": ["2.25rem", { lineHeight: "1.15", fontWeight: "600" }],
        "heading-1": ["1.875rem", { lineHeight: "1.2", fontWeight: "600" }],
        "heading-2": ["1.5rem", { lineHeight: "1.25", fontWeight: "600" }],
        "heading-3": ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        positive: {
          DEFAULT: "hsl(var(--positive))",
          foreground: "hsl(var(--positive-foreground))",
          muted: "hsl(var(--positive-muted))",
          subtle: "hsl(var(--positive-subtle))",
        },
        negative: {
          DEFAULT: "hsl(var(--negative))",
          foreground: "hsl(var(--negative-foreground))",
          muted: "hsl(var(--negative-muted))",
          subtle: "hsl(var(--negative-subtle))",
        },
        neutral: {
          DEFAULT: "hsl(var(--neutral))",
          foreground: "hsl(var(--neutral-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-8px)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.15s ease-in",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

**Step 3: Install tailwindcss-animate**

Run: `bun add tailwindcss-animate`

**Step 4: Commit**

```bash
git add app/globals.css tailwind.config.ts
git commit -m "feat: implement complete design system with financial semantics"
```

---

## Task 4: Initialize ShadCN/UI

**Files:**
- Create: `components.json`
- Create: `lib/utils.ts`
- Create: `components/ui/button.tsx`

**Step 1: Initialize ShadCN**

Run:
```bash
bunx shadcn@latest init
```

Select options:
- Style: New York
- Base color: Neutral
- CSS variables: Yes

**Step 2: Add essential components**

Run:
```bash
bunx shadcn@latest add button card input skeleton
```

**Step 3: Verify utils.ts exists**

Ensure `lib/utils.ts` contains:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: initialize ShadCN/UI with base components"
```

---

## Task 5: Setup next-themes for Dark/Light Mode

**Files:**
- Create: `components/providers/theme-provider.tsx`
- Modify: `app/layout.tsx`
- Create: `components/layout/theme-toggle.tsx`

**Step 1: Install next-themes**

Run: `bun add next-themes`

**Step 2: Create ThemeProvider**

Create `components/providers/theme-provider.tsx`:
```tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

**Step 3: Create ThemeToggle component**

Create `components/layout/theme-toggle.tsx`:
```tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

**Step 4: Install lucide-react**

Run: `bun add lucide-react`

**Step 5: Update layout.tsx with providers**

Update `app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockRadar - Indonesian Stock Analysis",
  description: "Track Indonesian stocks with confidence. Real-time IDX data, charts, and personal watchlists.",
  metadataBase: new URL("https://stockradar.id"),
  openGraph: {
    title: "StockRadar - Indonesian Stock Analysis",
    description: "Track Indonesian stocks with confidence",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="hsl(0 0% 4%)" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="hsl(0 0% 100%)" media="(prefers-color-scheme: light)" />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add dark/light theme toggle with next-themes"
```

---

## Task 6: Install & Configure Drizzle ORM

**Files:**
- Create: `drizzle.config.ts`
- Create: `lib/db/index.ts`
- Create: `lib/db/schema.ts`

**Step 1: Install Drizzle packages**

Run:
```bash
bun add drizzle-orm @supabase/supabase-js postgres
bun add -D drizzle-kit
```

**Step 2: Create drizzle.config.ts**

Create `drizzle.config.ts`:
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

**Step 3: Create database connection**

Create `lib/db/index.ts`:
```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
```

**Step 4: Create database schema**

Create `lib/db/schema.ts`:
```typescript
import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";

// users - Extended from Supabase Auth
export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // references auth.users
  email: text("email").notNull(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// watchlists - User stock watchlist
export const watchlists = pgTable(
  "watchlists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    symbol: text("symbol").notNull(), // e.g., "BBCA"
    addedAt: timestamp("added_at").defaultNow().notNull(),
    notes: text("notes"),
  },
  (table) => ({
    uniqueUserSymbol: unique().on(table.userId, table.symbol),
  })
);

// api_cache - Cache Datasaham API responses
export const apiCache = pgTable("api_cache", {
  id: uuid("id").primaryKey().defaultRandom(),
  endpoint: text("endpoint").notNull().unique(), // e.g., "/api/chart/BBCA/1d"
  data: jsonb("data").notNull(),
  cachedAt: timestamp("cached_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Watchlist = typeof watchlists.$inferSelect;
export type NewWatchlist = typeof watchlists.$inferInsert;
export type ApiCache = typeof apiCache.$inferSelect;
export type NewApiCache = typeof apiCache.$inferInsert;
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: configure Drizzle ORM with Supabase schema"
```

---

## Task 7: Generate & Run Database Migrations

**Files:**
- Create: `drizzle/` directory with migration files

**Step 1: Generate migrations**

Run: `bun drizzle-kit generate`

Expected: Migration files created in `drizzle/` directory

**Step 2: Push schema to database**

Run: `bun drizzle-kit push`

Expected: Schema pushed to Supabase database

**Step 3: Add Drizzle scripts to package.json**

Add to `package.json` scripts:
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add database migrations and scripts"
```

---

## Task 8: Configure Supabase Clients

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`

**Step 1: Install Supabase SSR package**

Run: `bun add @supabase/ssr`

**Step 2: Create browser client**

Create `lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Step 3: Create server client**

Create `lib/supabase/server.ts`:
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
```

**Step 4: Commit**

```bash
git add lib/supabase/
git commit -m "feat: add Supabase client configurations"
```

---

## Task 9: Create Glass Card Component

**Files:**
- Create: `components/ui/glass-card.tsx`

**Step 1: Create GlassCard component**

Create `components/ui/glass-card.tsx`:
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  elevated?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = false, elevated = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base glass effect
          "rounded-xl border",
          "bg-[hsl(var(--glass-background))]",
          "border-[hsl(var(--glass-border))]",
          "backdrop-blur-[var(--glass-blur)]",

          // Shadow for depth
          elevated
            ? "shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.48)]"
            : "shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.32)]",

          // Optional hover effect
          hover && [
            "transition-all duration-200",
            "hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)]",
            "dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.48)]",
            "hover:border-[hsl(var(--glass-border)/0.3)]",
          ],

          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
```

**Step 2: Commit**

```bash
git add components/ui/glass-card.tsx
git commit -m "feat: add GlassCard component with frosted effect"
```

---

## Task 10: Create Price Badge Component

**Files:**
- Create: `components/stocks/price-badge.tsx`

**Step 1: Create PriceBadge component**

Create `components/stocks/price-badge.tsx`:
```tsx
import * as React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceBadgeProps {
  value: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "text-xs px-1.5 py-0.5 gap-0.5",
  md: "text-sm px-2 py-1 gap-1",
  lg: "text-base px-3 py-1.5 gap-1.5",
};

const iconSizes = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function PriceBadge({
  value,
  size = "md",
  showIcon = true,
  className,
}: PriceBadgeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  return (
    <span
      role="status"
      aria-label={`Price change: ${isPositive ? "up" : isNegative ? "down" : "unchanged"} ${Math.abs(value).toFixed(2)} percent`}
      className={cn(
        "inline-flex items-center rounded-md font-mono font-medium",
        sizeClasses[size],
        isPositive && "bg-positive-subtle text-positive",
        isNegative && "bg-negative-subtle text-negative",
        !isPositive && !isNegative && "bg-muted text-muted-foreground",
        className
      )}
    >
      {showIcon && (
        <>
          {isPositive && (
            <TrendingUp className={iconSizes[size]} aria-hidden="true" />
          )}
          {isNegative && (
            <TrendingDown className={iconSizes[size]} aria-hidden="true" />
          )}
          {!isPositive && !isNegative && (
            <Minus className={iconSizes[size]} aria-hidden="true" />
          )}
        </>
      )}
      <span className="font-tabular">
        {isPositive && "+"}
        {value.toFixed(2)}%
      </span>
    </span>
  );
}
```

**Step 2: Commit**

```bash
git add components/stocks/price-badge.tsx
git commit -m "feat: add PriceBadge component with semantic colors"
```

---

## Task 11: Create Header Component

**Files:**
- Create: `components/layout/header.tsx`

**Step 1: Create Header component**

Create `components/layout/header.tsx`:
```tsx
import * as React from "react";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">
            Stock<span className="text-primary">Radar</span>
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden flex-1 max-w-md mx-8 md:block">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search stocks…"
              aria-label="Search stocks"
              className={cn(
                "h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4",
                "text-sm placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "transition-colors"
              )}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          {/* Auth Button */}
          <Button variant="default" size="sm" className="hidden sm:flex">
            Sign In
          </Button>

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
```

**Step 2: Commit**

```bash
git add components/layout/header.tsx
git commit -m "feat: add Header component with search and navigation"
```

---

## Task 12: Create Footer Component

**Files:**
- Create: `components/layout/footer.tsx`

**Step 1: Create Footer component**

Create `components/layout/footer.tsx`:
```tsx
import * as React from "react";
import Link from "next/link";

const footerLinks = {
  product: [
    { label: "Stocks", href: "/stocks" },
    { label: "Sectors", href: "/sectors" },
    { label: "Watchlist", href: "/watchlist" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">
                  S
                </span>
              </div>
              <span className="text-xl font-semibold">
                Stock<span className="text-primary">Radar</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Track Indonesian stocks with confidence.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Product
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Attribution */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Data
            </h3>
            <p className="text-sm text-muted-foreground">
              Market data provided by{" "}
              <a
                href="https://datasaham.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Datasaham.io
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} StockRadar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Commit**

```bash
git add components/layout/footer.tsx
git commit -m "feat: add Footer component with links and attribution"
```

---

## Task 13: Build Landing Page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Create stunning landing page**

Replace `app/page.tsx`:
```tsx
import { ArrowRight, TrendingUp, BarChart3, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { PriceBadge } from "@/components/stocks/price-badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// Mock data for demo (will be replaced with real API data)
const trendingStocks = [
  { symbol: "BBCA", name: "Bank Central Asia", price: 9250, change: 2.5 },
  { symbol: "BMRI", name: "Bank Mandiri", price: 6450, change: 1.89 },
  { symbol: "TLKM", name: "Telkom Indonesia", price: 3820, change: -0.52 },
  { symbol: "ASII", name: "Astra International", price: 5775, change: 0.87 },
];

const topGainers = [
  { symbol: "ARTO", change: 24.76 },
  { symbol: "BUKA", change: 18.52 },
  { symbol: "GOTO", change: 15.38 },
];

const topLosers = [
  { symbol: "SMDR", change: -8.24 },
  { symbol: "MDKA", change: -6.15 },
  { symbol: "ANTM", change: -4.92 },
];

const features = [
  {
    icon: BarChart3,
    title: "Real-time Charts",
    description: "Professional candlestick charts with multiple timeframes",
  },
  {
    icon: Star,
    title: "Personal Watchlist",
    description: "Track your favorite stocks with custom notes",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    description: "Optimized caching for instant data access",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

          <div className="container mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-display-1 tracking-tight sm:text-5xl lg:text-6xl">
                Track Indonesian Stocks{" "}
                <span className="text-primary">with Confidence</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Real-time IDX market data, professional charts, and personal
                watchlists. Built for Indonesian investors who demand clarity
                and speed.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="outline" size="lg">
                  Browse Stocks
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Market Overview Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* IHSG Card */}
              <GlassCard className="p-6" elevated>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      IHSG
                    </p>
                    <p className="mt-1 text-2xl font-semibold font-mono font-tabular">
                      7,234.56
                    </p>
                  </div>
                  <PriceBadge value={0.45} size="lg" />
                </div>
                <div className="mt-4 h-16 rounded-md bg-positive/10">
                  {/* Placeholder for mini chart */}
                </div>
              </GlassCard>

              {/* Top Gainers */}
              <GlassCard className="p-6">
                <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp
                    className="h-4 w-4 text-positive"
                    aria-hidden="true"
                  />
                  Top Gainers
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {topGainers.map((stock) => (
                    <li
                      key={stock.symbol}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">{stock.symbol}</span>
                      <PriceBadge value={stock.change} size="sm" />
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Top Losers */}
              <GlassCard className="p-6">
                <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp
                    className="h-4 w-4 rotate-180 text-negative"
                    aria-hidden="true"
                  />
                  Top Losers
                </h3>
                <ul className="mt-4 space-y-3" role="list">
                  {topLosers.map((stock) => (
                    <li
                      key={stock.symbol}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">{stock.symbol}</span>
                      <PriceBadge value={stock.change} size="sm" />
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Trending Stocks Section */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-1">Trending Stocks</h2>
              <Button variant="ghost" className="gap-1">
                View All
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {trendingStocks.map((stock) => (
                <GlassCard key={stock.symbol} hover className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          {stock.symbol}
                        </span>
                        <PriceBadge value={stock.change} size="sm" />
                      </div>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {stock.name}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-mono text-xl font-semibold font-tabular">
                      Rp {formatCurrency(stock.price)}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-heading-1">
                Everything You Need to Track the Market
              </h2>
              <p className="mt-4 text-muted-foreground">
                Professional-grade tools designed for Indonesian retail
                investors.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <GlassCard
              className="relative overflow-hidden p-8 sm:p-12"
              elevated
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-display-2">
                  Ready to Start Tracking?
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Create your free account and start building your watchlist
                  today.
                </p>
                <div className="mt-8">
                  <Button size="lg" className="gap-2">
                    Create Free Account
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
```

**Step 2: Verify the page renders**

Run: `bun dev`
Navigate to: http://localhost:3000
Expected: Landing page with hero, market overview, trending stocks, features, and CTA

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: create stunning landing page with Luxury Financial Terminal design"
```

---

## Task 14: Final Verification & Cleanup

**Step 1: Run development server**

Run: `bun dev`
Expected: No errors, page loads correctly

**Step 2: Test dark/light mode toggle**

- Click theme toggle button
- Verify colors switch correctly
- Test both modes

**Step 3: Run type check**

Run: `bun run build`
Expected: Build completes without errors

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: Phase 1 complete - project setup and landing page"
```

---

## Verification Checklist

- [ ] `bun dev` starts without errors
- [ ] Landing page renders at http://localhost:3000
- [ ] Dark/light theme toggle works
- [ ] Geist fonts load correctly (check DevTools → Network → Fonts)
- [ ] Glass cards have frosted effect
- [ ] Price badges show correct colors (green for positive, red for negative)
- [ ] `bun run build` completes successfully
- [ ] All commits are made

---

## Files Created/Modified Summary

| File | Action |
|------|--------|
| `package.json` | Created (Next.js init) |
| `next.config.ts` | Created (Next.js init) |
| `tsconfig.json` | Created (Next.js init) |
| `.env.example` | Created |
| `app/layout.tsx` | Modified |
| `app/globals.css` | Modified |
| `app/page.tsx` | Modified |
| `tailwind.config.ts` | Modified |
| `drizzle.config.ts` | Created |
| `lib/db/index.ts` | Created |
| `lib/db/schema.ts` | Created |
| `lib/supabase/client.ts` | Created |
| `lib/supabase/server.ts` | Created |
| `lib/utils.ts` | Created (ShadCN) |
| `components.json` | Created (ShadCN) |
| `components/ui/button.tsx` | Created (ShadCN) |
| `components/ui/card.tsx` | Created (ShadCN) |
| `components/ui/input.tsx` | Created (ShadCN) |
| `components/ui/skeleton.tsx` | Created (ShadCN) |
| `components/ui/glass-card.tsx` | Created |
| `components/stocks/price-badge.tsx` | Created |
| `components/layout/header.tsx` | Created |
| `components/layout/footer.tsx` | Created |
| `components/layout/theme-toggle.tsx` | Created |
| `components/providers/theme-provider.tsx` | Created |

---

## Web Interface Guidelines Compliance

This implementation follows Vercel Web Interface Guidelines:

- ✅ All icon-only buttons have `aria-label`
- ✅ Form inputs have proper labels
- ✅ Semantic HTML used (`<header>`, `<main>`, `<footer>`, `<nav>`)
- ✅ Focus states use `focus-visible:ring-*`
- ✅ `prefers-reduced-motion` respected in CSS
- ✅ Typography uses `text-wrap: balance` for headings
- ✅ Financial numbers use `font-variant-numeric: tabular-nums`
- ✅ `color-scheme` set for dark mode
- ✅ `theme-color` meta tags match page background
- ✅ Decorative icons have `aria-hidden="true"`
- ✅ Price badges have `role="status"` with descriptive `aria-label`

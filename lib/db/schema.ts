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
  avatarUrl: text("avatar_url"),
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

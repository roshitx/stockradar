-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;

-- ========================================
-- USERS TABLE POLICIES
-- ========================================

-- Users can read only their own profile
CREATE POLICY "users_select_own"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Prevent direct deletion (handle via Supabase Auth)
CREATE POLICY "users_prevent_delete"
  ON users FOR DELETE
  USING (false);

-- ========================================
-- WATCHLISTS TABLE POLICIES (MOST CRITICAL)
-- ========================================

-- Users can read only their own watchlist
CREATE POLICY "watchlists_select_own"
  ON watchlists FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert only to their own watchlist
CREATE POLICY "watchlists_insert_own"
  ON watchlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update only their own watchlist entries
CREATE POLICY "watchlists_update_own"
  ON watchlists FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete only their own watchlist entries
CREATE POLICY "watchlists_delete_own"
  ON watchlists FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- API_CACHE TABLE POLICIES (PUBLIC READ)
-- ========================================

-- Everyone (including anonymous) can read cache
CREATE POLICY "api_cache_public_read"
  ON api_cache FOR SELECT
  USING (true);

-- Prevent direct writes (only via service role in Next.js API)
CREATE POLICY "api_cache_no_insert"
  ON api_cache FOR INSERT
  WITH CHECK (false);

CREATE POLICY "api_cache_no_update"
  ON api_cache FOR UPDATE
  USING (false);

CREATE POLICY "api_cache_no_delete"
  ON api_cache FOR DELETE
  USING (false);

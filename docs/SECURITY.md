# Security Guidelines

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### Users Table
- **SELECT**: Users can only read their own profile
- **UPDATE**: Users can only update their own profile
- **DELETE**: Disabled (use Supabase Auth)

### Watchlists Table
- **SELECT/INSERT/UPDATE/DELETE**: Users can only access their own watchlist entries
- Foreign key constraint ensures `user_id` matches authenticated user

### API Cache Table
- **SELECT**: Public read access (including anonymous users)
- **INSERT/UPDATE/DELETE**: Blocked via RLS (use service role key server-side)

## Service Role Usage

For server-side cache writes, use service role key:

```typescript
// lib/supabase/admin.ts (future)
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

## Testing RLS

Manual verification:
1. Sign in as User A
2. Attempt to access User B's watchlist via browser console
3. Verify request is denied by RLS

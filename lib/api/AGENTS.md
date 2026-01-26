# lib/api/ — DATA LAYER

Datasaham.io API client with caching and Yahoo Finance fallback.

## STRUCTURE

```
lib/api/
├── datasaham.ts    # Main client (cached fetches)
├── yahoo-finance.ts # Fallback for chart data
├── types.ts        # TypeScript interfaces
├── mock-data.ts    # Development mock data
└── index.ts        # Re-exports
```

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Add new Datasaham endpoint | `datasaham.ts` | Follow `getCachedOrFetch` pattern |
| Add/modify types | `types.ts` | Export all interfaces |
| Chart data issues | `yahoo-finance.ts` | Primary source for OHLCV |

## CONVENTIONS

### Caching
```typescript
// Always use getCachedOrFetch, never raw fetch
const data = await getCachedOrFetch<T>(endpoint, CACHE_DURATIONS.movers);
```

### Cache Durations (minutes)
| Data Type | Duration |
|-----------|----------|
| `stockList` | 60 |
| `stockDetail` | 15 |
| `chartIntraday` | 5 |
| `chartDaily` | 60 |
| `trending` | 5 |
| `movers` | 5 |

### Response Transformation
- Datasaham returns nested `{ success, data: { message, data } }`
- Always transform via `transformDatasaham*` functions
- Parse string numbers: `parseFloat(stock.last || "0")`

### Error Handling
```typescript
throw new DatasahamError(message, statusCode, endpoint);
```

## ANTI-PATTERNS

- **Never** call `fetchFromAPI` directly from components
- **Never** skip transformation functions
- **Never** cache with wrong duration (use `CACHE_DURATIONS` constants)

## NOTES

- Yahoo Finance used as primary for charts (more reliable for IDX)
- API key via `DATASAHAM_API_KEY` env var
- Cache stored in `api_cache` table (Supabase)

# Datasaham API Endpoints Reference

> Endpoints needed for StockRadar MVP implementation.

---

## Authentication

All endpoints require `x-api-key` header:
```
x-api-key: {DATASAHAM_API_KEY}
```

---

## Main Endpoints

### Search Stocks
```
GET /api/main/search?keyword={query}&page={page}&type=company
```
- **Use Case:** Stock list page search
- **Cache:** 5 minutes
- **Response:** Array of matching companies

### Trending Stocks
```
GET /api/main/trending
```
- **Use Case:** Homepage carousel, stock list "Trending" tab
- **Cache:** 5 minutes
- **Response:** Array of trending stocks with symbol, name, price, percent
- **Status:** ✅ Implemented

---

## Movers Endpoints

### Top Gainer
```
GET /api/movers/top-gainer
```
- **Use Case:** Homepage top gainers, stock list tab
- **Cache:** 5 minutes
- **Status:** ✅ Implemented

### Top Loser
```
GET /api/movers/top-loser
```
- **Use Case:** Homepage top losers, stock list tab
- **Cache:** 5 minutes
- **Status:** ✅ Implemented

### Top Volume
```
GET /api/movers/top-volume
```
- **Use Case:** Stock list "Top Volume" tab
- **Cache:** 5 minutes
- **Status:** ⬜ Needs implementation

### Top Value
```
GET /api/movers/top-value
```
- **Use Case:** Stock list "Top Value" tab
- **Cache:** 5 minutes
- **Status:** ⬜ Needs implementation

### Filter Options
```
filterStocks[] = FILTER_STOCKS_TYPE_MAIN_BOARD
filterStocks[] = FILTER_STOCKS_TYPE_DEVELOPMENT_BOARD
filterStocks[] = FILTER_STOCKS_TYPE_ACCELERATION_BOARD
filterStocks[] = FILTER_STOCKS_TYPE_NEW_ECONOMY_BOARD
```

---

## Emiten (Stock Detail) Endpoints

### Stock Info
```
GET /api/emiten/{symbol}/info
```
- **Use Case:** Stock detail page header
- **Cache:** 15 minutes
- **Response:**
  - symbol, name, sector, subsector
  - price, open, high, low, close
  - change, changePercent
  - volume, value, frequency
  - marketCap

### Company Profile
```
GET /api/emiten/{symbol}/profile
```
- **Use Case:** Stock detail "Profile" section
- **Cache:** 1 hour
- **Response:**
  - Company background/history
  - Executives/management
  - Major shareholders
  - Subsidiaries

### Key Statistics
```
GET /api/emiten/{symbol}/keystats?year_limit=10
```
- **Use Case:** Stock detail key metrics
- **Cache:** 1 hour
- **Response:**
  - Valuation: P/E, P/B, EV/EBITDA
  - Profitability: ROE, ROA, Net Margin
  - Growth: Revenue growth, EPS growth
  - Historical data (up to 10 years)

### Financial Statements
```
GET /api/emiten/{symbol}/financials?report_type={1-3}&statement_type={1-13}
```
- **Use Case:** Stock detail financials tab (future)
- **Cache:** 1 hour
- **Report Types:**
  - 1 = Income Statement
  - 2 = Balance Sheet
  - 3 = Cash Flow
- **Statement Types:**
  - 1 = Quarterly
  - 2 = Annual
  - 3 = TTM
  - 4-8 = Q1-Q4 / YTD
  - 9-13 = Growth rates

### Insider Trading
```
GET /api/emiten/{symbol}/insider?page=1&limit=20
```
- **Use Case:** Stock detail insider tab
- **Cache:** 15 minutes
- **Filters:** action_type (BUY/SELL), date_start, date_end

### Orderbook (Real-time)
```
GET /api/emiten/{symbol}/orderbook
```
- **Use Case:** Real-time bid/ask (future feature)
- **Cache:** NO CACHE
- **Response:** Bid/offer prices and volumes

### Foreign Ownership
```
GET /api/emiten/{symbol}/foreign-ownership
```
- **Use Case:** Institutional ownership analysis (future)
- **Cache:** 1 hour
- **Response:** Foreign funds (Vanguard, BlackRock, etc.)

---

## Chart Endpoints

### OHLCV Chart Data
```
GET /api/chart/{symbol}/{timeframe}?from={YYYY-MM-DD}&to={YYYY-MM-DD}
```
- **Use Case:** Stock detail candlestick chart
- **Timeframes:**
  - `daily` - Daily candles
  - `15m`, `30m`, `1h`, `2h`, `3h`, `4h` - Intraday
- **Cache:** 5 min (intraday), 60 min (daily)
- **Response:** Array of OHLCV candles

**Timeframe Mapping for UI:**
| Display | API Timeframe | Date Range |
|---------|---------------|------------|
| 1D | daily | Last 1 day |
| 1W | daily | Last 7 days |
| 1M | daily | Last 30 days |
| 3M | daily | Last 90 days |
| 1Y | daily | Last 365 days |

---

## Implementation Priority

### Phase 2 (Stock Pages) - Required

| Priority | Endpoint | Page |
|----------|----------|------|
| 1 | `/api/main/search` | Stock List |
| 2 | `/api/movers/top-volume` | Stock List |
| 3 | `/api/movers/top-value` | Stock List |
| 4 | `/api/emiten/{symbol}/info` | Stock Detail |
| 5 | `/api/emiten/{symbol}/profile` | Stock Detail |
| 6 | `/api/emiten/{symbol}/keystats` | Stock Detail |
| 7 | `/api/chart/{symbol}/{tf}` | Stock Detail |

### Phase 2+ (Future) - Optional

| Endpoint | Feature |
|----------|---------|
| `/api/emiten/{symbol}/insider` | Insider trades tab |
| `/api/emiten/{symbol}/financials` | Financials tab |
| `/api/emiten/{symbol}/orderbook` | Real-time orderbook |
| `/api/emiten/{symbol}/foreign-ownership` | Ownership analysis |

---

## Known Limitations

1. **IHSG Chart** - `/api/chart/^JKSE/daily` returns 500 error
   - Workaround: Use mock data or `/api/global/indices-impact`

2. **Trending Volume/Value** - Not provided by trending endpoint
   - Set to 0 in transformation

3. **Search Pagination** - Uses page index (0-based), not cursor

---

## Response Structures

### Trending Stock Response
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "symbol": "BBCA",
        "name": "Bank Central Asia Tbk",
        "last": "9250",
        "previous": "9025",
        "percent": "2.50"
      }
    ]
  }
}
```

### Mover Response
```json
{
  "success": true,
  "data": {
    "data": {
      "mover_list": [
        {
          "stock_detail": {
            "code": "BBCA",
            "name": "Bank Central Asia Tbk"
          },
          "price": 9250,
          "change": { "value": 225, "percent": 2.50 },
          "volume": 45200000,
          "value": 418100000000
        }
      ]
    }
  }
}
```

### Stock Info Response
```json
{
  "success": true,
  "data": {
    "symbol": "BBCA",
    "name": "Bank Central Asia Tbk",
    "sector": "Finance",
    "subsector": "Banking",
    "price": 9250,
    "open": 9100,
    "high": 9300,
    "low": 9050,
    "close": 9250,
    "previousClose": 9025,
    "change": 225,
    "changePercent": 2.50,
    "volume": 45200000,
    "value": 418100000000,
    "marketCap": 1150000000000000
  }
}
```

---

## Testing Checklist

- [ ] Search: `/api/main/search?keyword=BBCA`
- [ ] Top Volume: `/api/movers/top-volume`
- [ ] Top Value: `/api/movers/top-value`
- [ ] Stock Info: `/api/emiten/BBCA/info`
- [ ] Profile: `/api/emiten/BBCA/profile`
- [ ] Keystats: `/api/emiten/BBCA/keystats`
- [ ] Chart: `/api/chart/BBCA/daily?from=2025-01-01&to=2026-01-20`

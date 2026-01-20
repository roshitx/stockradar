// lib/api/datasaham.ts

import { db } from "@/lib/db";
import { apiCache } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type {
  TrendingStock,
  MoverStock,
  IndicesImpactData,
  IHSGData,
  ChartData,
  ChartTimeframe,
  OHLCVCandle,
  SearchResult,
  StockInfo,
  StockProfile,
  StockKeyStats,
  InsiderTransaction,
} from "./types";

const API_BASE_URL = process.env.DATASAHAM_API_URL!;
const API_KEY = process.env.DATASAHAM_API_KEY!;

const CACHE_DURATIONS = {
  stockList: 60,
  stockDetail: 15,
  chartIntraday: 5,
  chartDaily: 60,
  trending: 5,
  movers: 5,
} as const;

export class DatasahamError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = "DatasahamError";
  }
}

async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new DatasahamError(
      `API request failed: ${response.statusText}`,
      response.status,
      endpoint
    );
  }

  const json = await response.json();

  // Handle nested response: { success, data: { message, data } }
  if (json.data && json.data.data) {
    return json.data.data as T;
  }

  // Fallback to simple { data } wrapper
  return json.data ?? json;
}

// Transformation functions to map API responses to our types
function transformDatasahamStock(stock: any): TrendingStock {
  const last = parseFloat(stock.last || "0");
  const previous = parseFloat(stock.previous || stock.last || "0");
  const percent = parseFloat(stock.percent || "0");
  const change = last - previous;

  return {
    symbol: stock.symbol,
    name: stock.name,
    price: last,
    change: change,
    changePercent: percent,
    volume: 0, // Not provided in trending endpoint
    value: 0,  // Not provided in trending endpoint
    frequency: 0, // Not provided in trending endpoint
  };
}

function transformDatasahamMover(item: any): MoverStock {
  // Handle mover_list structure: { stock_detail, price, change, volume, value }
  const symbol = item.stock_detail?.code || item.symbol || "";
  const name = item.stock_detail?.name || item.name || "";
  const price = item.price || parseFloat(item.last || "0");
  const changeValue = item.change?.value || parseFloat(item.change || "0");
  const changePercent = item.change?.percentage || parseFloat(item.percent || "0");
  const volume = item.volume?.raw || 0;
  const value = item.value?.raw || 0;
  const previousClose = price - changeValue;

  return {
    symbol,
    name,
    price,
    change: changeValue,
    changePercent,
    volume,
    value,
    previousClose,
  };
}

async function getCachedOrFetch<T>(
  endpoint: string,
  cacheDurationMinutes: number
): Promise<T> {
  const cached = await db.query.apiCache.findFirst({
    where: eq(apiCache.endpoint, endpoint),
  });

  const now = new Date();

  if (cached && new Date(cached.expiresAt) > now) {
    return cached.data as T;
  }

  const data = await fetchFromAPI<T>(endpoint);

  const expiresAt = new Date(now.getTime() + cacheDurationMinutes * 60 * 1000);

  await db
    .insert(apiCache)
    .values({
      endpoint,
      data: data as unknown as Record<string, unknown>,
      cachedAt: now,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: apiCache.endpoint,
      set: {
        data: data as unknown as Record<string, unknown>,
        cachedAt: now,
        expiresAt,
      },
    });

  return data;
}

export async function getTrending(): Promise<TrendingStock[]> {
  const data = await getCachedOrFetch<any[]>(
    "/api/main/trending",
    CACHE_DURATIONS.trending
  );

  return data.map(transformDatasahamStock);
}

export async function getTopGainers(): Promise<MoverStock[]> {
  const endpoint = "/api/movers/top-gainer";

  // Use caching
  const response = await getCachedOrFetch<any>(endpoint, CACHE_DURATIONS.movers);
  const data = response.mover_list || response;

  if (!Array.isArray(data)) {
    console.error("[Datasaham] top-gainer returned non-array:", data);
    throw new DatasahamError("Invalid response structure", undefined, endpoint);
  }

  return data.map((item: any) => transformDatasahamMover(item));
}

export async function getTopLosers(): Promise<MoverStock[]> {
  const endpoint = "/api/movers/top-loser";

  // Use caching
  const response = await getCachedOrFetch<any>(endpoint, CACHE_DURATIONS.movers);
  const data = response.mover_list || response;

  if (!Array.isArray(data)) {
    console.error("[Datasaham] top-loser returned non-array:", data);
    throw new DatasahamError("Invalid response structure", undefined, endpoint);
  }

  return data.map((item: any) => transformDatasahamMover(item));
}

export async function getIndicesImpact(): Promise<IndicesImpactData> {
  return getCachedOrFetch<IndicesImpactData>(
    "/api/global/indices-impact",
    CACHE_DURATIONS.movers
  );
}

export async function getIHSG(): Promise<IHSGData> {
  // IHSG chart data not available from API, use mock data
  // In production, this would be fetched from a different source or calculated from market data
  return {
    symbol: "^JKSE",
    name: "IDX Composite",
    price: 7234.56,
    change: 32.45,
    changePercent: 0.45,
    previousClose: 7202.11,
    volume: 0,
  };
}

export async function getChartData(
  symbol: string,
  timeframe: ChartTimeframe,
  from: string,
  to: string
): Promise<ChartData> {
  const endpoint = `/api/chart/${symbol.toUpperCase()}/${timeframe}?from=${from}&to=${to}`;
  const cacheDuration =
    timeframe === "daily"
      ? CACHE_DURATIONS.chartDaily
      : CACHE_DURATIONS.chartIntraday;

  const response = await getCachedOrFetch<any>(endpoint, cacheDuration);

  // API returns { chartbit: [...], last_data, allow_decimal, previous_timestamp }
  // Extract the chartbit array which contains OHLCV data
  const rawData = response.chartbit || response.data || response || [];

  // Transform chartbit format to our OHLCVCandle format
  const data: OHLCVCandle[] = Array.isArray(rawData)
    ? rawData.map((candle: any) => ({
        timestamp: candle.timestamp || candle.time || candle.t || 0,
        open: parseFloat(candle.open || candle.o || "0"),
        high: parseFloat(candle.high || candle.h || "0"),
        low: parseFloat(candle.low || candle.l || "0"),
        close: parseFloat(candle.close || candle.c || "0"),
        volume: parseInt(candle.volume || candle.v || "0", 10),
      }))
    : [];

  return {
    symbol: symbol.toUpperCase(),
    timeframe,
    data,
  };
}

export async function searchStocks(keyword: string): Promise<SearchResult[]> {
  const endpoint = `/api/main/search?keyword=${encodeURIComponent(keyword)}`;
  const response = await getCachedOrFetch<any>(endpoint, CACHE_DURATIONS.movers);

  if (!Array.isArray(response)) {
    return [];
  }

  return response.map((item: any) => ({
    symbol: item.symbol || item.code || "",
    name: item.name || "",
    type: item.type,
    sector: item.sector,
  }));
}

export async function getTopVolume(): Promise<MoverStock[]> {
  const endpoint = "/api/movers/top-volume";
  const response = await getCachedOrFetch<any>(endpoint, CACHE_DURATIONS.movers);
  const data = response.mover_list || response;

  if (!Array.isArray(data)) {
    console.error("[Datasaham] top-volume returned non-array:", data);
    throw new DatasahamError("Invalid response structure", undefined, endpoint);
  }

  return data.map(transformDatasahamMover);
}

export async function getTopValue(): Promise<MoverStock[]> {
  const endpoint = "/api/movers/top-value";
  const response = await getCachedOrFetch<any>(endpoint, CACHE_DURATIONS.movers);
  const data = response.mover_list || response;

  if (!Array.isArray(data)) {
    console.error("[Datasaham] top-value returned non-array:", data);
    throw new DatasahamError("Invalid response structure", undefined, endpoint);
  }

  return data.map(transformDatasahamMover);
}

function transformStockInfo(data: any): StockInfo {
  // Parse price - API returns string "432" as "price" field
  const price = parseFloat(data.price || data.last || "0");

  // Parse previous close
  const previousClose = parseFloat(data.previous || "0");

  // Parse change - API returns string "+20.00" or "-5.00"
  const changeStr = String(data.change || "0").replace("+", "");
  const change = parseFloat(changeStr);

  // Parse percentage - API returns number 4.85 as "percentage" field
  const changePercent =
    typeof data.percentage === "number"
      ? data.percentage
      : parseFloat(data.percent || data.percentage || "0");

  // Parse volume - API returns string "6230870300" or "NA"
  const volumeStr = data.volume;
  const volume =
    volumeStr === "NA" || !volumeStr
      ? 0
      : parseInt(String(volumeStr).replace(/,/g, ""), 10);

  // Parse value - API returns string or "NA"
  const valueStr = data.value;
  const value =
    valueStr === "NA" || !valueStr
      ? 0
      : parseInt(String(valueStr).replace(/,/g, ""), 10);

  // Parse frequency
  const freqStr = data.frequency;
  const frequency =
    freqStr === "NA" || !freqStr
      ? 0
      : parseInt(String(freqStr).replace(/,/g, ""), 10);

  return {
    symbol: data.symbol || data.code || "",
    name: data.name || "",
    price,
    change,
    changePercent,
    previousClose,
    open: 0, // Not available in info endpoint
    high: 0, // Not available in info endpoint
    low: 0, // Not available in info endpoint
    volume,
    value,
    frequency,
    marketCap: data.market_cap?.raw || data.marketCap,
    sector: data.sector,
    subsector: data.sub_sector || data.subsector,
    listedShares: data.listed_shares || data.listedShares,
  };
}

export async function getStockInfo(symbol: string): Promise<StockInfo> {
  const endpoint = `/api/emiten/${symbol.toUpperCase()}/info`;
  const data = await getCachedOrFetch<any>(endpoint, CACHE_DURATIONS.stockDetail);
  return transformStockInfo(data);
}

export async function getStockProfile(symbol: string): Promise<StockProfile> {
  const endpoint = `/api/emiten/${symbol.toUpperCase()}/profile`;
  const data = await getCachedOrFetch<any>(endpoint, CACHE_DURATIONS.stockList);

  // Extract contact info from address array
  const addressInfo = data.address?.[0] || {};

  // Parse email - can be string or array
  let email: string | undefined;
  if (Array.isArray(addressInfo.email) && addressInfo.email.length > 0) {
    email = addressInfo.email[0];
  } else if (typeof addressInfo.email === "string") {
    email = addressInfo.email;
  }

  // Get shareholders from shareholder array
  const shareholders = (data.shareholder || []).map((s: any) => ({
    name: s.name || "",
    shares: 0, // Not directly available, stored as formatted "value"
    percentage: parseFloat(String(s.percentage || "0").replace("%", "").replace("<", "")),
  }));

  // Get management from key_executive
  const keyExec = data.key_executive || {};
  const management: { name: string; position: string }[] = [];

  // Add president director
  for (const exec of keyExec.president_director || []) {
    if (exec.value) management.push({ name: exec.value, position: "President Director" });
  }
  // Add vice president director
  for (const exec of keyExec.vice_president || []) {
    if (exec.value) management.push({ name: exec.value, position: "Vice President Director" });
  }
  // Add directors
  for (const exec of keyExec.director || []) {
    if (exec.value) management.push({ name: exec.value, position: "Director" });
  }

  return {
    symbol: data.symbol || symbol.toUpperCase(),
    name: data.name || "",
    description: data.background || data.about || data.description,
    sector: data.sector,
    subsector: data.subsector,
    industry: data.industry,
    website: addressInfo.website?.trim(),
    address: addressInfo.office,
    phone: addressInfo.phone,
    email,
    employees: data.employees || data.total_employees,
    listingDate: data.history?.date,
    listedShares: data.listed_shares || data.shares_listed,
    management: management.length > 0 ? management : undefined,
    shareholders: shareholders.length > 0 ? shareholders : undefined,
  };
}

export async function getStockKeyStats(symbol: string): Promise<StockKeyStats> {
  const endpoint = `/api/emiten/${symbol.toUpperCase()}/keystats`;
  const data = await getCachedOrFetch<any>(endpoint, CACHE_DURATIONS.stockList);

  // Helper to find a value from closure_fin_items_results
  const findFinItem = (name: string): string | undefined => {
    const groups = data.closure_fin_items_results || [];
    for (const group of groups) {
      const items = group.fin_name_results || [];
      for (const item of items) {
        if (item.fitem?.name === name) {
          return item.fitem.value;
        }
      }
    }
    return undefined;
  };

  // Helper to parse numeric value from string like "5.66" or "-1.62%" or "147,791 B"
  const parseNum = (val: string | undefined): number | undefined => {
    if (!val || val === "-") return undefined;
    const cleaned = val.replace(/[%,B]/g, "").trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? undefined : num;
  };

  // Parse market cap from stats (e.g., "147,791 B" -> 147791000000000)
  const parseMarketCap = (val: string | undefined): number | undefined => {
    if (!val) return undefined;
    const cleaned = val.replace(/,/g, "").replace(/\s*B\s*$/i, "").trim();
    const num = parseFloat(cleaned);
    if (isNaN(num)) return undefined;
    return num * 1_000_000_000; // B = Billion IDR
  };

  const stats = data.stats || {};

  return {
    symbol: symbol.toUpperCase(),
    pe: parseNum(findFinItem("Current PE Ratio (TTM)")),
    eps: parseNum(findFinItem("Current EPS (TTM)")),
    pbv: parseNum(findFinItem("Current Price to Book Value")),
    roe: parseNum(findFinItem("Return on Equity (TTM)")),
    roa: parseNum(findFinItem("Return on Assets (TTM)")),
    der: parseNum(findFinItem("Debt to Equity Ratio (Quarter)")),
    npm: parseNum(findFinItem("Net Profit Margin (Quarter)")),
    opm: parseNum(findFinItem("Operating Profit Margin (Quarter)")),
    gpm: parseNum(findFinItem("Gross Profit Margin (Quarter)")),
    currentRatio: parseNum(findFinItem("Current Ratio (Quarter)")),
    quickRatio: parseNum(findFinItem("Quick Ratio (Quarter)")),
    dividendYield: parseNum(findFinItem("Dividend Yield")),
    dividendPerShare: parseNum(findFinItem("Dividend")),
    bookValue: parseNum(findFinItem("Current Book Value Per Share")),
    marketCap: parseMarketCap(stats.market_cap),
    enterpriseValue: parseMarketCap(stats.enterprise_value),
    revenueGrowth: parseNum(findFinItem("Revenue (Quarter YoY Growth)")),
    netIncomeGrowth: parseNum(findFinItem("Net Income (Quarter YoY Growth)")),
    averageVolume: undefined, // Not available in this endpoint
    beta: undefined, // Not available in this endpoint
    week52High: parseNum(findFinItem("52 Week High")),
    week52Low: parseNum(findFinItem("52 Week Low")),
  };
}

export async function getStockInsiders(symbol: string): Promise<InsiderTransaction[]> {
  const endpoint = `/api/emiten/${symbol.toUpperCase()}/insider`;
  const response = await getCachedOrFetch<any>(endpoint, CACHE_DURATIONS.stockDetail);

  // API returns { movement: [...], is_more: boolean }
  const data = response.movement || response;

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item: any) => {
    // Parse shares from changes.value (string like "-361,335,400")
    const sharesStr = item.changes?.formatted_value || item.changes?.value || "0";
    const shares = parseInt(String(sharesStr).replace(/,/g, "").replace("-", ""), 10);

    // Parse price from price_formatted
    const price = parseFloat(item.price_formatted || item.price || "0");

    // Determine transaction type from action_type
    const actionType = item.action_type || "";
    const transactionType = actionType.includes("SELL") ? "sell" : "buy";

    return {
      date: item.date || item.transaction_date,
      insiderName: item.name || item.insider_name,
      position: item.position || item.title,
      transactionType,
      shares,
      price,
      value: shares * price,
      sharesOwned: parseInt(
        String(item.current?.value || "0").replace(/,/g, ""),
        10
      ),
    };
  });
}

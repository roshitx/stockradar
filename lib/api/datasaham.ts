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
  const cacheDuration = timeframe === "daily"
    ? CACHE_DURATIONS.chartDaily
    : CACHE_DURATIONS.chartIntraday;

  const data = await getCachedOrFetch<OHLCVCandle[]>(endpoint, cacheDuration);

  return {
    symbol: symbol.toUpperCase(),
    timeframe,
    data,
  };
}

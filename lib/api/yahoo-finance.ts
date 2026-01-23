// lib/api/yahoo-finance.ts
import YahooFinance from "yahoo-finance2";
import type { ChartResultArray } from "yahoo-finance2/modules/chart";
import type { OHLCVCandle, ChartTimeframe } from "./types";

// Create instance (required in v3)
const yahooFinance = new YahooFinance();

/**
 * Convert IDX symbol to Yahoo Finance format
 * BBCA → BBCA.JK
 */
function toYahooSymbol(symbol: string): string {
  const upper = symbol.toUpperCase();
  return upper.endsWith(".JK") ? upper : `${upper}.JK`;
}

/**
 * Map our timeframe to Yahoo Finance interval
 */
function mapTimeframeToInterval(
  timeframe: ChartTimeframe
): "1d" | "1h" | "30m" | "15m" {
  switch (timeframe) {
    case "15m":
      return "15m";
    case "30m":
      return "30m";
    case "1h":
    case "2h":
    case "3h":
    case "4h":
      return "1h";
    case "daily":
    default:
      return "1d";
  }
}

export async function getYahooChartData(
  symbol: string,
  timeframe: ChartTimeframe,
  from: string,
  to: string
): Promise<OHLCVCandle[]> {
  try {
    const yahooSymbol = toYahooSymbol(symbol);
    const interval = mapTimeframeToInterval(timeframe);

    const result: ChartResultArray = await yahooFinance.chart(yahooSymbol, {
      period1: from,
      period2: to,
      interval,
    });

    if (!result.quotes || result.quotes.length === 0) {
      return [];
    }

    return result.quotes
      .filter((q) => q.open !== null && q.close !== null)
      .map((q) => ({
        timestamp: new Date(q.date).getTime(),
        open: q.open ?? 0,
        high: q.high ?? 0,
        low: q.low ?? 0,
        close: q.close ?? 0,
        volume: q.volume ?? 0,
      }));
  } catch (error) {
    console.error(`[Yahoo Finance] Failed to fetch ${symbol}:`, error);
    return [];
  }
}

/**
 * IHSG intraday chart point for area chart
 */
export interface IHSGChartPoint {
  time: number; // Unix timestamp in seconds (for Lightweight Charts)
  value: number; // Close price
}

/**
 * Fetch IHSG (IDX Composite) intraday data for area chart
 * Uses ^JKSE symbol from Yahoo Finance with 15m interval
 * @returns Array of {time, value} for today's trading session
 */
export async function getIHSGIntradayData(): Promise<IHSGChartPoint[]> {
  try {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    const result = await yahooFinance.chart("^JKSE", {
      period1: todayMidnight,
      period2: new Date(),
      interval: "15m",
    });

    if (!result.quotes || result.quotes.length === 0) {
      return [];
    }

    return result.quotes
      .filter((q) => q.close !== null && q.close !== undefined)
      .map((q) => ({
        time: Math.floor(new Date(q.date).getTime() / 1000),
        value: q.close as number,
      }));
  } catch (error) {
    console.error("[Yahoo Finance] Failed to fetch IHSG intraday:", error);
    return [];
  }
}

// lib/api/index.ts

import {
  getTrending,
  getTopGainers,
  getTopLosers,
  getIndicesImpact,
  getIHSG,
  getChartData,
  searchStocks,
  getTopVolume,
  getTopValue,
  getStockInfo,
  getStockProfile,
  getStockKeyStats,
  getStockInsiders,
  getStockFinancials,
  getStockForeignOwnership,
  getTechnicalAnalysis,
  getSentimentAnalysis,
  getRiskRewardAnalysis,
  DatasahamError,
} from "./datasaham";
import {
  mockTrendingStocks,
  mockTopGainers,
  mockTopLosers,
  mockIndicesImpact,
  mockIHSGData,
} from "./mock-data";
import type {
  TrendingStock,
  MoverStock,
  IndicesImpactData,
  IHSGData,
  SearchResult,
  StockInfo,
  StockProfile,
  StockKeyStats,
  InsiderTransaction,
  StockFinancials,
  FinancialReportType,
  FinancialPeriodType,
  ForeignOwnershipData,
  AIInsightData,
} from "./types";
import {
  getIHSGIntradayData,
  type IHSGChartPoint,
} from "./yahoo-finance";

export * from "./types";
export { DatasahamError };

export async function getTrendingStocks(): Promise<TrendingStock[]> {
  try {
    const data = await getTrending();

    // Validate data is an array
    if (!Array.isArray(data) || data.length === 0) {
      console.error("[Datasaham] getTrending returned invalid data:", data);
      return mockTrendingStocks;
    }

    return data;
  } catch (error) {
    console.error("[Datasaham] getTrending failed:", error);
    return mockTrendingStocks;
  }
}

export async function getTopGainerStocks(): Promise<MoverStock[]> {
  try {
    const data = await getTopGainers();

    // Validate data is an array
    if (!Array.isArray(data) || data.length === 0) {
      console.error("[Datasaham] getTopGainers returned invalid data:", data);
      return mockTopGainers;
    }

    return data;
  } catch (error) {
    console.error("[Datasaham] getTopGainers failed:", error);
    return mockTopGainers;
  }
}

export async function getTopLoserStocks(): Promise<MoverStock[]> {
  try {
    const data = await getTopLosers();

    // Validate data is an array
    if (!Array.isArray(data) || data.length === 0) {
      console.error("[Datasaham] getTopLosers returned invalid data:", data);
      return mockTopLosers;
    }

    return data;
  } catch (error) {
    console.error("[Datasaham] getTopLosers failed:", error);
    return mockTopLosers;
  }
}

export async function getIndicesImpactData(): Promise<IndicesImpactData> {
  try {
    const data = await getIndicesImpact();

    // Validate data structure
    if (!data || !Array.isArray(data.indices) || data.indices.length === 0) {
      console.error("[Datasaham] getIndicesImpact returned invalid data structure:", data);
      return mockIndicesImpact;
    }

    return data;
  } catch (error) {
    console.error("[Datasaham] getIndicesImpact failed:", error);
    return mockIndicesImpact;
  }
}

export async function getIHSGData(): Promise<IHSGData> {
  try {
    const data = await getIHSG();

    // Validate data structure
    if (!data || typeof data.price !== 'number') {
      console.error("[Datasaham] getIHSG returned invalid data:", data);
      return mockIHSGData;
    }

    return data;
  } catch (error) {
    console.error("[Datasaham] getIHSG failed:", error);
    return mockIHSGData;
  }
}

export { getChartData };

export type { IHSGChartPoint };

/**
 * Fetch IHSG intraday chart data for area chart
 * @returns Array of {time, value} for Lightweight Charts, empty array on failure
 */
export async function getIHSGIntradayChartData(): Promise<IHSGChartPoint[]> {
  try {
    const data = await getIHSGIntradayData();

    // Validate data is an array with points
    if (!Array.isArray(data) || data.length === 0) {
      console.error("[Yahoo Finance] getIHSGIntradayData returned empty data");
      return [];
    }

    return data;
  } catch (error) {
    console.error("[Yahoo Finance] getIHSGIntradayData failed:", error);
    return [];
  }
}

export async function searchStocksData(keyword: string): Promise<SearchResult[]> {
  try {
    const data = await searchStocks(keyword);
    return data;
  } catch (error) {
    console.error("[Datasaham] searchStocks failed:", error);
    return [];
  }
}

export async function getTopVolumeStocks(): Promise<MoverStock[]> {
  try {
    const data = await getTopVolume();

    if (!Array.isArray(data) || data.length === 0) {
      console.error("[Datasaham] getTopVolume returned invalid data:", data);
      return mockTopGainers;
    }

    return data;
  } catch (error) {
    console.error("[Datasaham] getTopVolume failed:", error);
    return mockTopGainers;
  }
}

export async function getTopValueStocks(): Promise<MoverStock[]> {
  try {
    const data = await getTopValue();

    if (!Array.isArray(data) || data.length === 0) {
      console.error("[Datasaham] getTopValue returned invalid data:", data);
      return mockTopGainers;
    }

    return data;
  } catch (error) {
    console.error("[Datasaham] getTopValue failed:", error);
    return mockTopGainers;
  }
}

export async function getStockInfoData(symbol: string): Promise<StockInfo | null> {
  try {
    return await getStockInfo(symbol);
  } catch (error) {
    console.error(`[Datasaham] getStockInfo(${symbol}) failed:`, error);
    return null;
  }
}

export async function getStockProfileData(symbol: string): Promise<StockProfile | null> {
  try {
    return await getStockProfile(symbol);
  } catch (error) {
    console.error(`[Datasaham] getStockProfile(${symbol}) failed:`, error);
    return null;
  }
}

export async function getStockKeyStatsData(symbol: string): Promise<StockKeyStats | null> {
  try {
    return await getStockKeyStats(symbol);
  } catch (error) {
    console.error(`[Datasaham] getStockKeyStats(${symbol}) failed:`, error);
    return null;
  }
}

export async function getStockInsidersData(symbol: string): Promise<InsiderTransaction[]> {
  try {
    return await getStockInsiders(symbol);
  } catch (error) {
    console.error(`[Datasaham] getStockInsiders(${symbol}) failed:`, error);
    return [];
  }
}

export async function getStockFinancialsData(
  symbol: string,
  reportType: FinancialReportType = "income",
  periodType: FinancialPeriodType = "annual"
): Promise<StockFinancials | null> {
  try {
    return await getStockFinancials(symbol, reportType, periodType);
  } catch (error) {
    console.error(`[Datasaham] getStockFinancials(${symbol}) failed:`, error);
    return null;
  }
}

export async function getStockForeignOwnershipData(symbol: string): Promise<ForeignOwnershipData | null> {
  try {
    return await getStockForeignOwnership(symbol);
  } catch (error) {
    console.error(`[Datasaham] getStockForeignOwnership(${symbol}) failed:`, error);
    return null;
  }
}

export async function getAIInsightData(symbol: string): Promise<AIInsightData> {
  const [technical, sentiment, riskReward] = await Promise.allSettled([
    getTechnicalAnalysis(symbol),
    getSentimentAnalysis(symbol),
    getRiskRewardAnalysis(symbol),
  ]);

  const failures = [technical, sentiment, riskReward].filter(
    (r) => r.status === "rejected"
  );

  if (failures.length > 0) {
    console.error("[AI Insight] partial failures:", {
      symbol,
      count: failures.length,
    });
  }

  return {
    technical:
      technical.status === "fulfilled" ? technical.value : null,
    sentiment:
      sentiment.status === "fulfilled" ? sentiment.value : null,
    riskReward:
      riskReward.status === "fulfilled" ? riskReward.value : null,
    timestamp: Date.now(),
  };
}

export type SparklinePoint = { time: string; value: number };

export async function getStockSparklineData(symbol: string): Promise<SparklinePoint[]> {
  try {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 5);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const data = await getChartData(
      symbol,
      'daily',
      formatDate(from),
      formatDate(to)
    );

    if (!data || !Array.isArray(data.data) || data.data.length === 0) {
      return [];
    }

    return data.data.map(candle => ({
      time: formatDate(new Date(candle.timestamp)),
      value: candle.close
    }));
  } catch (error) {
    console.error(`[Datasaham] getStockSparklineData(${symbol}) failed:`, error);
    return [];
  }
}

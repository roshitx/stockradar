// lib/api/index.ts

import {
  getTrending,
  getTopGainers,
  getTopLosers,
  getIndicesImpact,
  getIHSG,
  getChartData,
  DatasahamError,
} from "./datasaham";
import {
  mockTrendingStocks,
  mockTopGainers,
  mockTopLosers,
  mockIndicesImpact,
  mockIHSGData,
} from "./mock-data";
import type { TrendingStock, MoverStock, IndicesImpactData, IHSGData } from "./types";

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

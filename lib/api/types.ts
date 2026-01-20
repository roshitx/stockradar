// lib/api/types.ts

export interface TrendingStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  value: number;
  frequency: number;
}

export interface MoverStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  value: number;
  previousClose?: number;
}

export interface GlobalIndex {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  region: string;
  correlationLag?: string;
  ihsgCorrelation?: number;
  correlationDescription?: string;
}

export interface IndicesImpactData {
  indices: GlobalIndex[];
  summary: string;
  timestamp: string;
  ihsgPrediction?: {
    sentiment: string;
    confidence: number;
    predictedImpact: number;
  };
  usMarketSummary?: {
    sentiment: string;
    averageChange: number;
  };
  asiaMarketSummary?: {
    sentiment: string;
    averageChange: number;
  };
}

export interface IHSGData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose?: number;
  volume?: number;
}

export interface OHLCVCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type ChartTimeframe = "daily" | "15m" | "30m" | "1h" | "2h" | "3h" | "4h";

export type ChartTimeframeDisplay = "1D" | "1W" | "1M" | "3M" | "1Y";

export interface ChartData {
  symbol: string;
  timeframe: ChartTimeframe;
  data: OHLCVCandle[];
}

export interface SearchResult {
  symbol: string;
  name: string;
  type?: string;
  sector?: string;
}

export interface StockInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  value: number;
  frequency: number;
  marketCap?: number;
  sector?: string;
  subsector?: string;
  listedShares?: number;
}

export interface StockProfile {
  symbol: string;
  name: string;
  description?: string;
  sector?: string;
  subsector?: string;
  industry?: string;
  website?: string;
  address?: string;
  phone?: string;
  email?: string;
  employees?: number;
  listingDate?: string;
  listedShares?: number;
  management?: {
    name: string;
    position: string;
  }[];
  shareholders?: {
    name: string;
    shares: number;
    percentage: number;
  }[];
}

export interface StockKeyStats {
  symbol: string;
  pe?: number;
  eps?: number;
  pbv?: number;
  roe?: number;
  roa?: number;
  der?: number;
  npm?: number;
  opm?: number;
  gpm?: number;
  currentRatio?: number;
  quickRatio?: number;
  dividendYield?: number;
  dividendPerShare?: number;
  bookValue?: number;
  marketCap?: number;
  enterpriseValue?: number;
  revenueGrowth?: number;
  netIncomeGrowth?: number;
  averageVolume?: number;
  beta?: number;
  week52High?: number;
  week52Low?: number;
}

export interface InsiderTransaction {
  date: string;
  insiderName: string;
  position?: string;
  transactionType: "buy" | "sell";
  shares: number;
  price: number;
  value: number;
  sharesOwned?: number;
}

// Datasaham API Response Types (actual structure from API)
export interface DatasahamStock {
  change: string;
  symbol: string;
  percent: string;
  name: string;
  last: string;
  symbol_2: string;
  symbol_3: string;
  company_id: string;
  notation: Array<{
    notation_code: string;
    notation_desc: string;
  }>;
  uma: boolean;
  tradeable: number;
  country: string;
  type: string;
  corp_action: {
    active: boolean;
    text: string;
    detail: any;
  };
  isexist: number;
  status: string;
  is_following: boolean;
  formatted_price: string;
  is_exists: boolean;
  previous: string;
}

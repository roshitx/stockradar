// lib/api/mock-data.ts

import type { TrendingStock, MoverStock, IndicesImpactData, IHSGData } from "./types";

export const mockTrendingStocks: TrendingStock[] = [
  { symbol: "BBCA", name: "Bank Central Asia", price: 9250, change: 225, changePercent: 2.5, volume: 15234567, value: 140924548250, frequency: 12456 },
  { symbol: "BMRI", name: "Bank Mandiri", price: 6450, change: 120, changePercent: 1.89, volume: 23456789, value: 151296288050, frequency: 18234 },
  { symbol: "TLKM", name: "Telkom Indonesia", price: 3820, change: -20, changePercent: -0.52, volume: 45678901, value: 174493560820, frequency: 25678 },
  { symbol: "ASII", name: "Astra International", price: 5775, change: 50, changePercent: 0.87, volume: 12345678, value: 71296140150, frequency: 9876 },
  { symbol: "BBRI", name: "Bank Rakyat Indonesia", price: 4650, change: 140, changePercent: 3.12, volume: 34567890, value: 160740689500, frequency: 21345 },
  { symbol: "UNVR", name: "Unilever Indonesia", price: 3580, change: -45, changePercent: -1.24, volume: 8901234, value: 31866417720, frequency: 7654 },
  { symbol: "ICBP", name: "Indofood CBP", price: 8925, change: 125, changePercent: 1.42, volume: 5678901, value: 50683896525, frequency: 5432 },
  { symbol: "KLBF", name: "Kalbe Farma", price: 1520, change: 32, changePercent: 2.15, volume: 67890123, value: 103193386960, frequency: 43210 },
];

export const mockTopGainers: MoverStock[] = [
  { symbol: "ARTO", name: "Bank Jago", price: 2680, change: 530, changePercent: 24.76, volume: 123456789, value: 330864033320 },
  { symbol: "BUKA", name: "Bukalapak", price: 128, change: 20, changePercent: 18.52, volume: 456789012, value: 58469153536 },
  { symbol: "GOTO", name: "GoTo Gojek Tokopedia", price: 75, change: 10, changePercent: 15.38, volume: 789012345, value: 59175925875 },
];

export const mockTopLosers: MoverStock[] = [
  { symbol: "SMDR", name: "Samudera Indonesia", price: 356, change: -32, changePercent: -8.24, volume: 12345678, value: 4395061368 },
  { symbol: "MDKA", name: "Merdeka Copper Gold", price: 2420, change: -158, changePercent: -6.13, volume: 23456789, value: 56765428780 },
  { symbol: "ANTM", name: "Aneka Tambang", price: 1535, change: -79, changePercent: -4.89, volume: 34567890, value: 53061671150 },
];

export const mockIndicesImpact: IndicesImpactData = {
  indices: [
    { name: "Dow Jones", symbol: "^DJI", price: 42563.24, change: 312.45, changePercent: 0.74, region: "US", ihsgCorrelation: 0.68, correlationLag: "1 hari" },
    { name: "S&P 500", symbol: "^GSPC", price: 5892.15, change: 45.67, changePercent: 0.78, region: "US", ihsgCorrelation: 0.72, correlationLag: "1 hari" },
    { name: "NASDAQ", symbol: "^IXIC", price: 18934.56, change: -123.45, changePercent: -0.65, region: "US", ihsgCorrelation: 0.65, correlationLag: "1 hari" },
  ],
  summary: "Wall Street melemah rata-rata 0.10%. Pasar Asia melemah rata-rata 0.32%. Prediksi IHSG: NEUTRAL.",
  timestamp: new Date().toISOString(),
  ihsgPrediction: {
    sentiment: "neutral",
    confidence: 0.72,
    predictedImpact: -0.22,
  },
};

export const mockIHSGData: IHSGData = {
  symbol: "^JKSE",
  name: "IDX Composite",
  price: 7234.56,
  change: 32.45,
  changePercent: 0.45,
  previousClose: 7202.11,
};

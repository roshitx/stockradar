import { z } from "zod";

// Technical Analysis API Response Schema
// Endpoint: /api/analysis/technical/{symbol}
export const TechnicalAnalysisSchema = z.object({
  symbol: z.string(),
  timeframe: z.string(),
  lastPrice: z.number(),
  lastUpdate: z.string(),
  dataPoints: z.number().optional(),
  indicators: z.object({
    sma: z.object({
      sma5: z.number().nullable(),
      sma10: z.number().nullable(),
      sma20: z.number().nullable(),
      sma50: z.number().nullable(),
      sma200: z.number().nullable(),
    }).optional(),
    ema: z.object({
      ema5: z.number().nullable(),
      ema10: z.number().nullable(),
      ema20: z.number().nullable(),
      ema50: z.number().nullable(),
      ema200: z.number().nullable(),
    }).optional(),
    rsi: z.object({
      value: z.number(),
      signal: z.string(),
      period: z.number().optional(),
    }).optional(),
    macd: z.object({
      macdLine: z.number(),
      signalLine: z.number(),
      histogram: z.number(),
      signal: z.string(),
    }).optional(),
    stochastic: z.object({
      k: z.number(),
      d: z.number(),
      signal: z.string(),
    }).optional(),
    bollingerBands: z.object({
      upper: z.number(),
      middle: z.number(),
      lower: z.number(),
      bandwidth: z.number().optional(),
      percentB: z.number().optional(),
      signal: z.string().optional(),
    }).optional(),
    atr: z.object({
      value: z.number(),
      percentage: z.number().optional(),
      volatility: z.string().optional(),
    }).optional(),
    obv: z.object({
      value: z.number(),
      trend: z.string(),
    }).optional(),
    vwap: z.object({
      value: z.number(),
      signal: z.string(),
    }).optional(),
  }),
  trend: z.object({
    shortTerm: z.string(),
    mediumTerm: z.string(),
    longTerm: z.string(),
    overallTrend: z.string(),
    trendStrength: z.number(),
  }),
  supportResistance: z.object({
    supports: z.array(z.object({
      level: z.number(),
      strength: z.string(),
    })),
    resistances: z.array(z.object({
      level: z.number(),
      strength: z.string(),
    })),
  }),
});

// Sentiment Analysis API Response Schema
// Endpoint: /api/analysis/sentiment/{symbol}
export const SentimentAnalysisSchema = z.object({
  symbol: z.string(),
  analysis_date: z.string(),
  current_price: z.number(),
  retail_sentiment: z.object({
    score: z.number(),
    status: z.string(),
    indicators: z.object({
      frequency_score: z.number().optional(),
      small_lot_percentage: z.number().optional(),
      fomo_score: z.number().optional(),
      volume_participation: z.number().optional(),
    }).optional(),
    danger_level: z.string().optional(),
  }),
  bandar_sentiment: z.object({
    score: z.number(),
    status: z.string(),
    indicators: z.object({
      top_broker_net_flow: z.number().optional(),
      large_lot_percentage: z.number().optional(),
      accumulation_score: z.number().optional(),
      foreign_flow: z.number().optional(),
      institutional_flow: z.number().optional(),
    }).optional(),
    top_brokers: z.object({
      buyers: z.array(z.object({
        code: z.string(),
        type: z.string(),
        net_value: z.number(),
        net_value_formatted: z.string().optional(),
        net_lot: z.number().optional(),
        avg_price: z.number().optional(),
      })).optional(),
      sellers: z.array(z.object({
        code: z.string(),
        type: z.string(),
        net_value: z.number(),
        net_value_formatted: z.string().optional(),
        net_lot: z.number().optional(),
        avg_price: z.number().optional(),
      })).optional(),
    }).optional(),
  }),
});

// Risk-Reward Analysis API Response Schema
// Endpoint: /api/analysis/retail/risk-reward/{symbol}
export const RiskRewardAnalysisSchema = z.object({
  symbol: z.string(),
  name: z.string().optional(),
  current_price: z.number(),
  analysis_date: z.string(),
  support_levels: z.array(z.number()),
  resistance_levels: z.array(z.number()),
  stop_loss_recommended: z.number(),
  target_prices: z.array(z.object({
    level: z.number(),
    probability: z.number(),
    reward: z.number(),
    risk_reward: z.number(),
  })),
  risk_amount: z.number(),
  reward_amount: z.number(),
  risk_reward_ratio: z.number(),
  recommendation: z.enum([
    "EXCELLENT_SETUP",
    "GOOD_SETUP",
    "FAIR_SETUP",
    "POOR_SETUP",
  ]),
  position_sizing: z.object({
    max_position_percent: z.number().optional(),
    suggested_shares: z.number().optional(),
    total_investment: z.string().optional(),
    max_loss: z.string().optional(),
  }).optional(),
  technical_levels: z.object({
    pivot_point: z.number(),
    r1: z.number().optional(),
    r2: z.number().optional(),
    r3: z.number().optional(),
    s1: z.number().optional(),
    s2: z.number().optional(),
    s3: z.number().optional(),
    atr: z.number(),
    atr_percent: z.number().optional(),
  }).optional(),
});

export type TechnicalAnalysisValidated = z.infer<typeof TechnicalAnalysisSchema>;
export type SentimentAnalysisValidated = z.infer<typeof SentimentAnalysisSchema>;
export type RiskRewardAnalysisValidated = z.infer<typeof RiskRewardAnalysisSchema>;

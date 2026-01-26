"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AICard, AICardContent, AICardFooter } from "@/components/ui/ai-card";
import { SignalBadge } from "./signal-badge";
import type { AIInsightData } from "@/lib/api/types";

interface AIInsightCardProps {
  data: AIInsightData;
}

const STORAGE_KEY = "stockradar-ai-analysis-expanded";

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
}

function getSentimentColor(
  status: string
): "text-positive" | "text-negative" | "text-muted-foreground" {
  const upperStatus = status.toUpperCase();
  if (upperStatus.includes("BULLISH") || upperStatus === "ACCUMULATING") {
    return "text-positive";
  }
  if (
    upperStatus.includes("BEARISH") ||
    upperStatus === "DISTRIBUTING" ||
    upperStatus === "EXITING" ||
    upperStatus === "PANIC" ||
    upperStatus === "FEARFUL"
  ) {
    return "text-negative";
  }
  return "text-muted-foreground";
}

function getSetupColor(
  recommendation: string
): "text-positive" | "text-negative" | "text-muted-foreground" {
  switch (recommendation) {
    case "EXCELLENT_SETUP":
    case "GOOD_SETUP":
      return "text-positive";
    case "POOR_SETUP":
      return "text-negative";
    default:
      return "text-muted-foreground";
  }
}

function getTrendIcon(trend: string): string {
  const upper = trend.toUpperCase();
  if (upper.includes("BULLISH")) return "↑";
  if (upper.includes("BEARISH")) return "↓";
  return "→";
}

function getTrendColor(trend: string): string {
  const upper = trend.toUpperCase();
  if (upper.includes("BULLISH")) return "text-positive";
  if (upper.includes("BEARISH")) return "text-negative";
  return "text-muted-foreground";
}

export function AIInsightCard({ data }: AIInsightCardProps) {
  const { technical, sentiment, riskReward, timestamp } = data;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setIsExpanded(JSON.parse(saved));
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isExpanded));
    }
  }, [isExpanded, isHydrated]);

  const hasAnyData = technical || sentiment || riskReward;
  if (!hasAnyData) {
    return null;
  }

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleExpanded();
    }
  };

  return (
    <AICard showIcon>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls="ai-analysis-content"
        onClick={toggleExpanded}
        onKeyDown={handleKeyDown}
        className="p-4 sm:p-6 cursor-pointer hover:bg-ai/5 transition-colors rounded-t-xl"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ai to-ai-secondary shadow-lg shadow-ai/25 shrink-0">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">AI Analysis</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Updated {formatTimestamp(timestamp)} WIB
              </p>
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform duration-200 ml-auto sm:hidden",
                isExpanded && "rotate-180"
              )}
              aria-hidden="true"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {technical && (
              <SignalBadge
                signal={technical.trend.overallTrend}
                confidence={technical.trend.trendStrength}
              />
            )}
            <ChevronDown
              className={cn(
                "hidden sm:block h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0",
                isExpanded && "rotate-180"
              )}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div
        id="ai-analysis-content"
        className={cn(
          "overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <AICardContent>
          <div className="space-y-3 sm:space-y-4">
            {sentiment && (
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2 p-2.5 sm:p-3 rounded-lg bg-background/50">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Sentiment Divergence
                </span>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
                  <span className={getSentimentColor(sentiment.retail_sentiment.status)}>
                    Retail: {sentiment.retail_sentiment.status}
                  </span>
                  <span className="text-muted-foreground/50">|</span>
                  <span className={getSentimentColor(sentiment.bandar_sentiment.status)}>
                    Bandar: {sentiment.bandar_sentiment.status}
                  </span>
                </div>
              </div>
            )}

            {riskReward && (
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2 p-2.5 sm:p-3 rounded-lg bg-background/50">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Setup Quality</span>
                <span
                  className={`text-xs sm:text-sm font-bold ${getSetupColor(riskReward.recommendation)}`}
                >
                  {riskReward.recommendation.replace(/_/g, " ")}
                </span>
              </div>
            )}

            {technical && (
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2 p-2.5 sm:p-3 rounded-lg bg-background/50">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Trend Analysis</span>
                <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm font-mono font-tabular">
                  <span className={getTrendColor(technical.trend.shortTerm)}>
                    {getTrendIcon(technical.trend.shortTerm)} Short
                  </span>
                  <span className={getTrendColor(technical.trend.mediumTerm)}>
                    {getTrendIcon(technical.trend.mediumTerm)} Medium
                  </span>
                  <span className={getTrendColor(technical.trend.longTerm)}>
                    {getTrendIcon(technical.trend.longTerm)} Long
                  </span>
                </div>
              </div>
            )}

            {riskReward && riskReward.target_prices.length > 0 && (
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-2 p-2.5 sm:p-3 rounded-lg bg-background/50">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Risk/Reward Ratio
                </span>
                <span className="text-xs sm:text-sm font-bold font-mono font-tabular text-ai">
                  1 : {riskReward.target_prices[0].risk_reward.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </AICardContent>

        <AICardFooter>
          <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> Analisis ini dihasilkan oleh sistem kecerdasan buatan (AI) 
            dan bukan merupakan nasihat investasi, rekomendasi, atau ajakan untuk membeli atau menjual 
            saham. Keputusan investasi sepenuhnya menjadi tanggung jawab Anda. Selalu lakukan riset 
            mandiri dan konsultasikan dengan penasihat keuangan profesional sebelum mengambil keputusan 
            investasi.
          </p>
        </AICardFooter>
      </div>
    </AICard>
  );
}

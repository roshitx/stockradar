"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type HistogramData,
  type Time,
  ColorType,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";
import type { OHLCVCandle, ChartTimeframeDisplay } from "@/lib/api/types";
import { TimeframeSelector } from "./timeframe-selector";

interface CandlestickChartProps {
  symbol: string;
  initialData?: OHLCVCandle[];
  onTimeframeChange?: (tf: ChartTimeframeDisplay) => void;
  activeTimeframe?: ChartTimeframeDisplay;
  className?: string;
}

function getTimeframeParams(tf: ChartTimeframeDisplay): { from: string; to: string; apiTimeframe: string } {
  const now = new Date();
  const to = now.toISOString().split("T")[0];
  let from: string;
  let apiTimeframe: string;

  switch (tf) {
    case "1D":
      from = to;
      apiTimeframe = "15m";
      break;
    case "1W":
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      from = weekAgo.toISOString().split("T")[0];
      apiTimeframe = "1h";
      break;
    case "1M":
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      from = monthAgo.toISOString().split("T")[0];
      apiTimeframe = "daily";
      break;
    case "3M":
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      from = threeMonthsAgo.toISOString().split("T")[0];
      apiTimeframe = "daily";
      break;
    case "1Y":
    default:
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      from = yearAgo.toISOString().split("T")[0];
      apiTimeframe = "daily";
      break;
  }

  return { from, to, apiTimeframe };
}

export function CandlestickChart({
  symbol,
  initialData = [],
  onTimeframeChange,
  activeTimeframe = "1M",
  className,
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OHLCVCandle[]>(initialData);

  const fetchData = async (tf: ChartTimeframeDisplay) => {
    setLoading(true);
    try {
      const { from, to, apiTimeframe } = getTimeframeParams(tf);
      const response = await fetch(
        `/api/chart/${symbol}?timeframe=${apiTimeframe}&from=${from}&to=${to}`
      );
      if (response.ok) {
        const result = await response.json();
        // Ensure we always set an array
        const chartData = Array.isArray(result.data) ? result.data : [];
        setData(chartData);
      }
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDark = document.documentElement.classList.contains("dark");

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: isDark ? "#a1a1aa" : "#71717a",
      },
      grid: {
        vertLines: { color: isDark ? "#27272a" : "#f4f4f5" },
        horzLines: { color: isDark ? "#27272a" : "#f4f4f5" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
      },
      crosshair: {
        horzLine: { labelVisible: true },
        vertLine: { labelVisible: true },
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#f43f5e",
      borderUpColor: "#10b981",
      borderDownColor: "#f43f5e",
      wickUpColor: "#10b981",
      wickDownColor: "#f43f5e",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current) return;

    // Defensive check: ensure data is an array
    if (!Array.isArray(data) || data.length === 0) return;

    const candleData: CandlestickData<Time>[] = data.map((d) => ({
      time: (d.timestamp / 1000) as Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    const volumeData: HistogramData<Time>[] = data.map((d) => ({
      time: (d.timestamp / 1000) as Time,
      value: d.volume,
      color: d.close >= d.open ? "rgba(16, 185, 129, 0.5)" : "rgba(244, 63, 94, 0.5)",
    }));

    candleSeriesRef.current.setData(candleData);
    volumeSeriesRef.current.setData(volumeData);
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  useEffect(() => {
    if (initialData.length === 0) {
      fetchData(activeTimeframe);
    }
  }, [activeTimeframe, symbol, initialData.length]);

  const handleTimeframeChange = (tf: ChartTimeframeDisplay) => {
    fetchData(tf);
    onTimeframeChange?.(tf);
  };

  const showNoData = !loading && data.length === 0;

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <TimeframeSelector
          activeTimeframe={activeTimeframe}
          onTimeframeChange={handleTimeframeChange}
        />
      </div>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
        {showNoData && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <p className="text-muted-foreground text-sm">
              No chart data available for this timeframe
            </p>
          </div>
        )}
        <div
          ref={chartContainerRef}
          className="rounded-lg border border-border/40 bg-background/30"
          style={{ minHeight: showNoData ? 400 : undefined }}
          aria-label={`${symbol} price chart`}
          role="img"
        />
      </div>
    </div>
  );
}

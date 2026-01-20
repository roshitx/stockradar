import { NextRequest, NextResponse } from "next/server";
import { getChartData } from "@/lib/api";
import type { ChartTimeframe } from "@/lib/api/types";

interface RouteParams {
  params: Promise<{ symbol: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { symbol } = await params;
  const { searchParams } = request.nextUrl;

  const timeframe = (searchParams.get("timeframe") || "daily") as ChartTimeframe;
  const from = searchParams.get("from") || getDefaultFrom();
  const to = searchParams.get("to") || getDefaultTo();

  try {
    const data = await getChartData(symbol, timeframe, from, to);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`[Chart API] Failed to fetch chart for ${symbol}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch chart data", data: [] },
      { status: 500 }
    );
  }
}

function getDefaultFrom(): string {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().split("T")[0];
}

function getDefaultTo(): string {
  return new Date().toISOString().split("T")[0];
}

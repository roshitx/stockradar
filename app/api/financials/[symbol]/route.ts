import { NextRequest, NextResponse } from "next/server";
import { getStockFinancialsData } from "@/lib/api";
import type { FinancialReportType, FinancialPeriodType } from "@/lib/api/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const { searchParams } = new URL(request.url);

  const reportType = (searchParams.get("reportType") || "income") as FinancialReportType;
  const periodType = (searchParams.get("periodType") || "annual") as FinancialPeriodType;

  const validReportTypes: FinancialReportType[] = ["income", "balance", "cashflow"];
  const validPeriodTypes: FinancialPeriodType[] = ["quarterly", "annual", "ttm"];

  if (!validReportTypes.includes(reportType) || !validPeriodTypes.includes(periodType)) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const data = await getStockFinancialsData(symbol.toUpperCase(), reportType, periodType);

  if (!data) {
    return NextResponse.json({ error: "Data not available" }, { status: 404 });
  }

  return NextResponse.json(data);
}

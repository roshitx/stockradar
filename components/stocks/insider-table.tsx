import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { InsiderTransaction } from "@/lib/api/types";

interface InsiderTableProps {
  transactions: InsiderTransaction[];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function InsiderTable({ transactions }: InsiderTableProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        No insider transactions available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Insider</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Shares</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx, index) => (
            <TableRow key={`${tx.date}-${tx.insiderName}-${index}`}>
              <TableCell className="whitespace-nowrap">
                {formatDate(tx.date)}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{tx.insiderName}</div>
                  {tx.position && (
                    <div className="text-xs text-muted-foreground">
                      {tx.position}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={tx.transactionType === "buy" ? "default" : "destructive"}
                  className="text-xs"
                >
                  {tx.transactionType.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono font-tabular">
                {formatCurrency(tx.shares)}
              </TableCell>
              <TableCell className="text-right font-mono font-tabular">
                Rp {formatCurrency(tx.price)}
              </TableCell>
              <TableCell className="text-right font-mono font-tabular">
                Rp {formatCurrency(tx.value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

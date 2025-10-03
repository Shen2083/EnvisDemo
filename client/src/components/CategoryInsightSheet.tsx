import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, TrendingDown } from "lucide-react";

interface CategoryInsight {
  headline: string;
  body: string;
  metrics?: {
    label: string;
    value: string;
  }[];
}

interface Transaction {
  id: string;
  merchantName: string;
  amount: number;
  date: string;
  accountLabel: string;
  category: string;
}

interface TransactionCategory {
  id: string;
  name: string;
  transactions: Transaction[];
  totals: {
    spendToDate: number;
    monthOverMonth: number;
    transactionCount: number;
  };
  insight?: CategoryInsight;
}

interface CategoryInsightSheetProps {
  category?: TransactionCategory;
  onClose: () => void;
}

export function CategoryInsightSheet({ category, onClose }: CategoryInsightSheetProps) {
  if (!category) return null;

  const formatAmount = (amount: number) => {
    return `£${Math.abs(amount).toFixed(2)}`;
  };

  const parseTransactionDate = (dateStr: string): Date => {
    const months: { [key: string]: number } = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    
    const parts = dateStr.split(' ');
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);
    
    return new Date(year, month, day);
  };

  const getMonthsFromTransactions = (transactions: Transaction[]): number => {
    if (transactions.length === 0) return 1;
    
    const dates = transactions.map(tx => parseTransactionDate(tx.date));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    const yearDiff = maxDate.getFullYear() - minDate.getFullYear();
    const monthDiff = maxDate.getMonth() - minDate.getMonth();
    const totalMonths = (yearDiff * 12) + monthDiff + 1;
    
    return Math.max(1, totalMonths);
  };

  const calculateSavingsPotential = (monthlySavings: number) => {
    const yearlyPrincipal = monthlySavings * 12;
    const indexFundReturn = 0.08;
    const savingsAccountRate = 0.045;

    const indexFundValue = yearlyPrincipal * (1 + indexFundReturn);
    const savingsAccountValue = yearlyPrincipal * (1 + savingsAccountRate);

    return {
      indexFund: formatAmount(indexFundValue),
      savingsAccount: formatAmount(savingsAccountValue),
      yearlyPrincipal: formatAmount(yearlyPrincipal),
    };
  };

  const potentialSavingsMetric = category.insight?.metrics?.find(
    (m) => m.label.toLowerCase().includes("potential savings") || m.label.toLowerCase().includes("potential")
  );

  let savingsPotential = null;
  let monthlySavings = 0;
  
  if (potentialSavingsMetric) {
    const value = potentialSavingsMetric.value;
    const rangeMatch = value.match(/£?([\d,]+(?:\.\d{1,2})?)\s*-\s*£?([\d,]+(?:\.\d{1,2})?)/);
    
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1].replace(/,/g, ''));
      const max = parseFloat(rangeMatch[2].replace(/,/g, ''));
      monthlySavings = (min + max) / 2;
    } else {
      const singleMatch = value.match(/£?([\d,]+(?:\.\d{1,2})?)/);
      if (singleMatch) {
        monthlySavings = parseFloat(singleMatch[1].replace(/,/g, ''));
      }
    }
  } else {
    const monthsInPeriod = getMonthsFromTransactions(category.transactions);
    monthlySavings = category.totals.spendToDate / monthsInPeriod;
  }
  
  if (monthlySavings > 0) {
    savingsPotential = calculateSavingsPotential(monthlySavings);
  }

  return (
    <Sheet open={!!category} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-lg" data-testid="sheet-category-insights">
        <SheetHeader>
          <SheetTitle className="font-heading text-2xl">{category.name} Insights</SheetTitle>
          <SheetDescription>
            Detailed analysis and recommendations for this category
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Spend</span>
                <span className="text-xl font-semibold">{formatAmount(category.totals.spendToDate)}</span>
              </div>
              
              {category.totals.monthOverMonth !== 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">vs Last Month</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={category.totals.monthOverMonth > 0 ? "destructive" : "default"}
                      className="gap-1"
                    >
                      {category.totals.monthOverMonth > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(category.totals.monthOverMonth)}%
                    </Badge>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Transactions</span>
                <span className="font-medium">{category.totals.transactionCount}</span>
              </div>
            </CardContent>
          </Card>

          {category.insight && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Smart Insight
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{category.insight.headline}</h4>
                  <p className="text-muted-foreground text-sm">{category.insight.body}</p>
                </div>

                {category.insight.metrics && category.insight.metrics.length > 0 && (
                  <div className="pt-4 border-t space-y-3">
                    <h5 className="text-sm font-medium">Key Metrics</h5>
                    {category.insight.metrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                        <span className="text-sm font-medium">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {savingsPotential && (
                  <div className="pt-4 border-t space-y-3">
                    <h5 className="text-sm font-medium">Yearly Growth Potential</h5>
                    <p className="text-xs text-muted-foreground">
                      {potentialSavingsMetric 
                        ? "If you saved this amount for a year, here's what it could grow to:"
                        : "Based on your monthly average, here's what this amount could grow to if invested for a year:"}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Average</span>
                        <span className="text-sm font-medium">{formatAmount(monthlySavings)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Yearly Total (12 months)</span>
                        <span className="text-sm font-medium">{savingsPotential.yearlyPrincipal}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">In Index Fund (8% return)</span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-500">{savingsPotential.indexFund}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">In Savings Account (4.5% interest)</span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-500">{savingsPotential.savingsAccount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

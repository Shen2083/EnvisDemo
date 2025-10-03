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

interface TransactionCategory {
  id: string;
  name: string;
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
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

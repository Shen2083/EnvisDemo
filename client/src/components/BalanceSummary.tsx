import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, AlertCircle } from "lucide-react";

interface BalanceSummaryProps {
  totalBalance: number;
  monthlyNetFlow: number;
  activeGoals: number;
  pendingAlerts: number;
}

export function BalanceSummary({ totalBalance, monthlyNetFlow, activeGoals, pendingAlerts }: BalanceSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Family Balance</span>
          </div>
          <div className="text-3xl font-bold tabular-nums">
            £{totalBalance.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Monthly Net Flow</span>
            {monthlyNetFlow >= 0 ? (
              <TrendingUp className="h-4 w-4 text-chart-3" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </div>
          <div className={`text-3xl font-bold tabular-nums ${monthlyNetFlow >= 0 ? "text-chart-3" : "text-destructive"}`}>
            {monthlyNetFlow >= 0 ? "+" : ""}£{Math.abs(monthlyNetFlow).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Active Goals</span>
            <Target className="h-4 w-4 text-chart-2" />
          </div>
          <div className="text-3xl font-bold tabular-nums">
            {activeGoals}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Insights</span>
            <AlertCircle className="h-4 w-4 text-chart-4" />
          </div>
          <div className="text-3xl font-bold tabular-nums">
            {pendingAlerts}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

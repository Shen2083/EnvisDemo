import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, AlertCircle, Scale, CheckCircle } from "lucide-react";
import { Link } from "wouter";

interface FairnessStatus {
  agreedRatio: [number, number];
  actualRatio: [number, number];
  isOnTrack: boolean;
}

interface BalanceSummaryProps {
  totalBalance: number;
  monthlyNetFlow: number;
  activeGoals: number;
  pendingAlerts: number;
  fairnessStatus?: FairnessStatus | null;
}

export function BalanceSummary({ totalBalance, monthlyNetFlow, activeGoals, pendingAlerts, fairnessStatus }: BalanceSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

      <Link href="/goals">
        <Card className="cursor-pointer hover-elevate active-elevate-2" data-testid="card-goals">
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
      </Link>

      <Link href="/insights">
        <Card className="cursor-pointer hover-elevate active-elevate-2" data-testid="card-insights">
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
      </Link>

      <Link href="/family">
        <Card className="cursor-pointer hover-elevate active-elevate-2" data-testid="card-fairness-tracker">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Fairness Tracker</span>
              <Scale className="h-4 w-4 text-chart-5" />
            </div>
            {fairnessStatus ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tabular-nums">
                  {fairnessStatus.agreedRatio[0]}/{fairnessStatus.agreedRatio[1]}
                </span>
                {fairnessStatus.isOnTrack ? (
                  <span className="text-xs text-chart-3 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    On Track
                  </span>
                ) : (
                  <span className="text-xs text-chart-4 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Review
                  </span>
                )}
              </div>
            ) : (
              <div className="text-lg font-medium text-muted-foreground">
                Not Set
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

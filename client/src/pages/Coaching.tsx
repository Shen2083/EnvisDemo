import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Sparkles,
  ArrowRight,
  Calendar,
  DollarSign,
  PiggyBank,
} from "lucide-react";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

interface IncomePattern {
  monthlyIncome: number;
  lastThreeMonths: number[];
  trend: "up" | "down" | "stable";
  nextExpected: {
    amount: number;
    date: string;
  };
}

interface SpendingPattern {
  monthlyAverage: number;
  thisMonth: number;
  categories: {
    name: string;
    amount: number;
    percentage: number;
  }[];
  trend: "up" | "down" | "stable";
}

interface GoalImpact {
  monthlyAvailable: number;
  currentAllocation: number;
  recommendedAllocation: number;
  projectedCompletion: string;
  monthsAhead: number;
}

export default function Coaching() {
  const { toast } = useToast();
  const [recommendationApplied, setRecommendationApplied] = useState(false);
  const [goals] = useState<Goal[]>([
    {
      id: "1",
      name: "House Deposit",
      targetAmount: 20000,
      currentAmount: 5500,
      targetDate: "Oct 2028",
    },
    {
      id: "2",
      name: "Family Holiday",
      targetAmount: 5000,
      currentAmount: 2800,
      targetDate: "Jul 2026",
    },
  ]);

  const incomePattern: IncomePattern = {
    monthlyIncome: 2500,
    lastThreeMonths: [2500, 2500, 2500],
    trend: "stable",
    nextExpected: {
      amount: 2500,
      date: "1 Oct 2025",
    },
  };

  const spendingPattern: SpendingPattern = {
    monthlyAverage: 1750,
    thisMonth: 1817.90,
    categories: [
      { name: "Groceries", amount: 165.40, percentage: 9 },
      { name: "Eating Out", amount: 152.50, percentage: 8 },
      { name: "Entertainment", amount: 95.00, percentage: 5 },
      { name: "Transport", amount: 130.00, percentage: 7 },
      { name: "Shopping", amount: 275.00, percentage: 15 },
      { name: "Bills & Utilities", amount: 500.00, percentage: 27 },
      { name: "Other", amount: 500.00, percentage: 27 },
    ],
    trend: "up",
  };

  const calculateGoalImpact = (goal: Goal): GoalImpact => {
    const monthlyAvailable = incomePattern.monthlyIncome - spendingPattern.thisMonth;
    const remaining = goal.targetAmount - goal.currentAmount;
    const currentAllocation = 500;
    
    const savingsOpportunity = spendingPattern.thisMonth - spendingPattern.monthlyAverage;
    const recommendedAllocation = currentAllocation + Math.max(0, savingsOpportunity);
    
    const monthsToGoal = Math.ceil(remaining / recommendedAllocation);
    const currentDate = new Date();
    const projectedDate = new Date(currentDate.setMonth(currentDate.getMonth() + monthsToGoal));
    
    const targetDate = new Date(goal.targetDate);
    const currentMonthsToTarget = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
    const monthsAhead = currentMonthsToTarget - monthsToGoal;
    
    return {
      monthlyAvailable,
      currentAllocation,
      recommendedAllocation,
      projectedCompletion: projectedDate.toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      }),
      monthsAhead,
    };
  };

  const primaryGoal = goals[0];
  const goalImpact = calculateGoalImpact(primaryGoal);
  const progressPercentage = (primaryGoal.currentAmount / primaryGoal.targetAmount) * 100;

  const handleApplyRecommendation = () => {
    setRecommendationApplied(true);
    toast({
      title: "Recommendation Applied Successfully",
      description: `Your ${primaryGoal.name} allocation has been updated to ${formatCurrency(goalImpact.recommendedAllocation)}/month. You're now on track to reach your goal ${goalImpact.monthsAhead} months early.`,
    });
  };

  const handleExploreMore = () => {
    toast({
      title: "Exploring More Options",
      description: "Let's look at other ways to optimize your finances and reach your goals faster.",
    });
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-chart-3" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <div className="w-4 h-4" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">AI Financial Coach</h1>
        <p className="text-muted-foreground">
          Your personalized path to achieving your family goals
        </p>
      </div>

      <Card className="bg-chart-3/5">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-chart-3/20">
              <Sparkles className="w-6 h-6 text-chart-3" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-heading mb-2 flex items-center gap-2">
                Great news, Alex & Sam! You're on track
                <Target className="w-5 h-5 text-chart-3" />
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Based on your income and spending patterns, you can reach your House Deposit goal{" "}
                <span className="font-semibold text-foreground">
                  {goalImpact.monthsAhead} months early
                </span>{" "}
                with a few small adjustments.
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card data-testid="card-income-pattern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-chart-3" />
              Income Pattern
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Income</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{formatCurrency(incomePattern.monthlyIncome)}</span>
                {getTrendIcon(incomePattern.trend)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last 3 Months Average</span>
                <span className="font-medium">
                  {formatCurrency(incomePattern.lastThreeMonths.reduce((a, b) => a + b, 0) / 3)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Trend</span>
                <Badge variant="secondary" className="capitalize">
                  {incomePattern.trend}
                </Badge>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Next Expected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{incomePattern.nextExpected.date}</span>
                <span className="font-semibold">{formatCurrency(incomePattern.nextExpected.amount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-spending-pattern">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-chart-4" />
              Spending Pattern
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">This Month</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{formatCurrency(spendingPattern.thisMonth)}</span>
                {getTrendIcon(spendingPattern.trend)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Monthly Average</span>
                <span className="font-medium">{formatCurrency(spendingPattern.monthlyAverage)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Variance</span>
                <Badge variant={spendingPattern.trend === "up" ? "destructive" : "secondary"}>
                  +{formatCurrency(spendingPattern.thisMonth - spendingPattern.monthlyAverage)}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Top Categories</p>
              {spendingPattern.categories.slice(0, 3).map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{cat.name}</span>
                      <span className="font-medium">{formatCurrency(cat.amount)}</span>
                    </div>
                    <Progress value={cat.percentage} className="h-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-goal-impact">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Goal: {primaryGoal.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">
                {formatCurrency(primaryGoal.currentAmount)} of {formatCurrency(primaryGoal.targetAmount)}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground mb-1">Monthly Available</div>
              <div className="text-2xl font-bold text-chart-3">
                {formatCurrency(goalImpact.monthlyAvailable)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Income - Spending
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground mb-1">
                {recommendationApplied ? "New Allocation" : "Current Allocation"}
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(recommendationApplied ? goalImpact.recommendedAllocation : goalImpact.currentAllocation)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Per month to goal
              </div>
              {recommendationApplied && (
                <Badge variant="default" className="mt-2">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Updated
                </Badge>
              )}
            </div>
          </div>

          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <PiggyBank className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">AI Recommendation</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    You're spending <span className="font-semibold text-foreground">
                      {formatCurrency(spendingPattern.thisMonth - spendingPattern.monthlyAverage)}
                    </span> more than usual this month. By bringing spending back to your average, you could allocate{" "}
                    <span className="font-semibold text-foreground">
                      {formatCurrency(goalImpact.recommendedAllocation)}
                    </span> per month to your House Deposit.
                  </p>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-background/50 border">
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">New Completion Date</div>
                      <div className="text-lg font-semibold">{goalImpact.projectedCompletion}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Current Target</div>
                      <div className="text-lg font-semibold">{primaryGoal.targetDate}</div>
                    </div>
                  </div>
                  <div className="mt-3 p-2 rounded bg-chart-3/10 text-sm text-center flex items-center justify-center gap-2">
                    <span className="font-semibold text-chart-3">
                      {goalImpact.monthsAhead} months ahead of schedule
                    </span>
                    <Target className="w-4 h-4 text-chart-3" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button 
              className="flex-1" 
              data-testid="button-apply-recommendation"
              onClick={handleApplyRecommendation}
              disabled={recommendationApplied}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {recommendationApplied ? "Recommendation Applied" : "Apply Recommendation"}
            </Button>
            <Button 
              variant="outline" 
              data-testid="button-explore-more"
              onClick={handleExploreMore}
            >
              Explore More Options
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-quick-actions">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" data-testid="button-action-budget-alert">
            <DollarSign className="w-4 h-4 mr-2" />
            Set Budget Alert for Top Spending Categories
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-action-auto-save">
            <PiggyBank className="w-4 h-4 mr-2" />
            Set Up Automatic Savings Transfer
          </Button>
          <Button variant="outline" className="w-full justify-start" data-testid="button-action-review-goals">
            <Target className="w-4 h-4 mr-2" />
            Review All Family Goals
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

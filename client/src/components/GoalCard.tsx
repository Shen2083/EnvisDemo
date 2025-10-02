import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

interface GoalCardProps {
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export function GoalCard({ name, targetAmount, currentAmount, targetDate }: GoalCardProps) {
  const percentage = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);

  return (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
        <CardTitle className="text-lg font-heading">{name}</CardTitle>
        <div className="h-10 w-10 rounded-lg bg-chart-2/20 flex items-center justify-center flex-shrink-0">
          <Target className="h-5 w-5 text-chart-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold tabular-nums">
              £{currentAmount.toLocaleString("en-GB")}
            </span>
            <span className="text-sm text-muted-foreground">
              of £{targetAmount.toLocaleString("en-GB")}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Target: {targetDate}</span>
          <span className="font-medium text-chart-2">{percentage}% complete</span>
        </div>
      </CardContent>
    </Card>
  );
}

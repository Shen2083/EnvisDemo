import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Pencil, Trash2 } from "lucide-react";

interface GoalCardProps {
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function GoalCard({ name, targetAmount, currentAmount, targetDate, onEdit, onDelete }: GoalCardProps) {
  const percentage = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);

  return (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
        <CardTitle className="text-lg font-heading">{name}</CardTitle>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-chart-2/20 flex items-center justify-center flex-shrink-0">
            <Target className="h-5 w-5 text-chart-2" />
          </div>
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

        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2 border-t">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onEdit}
                data-testid="button-edit-goal"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onDelete}
                data-testid="button-delete-goal"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

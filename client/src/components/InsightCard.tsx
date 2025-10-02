import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, Target, CreditCard } from "lucide-react";

interface InsightCardProps {
  type: "subscription" | "spending" | "goal" | "cashflow";
  headline: string;
  body: string;
  onDismiss?: (e?: React.MouseEvent) => void;
}

const INSIGHT_CONFIG = {
  subscription: {
    icon: CreditCard,
    bgColor: "bg-chart-2/10",
    iconColor: "text-chart-2",
    borderColor: "border-l-chart-2",
  },
  spending: {
    icon: AlertCircle,
    bgColor: "bg-chart-4/10",
    iconColor: "text-chart-4",
    borderColor: "border-l-chart-4",
  },
  goal: {
    icon: Target,
    bgColor: "bg-chart-3/10",
    iconColor: "text-chart-3",
    borderColor: "border-l-chart-3",
  },
  cashflow: {
    icon: TrendingUp,
    bgColor: "bg-destructive/10",
    iconColor: "text-destructive",
    borderColor: "border-l-destructive",
  },
};

export function InsightCard({ type, headline, body, onDismiss }: InsightCardProps) {
  const config = INSIGHT_CONFIG[type];
  const Icon = config.icon;

  return (
    <Card className={`border-l-4 ${config.borderColor}`}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
        <div className={`h-10 w-10 rounded-lg ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-lg font-heading">{headline}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base leading-relaxed">{body}</p>
        <div className="flex gap-3">
          <Button variant="default" size="sm" data-testid="button-insight-action">
            Review
          </Button>
          {onDismiss && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(e);
              }}
              data-testid="button-insight-dismiss"
            >
              Dismiss
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

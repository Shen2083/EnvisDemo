import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, Target, CreditCard, ArrowLeft, CheckCircle } from "lucide-react";

interface InsightDetailProps {
  type: "subscription" | "spending" | "goal" | "cashflow";
  headline: string;
  body: string;
  onBack: () => void;
  onTakeAction: () => void;
  onDismiss: () => void;
}

const INSIGHT_CONFIG = {
  subscription: {
    icon: CreditCard,
    bgColor: "bg-chart-2/10",
    iconColor: "text-chart-2",
    borderColor: "border-l-chart-2",
    actionLabel: "Review Subscriptions",
    detailSections: [
      {
        title: "Current Subscriptions",
        items: [
          { name: "Netflix", cost: "£11.99/month", status: "active" },
          { name: "Disney+", cost: "£7.99/month", status: "active" },
          { name: "Prime Video", cost: "£8.99/month", status: "active" },
        ],
      },
      {
        title: "Potential Savings",
        description: "By consolidating to 1-2 services, you could save approximately £180/year",
      },
    ],
  },
  spending: {
    icon: AlertCircle,
    bgColor: "bg-chart-4/10",
    iconColor: "text-chart-4",
    borderColor: "border-l-chart-4",
    actionLabel: "Set Budget Alert",
    detailSections: [
      {
        title: "Eating Out Analysis",
        items: [
          { name: "This Month", cost: "£350", status: "warning" },
          { name: "Monthly Average", cost: "£200", status: "normal" },
          { name: "Difference", cost: "+£150", status: "warning" },
        ],
      },
      {
        title: "Recent Transactions",
        items: [
          { name: "The Italian Restaurant", cost: "£85.00", date: "22 Sep" },
          { name: "Pizza Express", cost: "£55.00", date: "20 Sep" },
          { name: "Costa Coffee", cost: "£12.50", date: "23 Sep" },
        ],
      },
    ],
  },
  goal: {
    icon: Target,
    bgColor: "bg-chart-3/10",
    iconColor: "text-chart-3",
    borderColor: "border-l-chart-3",
    actionLabel: "View Goal Details",
    detailSections: [
      {
        title: "House Deposit Progress",
        items: [
          { name: "Current Amount", cost: "£5,500", status: "success" },
          { name: "Target Amount", cost: "£20,000", status: "normal" },
          { name: "This Month", cost: "+£500", status: "success" },
          { name: "Required Monthly", cost: "£417", status: "normal" },
        ],
      },
      {
        title: "Performance",
        description: "You're £83 ahead of your monthly target. At this rate, you'll reach your goal 2 months early!",
      },
    ],
  },
  cashflow: {
    icon: TrendingUp,
    bgColor: "bg-destructive/10",
    iconColor: "text-destructive",
    borderColor: "border-l-destructive",
    actionLabel: "Transfer Funds",
    detailSections: [
      {
        title: "Upcoming Payment",
        items: [
          { name: "Mortgage Payment", cost: "£1,500", date: "Due in 3 days" },
          { name: "Joint Account Balance", cost: "£800", status: "warning" },
          { name: "Shortfall", cost: "£700", status: "warning" },
        ],
      },
      {
        title: "Recommended Action",
        description: "Transfer £700 from your Personal Savings (current balance: £12,500) to avoid overdraft fees.",
      },
    ],
  },
};

export function InsightDetail({
  type,
  headline,
  body,
  onBack,
  onTakeAction,
  onDismiss,
}: InsightDetailProps) {
  const config = INSIGHT_CONFIG[type];
  const Icon = config.icon;

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={onBack}
        data-testid="button-back-to-insights"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Insights
      </Button>

      <Card className={`border-l-4 ${config.borderColor}`}>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className={`h-12 w-12 rounded-lg ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl font-heading mb-2">{headline}</CardTitle>
              <p className="text-base text-muted-foreground leading-relaxed">{body}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {config.detailSections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="font-semibold text-lg">{section.title}</h3>
              
              {section.items && (
                <div className="space-y-3">
                  {section.items.map((item, itemIdx) => {
                    const itemDate = 'date' in item ? item.date : undefined;
                    const itemStatus = 'status' in item ? item.status : undefined;
                    return (
                      <div
                        key={itemIdx}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{item.name}</span>
                          {itemDate && (
                            <Badge variant="secondary" className="text-xs">
                              {itemDate}
                            </Badge>
                          )}
                          {itemStatus === "success" && (
                            <CheckCircle className="h-4 w-4 text-chart-3" />
                          )}
                        </div>
                        <span
                          className={`font-semibold tabular-nums ${
                            itemStatus === "warning"
                              ? "text-chart-4"
                              : itemStatus === "success"
                              ? "text-chart-3"
                              : ""
                          }`}
                        >
                          {item.cost}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {'description' in section && section.description && (
                <div className={`p-4 ${config.bgColor} rounded-lg`}>
                  <p className="text-base leading-relaxed">{section.description}</p>
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-6 border-t">
            <Button
              className="flex-1"
              onClick={onTakeAction}
              data-testid="button-take-action"
            >
              {config.actionLabel}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={onDismiss}
              data-testid="button-dismiss-insight"
            >
              Dismiss Insight
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

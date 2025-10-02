import { useState } from "react";
import { InsightCard } from "@/components/InsightCard";

interface Insight {
  id: string;
  type: "subscription" | "spending" | "goal" | "cashflow";
  headline: string;
  body: string;
}

export default function Insights() {
  // TODO: remove mock data - replace with AI-generated insights
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: "1",
      type: "cashflow",
      headline: "Heads Up: Low Balance Alert",
      body: "Your £1,500 mortgage payment is due from your Joint Account in 3 days, but the current balance is only £800. We recommend moving £700 from your 'Personal Savings' to avoid issues.",
    },
    {
      id: "2",
      type: "subscription",
      headline: "Subscription Check-in",
      body: "We noticed you have 3 similar streaming subscriptions (Netflix, Disney+, Prime Video) costing £35/month. Could you consolidate?",
    },
    {
      id: "3",
      type: "spending",
      headline: "Unusual Spending Detected",
      body: "Your family's 'Eating Out' spending is £150 higher than your £200 monthly average. Are you aware of this?",
    },
    {
      id: "4",
      type: "goal",
      headline: "Great Progress on Your House Deposit!",
      body: "You've saved £500 towards your goal this month, putting you £83 ahead of schedule. Keep it up!",
    },
  ]);

  const handleDismiss = (id: string) => {
    setInsights(insights.filter((insight) => insight.id !== id));
    console.log("Dismissed insight:", id);
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Smart Insights</h1>
        <p className="text-muted-foreground">
          Proactive recommendations to prevent stress and build wealth
        </p>
      </div>

      {insights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-muted-foreground">
            No new insights at the moment. Check back soon!
          </div>
        </div>
      ) : (
        <div className="max-w-3xl space-y-6">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id}
              {...insight}
              onDismiss={() => handleDismiss(insight.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

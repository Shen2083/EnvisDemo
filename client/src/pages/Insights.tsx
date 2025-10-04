import { useState } from "react";
import { InsightCard } from "@/components/InsightCard";
import { InsightDetail } from "@/components/InsightDetail";

interface Insight {
  id: string;
  type: "subscription" | "spending" | "goal" | "cashflow";
  headline: string;
  body: string;
}

export default function Insights() {
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  // TODO: remove mock data - replace with AI-generated insights
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: "1",
      type: "cashflow",
      headline: "Heads Up: Low Balance Alert",
      body: "Your £1,500 mortgage payment is due from your Joint Account in 3 days, but the current balance is only £800. We recommend moving £700 from your 'Personal Savings' to avoid issues. This is exactly why building your Emergency Fund is critical - it would prevent this stress!",
    },
    {
      id: "2",
      type: "subscription",
      headline: "Subscription Check-in",
      body: "We noticed you have 3 similar streaming subscriptions (Netflix, Disney+, Prime Video) costing £35/month. Could you consolidate? That £35/month could boost your Emergency Fund - in 6 months, that's £210 toward your safety net.",
    },
    {
      id: "3",
      type: "spending",
      headline: "Unusual Spending Detected",
      body: "Your family's 'Eating Out' spending is £150 higher than your £200 monthly average. Are you aware of this? Reducing this could accelerate your House Deposit goal by 11 months!",
    },
    {
      id: "4",
      type: "goal",
      headline: "Great Progress on Your House Deposit!",
      body: "You've saved £500 towards your goal this month, putting you £83 ahead of schedule. Keep it up!",
    },
    {
      id: "5",
      type: "goal",
      headline: "Emergency Fund: Your Financial Safety Net",
      body: "You're making great progress on your goals, but your recent cashflow alert shows you need an emergency buffer. At £300/month, you'll reach £9,000 (3 months expenses) by December 2026.",
    },
    {
      id: "6",
      type: "goal",
      headline: "Kids Education Fund: Compound Growth Working for You",
      body: "Starting early pays off! Your £150/month contributions to the Kids Education Fund will benefit from compound growth over 6 years. Consider a Junior ISA to boost returns by £200-300/year tax-free.",
    },
  ]);

  const handleDismiss = (id: string) => {
    setInsights(insights.filter((insight) => insight.id !== id));
    setSelectedInsight(null);
    console.log("Dismissed insight:", id);
  };

  const handleReview = (insight: Insight) => {
    setSelectedInsight(insight);
    console.log("Reviewing insight:", insight.id);
  };

  const handleTakeAction = () => {
    console.log("Taking action on insight:", selectedInsight?.id);
    // In a real app, this would trigger specific actions based on insight type
  };

  if (selectedInsight) {
    return (
      <InsightDetail
        {...selectedInsight}
        onBack={() => setSelectedInsight(null)}
        onTakeAction={handleTakeAction}
        onDismiss={() => handleDismiss(selectedInsight.id)}
      />
    );
  }

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
            <div key={insight.id} onClick={() => handleReview(insight)} className="cursor-pointer">
              <InsightCard
                {...insight}
                onDismiss={(e) => {
                  e?.stopPropagation();
                  handleDismiss(insight.id);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

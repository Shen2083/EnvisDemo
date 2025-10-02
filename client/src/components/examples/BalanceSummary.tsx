import { BalanceSummary } from "../BalanceSummary";

export default function BalanceSummaryExample() {
  return (
    <div className="p-6">
      <BalanceSummary
        totalBalance={15300.50}
        monthlyNetFlow={750.00}
        activeGoals={2}
        pendingAlerts={4}
      />
    </div>
  );
}

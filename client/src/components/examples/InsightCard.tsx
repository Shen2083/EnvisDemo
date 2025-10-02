import { InsightCard } from "../InsightCard";

export default function InsightCardExample() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <InsightCard
        type="subscription"
        headline="Subscription Check-in"
        body="We noticed you have 3 similar streaming subscriptions (Netflix, Disney+, Prime Video) costing £35/month. Could you consolidate?"
        onDismiss={() => console.log("Dismissed")}
      />
      <InsightCard
        type="cashflow"
        headline="Heads Up: Low Balance Alert"
        body="Your £1,500 mortgage payment is due from your Joint Account in 3 days, but the current balance is only £800. We recommend moving £700 from your 'Personal Savings' to avoid issues."
        onDismiss={() => console.log("Dismissed")}
      />
    </div>
  );
}

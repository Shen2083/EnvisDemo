import { InsightDetail } from "../InsightDetail";

export default function InsightDetailExample() {
  return (
    <InsightDetail
      type="cashflow"
      headline="Heads Up: Low Balance Alert"
      body="Your £1,500 mortgage payment is due from your Joint Account in 3 days, but the current balance is only £800. We recommend moving £700 from your 'Personal Savings' to avoid issues."
      onBack={() => console.log("Back clicked")}
      onTakeAction={() => console.log("Take action clicked")}
      onDismiss={() => console.log("Dismiss clicked")}
    />
  );
}

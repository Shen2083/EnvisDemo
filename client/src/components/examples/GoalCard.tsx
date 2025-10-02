import { GoalCard } from "../GoalCard";

export default function GoalCardExample() {
  return (
    <div className="p-6 max-w-md mx-auto">
      <GoalCard
        name="House Deposit"
        targetAmount={20000}
        currentAmount={5500}
        targetDate="Oct 2028"
      />
    </div>
  );
}

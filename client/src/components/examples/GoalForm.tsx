import { GoalForm } from "../GoalForm";

const mockAccounts = [
  { id: "joint", name: "Joint Savings" },
  { id: "personal", name: "Personal ISA" },
  { id: "savings", name: "Emergency Fund" },
];

export default function GoalFormExample() {
  return (
    <GoalForm
      onSubmit={(goal) => console.log("Goal created:", goal)}
      onCancel={() => console.log("Cancelled")}
      availableAccounts={mockAccounts}
    />
  );
}

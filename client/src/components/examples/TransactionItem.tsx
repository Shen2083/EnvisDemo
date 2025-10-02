import { Card } from "@/components/ui/card";
import { TransactionItem } from "../TransactionItem";

export default function TransactionItemExample() {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-6">
      <TransactionItem
        merchantName="Tesco"
        amount={-55.40}
        date="28 Sep 2025"
        accountLabel="Joint Account"
        category="Groceries"
      />
      <TransactionItem
        merchantName="Salary Deposit"
        amount={2500.00}
        date="27 Sep 2025"
        accountLabel="Personal Account"
        category="Income"
      />
    </Card>
  );
}

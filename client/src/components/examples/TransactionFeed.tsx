import { TransactionFeed } from "../TransactionFeed";

const mockTransactions = [
  { id: "1", merchantName: "Tesco", amount: -55.40, date: "28 Sep 2025", accountLabel: "Joint Account", category: "Groceries" },
  { id: "2", merchantName: "Amazon.co.uk", amount: -89.99, date: "27 Sep 2025", accountLabel: "Personal Account", category: "Shopping" },
  { id: "3", merchantName: "Salary Deposit", amount: 2500.00, date: "27 Sep 2025", accountLabel: "Personal Account", category: "Income" },
  { id: "4", merchantName: "Netflix", amount: -11.99, date: "26 Sep 2025", accountLabel: "Joint Account", category: "Entertainment" },
  { id: "5", merchantName: "Shell", amount: -45.50, date: "25 Sep 2025", accountLabel: "Personal Account", category: "Transport" },
];

export default function TransactionFeedExample() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <TransactionFeed transactions={mockTransactions} />
    </div>
  );
}

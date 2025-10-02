import { BalanceSummary } from "@/components/BalanceSummary";
import { TransactionFeed } from "@/components/TransactionFeed";

// TODO: remove mock data - replace with real API data
const mockTransactions = [
  { id: "1", merchantName: "Tesco", amount: -55.40, date: "28 Sep 2025", accountLabel: "Joint Account", category: "Groceries" },
  { id: "2", merchantName: "Amazon.co.uk", amount: -89.99, date: "27 Sep 2025", accountLabel: "Shen's Amex", category: "Shopping" },
  { id: "3", merchantName: "Salary Deposit", amount: 2500.00, date: "27 Sep 2025", accountLabel: "Personal Account", category: "Income" },
  { id: "4", merchantName: "Netflix", amount: -11.99, date: "26 Sep 2025", accountLabel: "Joint Account", category: "Entertainment" },
  { id: "5", merchantName: "Disney+", amount: -7.99, date: "25 Sep 2025", accountLabel: "Joint Account", category: "Entertainment" },
  { id: "6", merchantName: "Shell Petrol", amount: -45.50, date: "25 Sep 2025", accountLabel: "Personal Account", category: "Transport" },
  { id: "7", merchantName: "Prime Video", amount: -8.99, date: "24 Sep 2025", accountLabel: "Joint Account", category: "Entertainment" },
  { id: "8", merchantName: "Sainsbury's", amount: -67.20, date: "24 Sep 2025", accountLabel: "Joint Account", category: "Groceries" },
  { id: "9", merchantName: "Costa Coffee", amount: -12.50, date: "23 Sep 2025", accountLabel: "Personal Account", category: "Eating Out" },
  { id: "10", merchantName: "The Italian Restaurant", amount: -85.00, date: "22 Sep 2025", accountLabel: "Joint Account", category: "Eating Out" },
  { id: "11", merchantName: "Uber", amount: -18.50, date: "22 Sep 2025", accountLabel: "Personal Account", category: "Transport" },
  { id: "12", merchantName: "Waitrose", amount: -42.80, date: "21 Sep 2025", accountLabel: "Joint Account", category: "Groceries" },
  { id: "13", merchantName: "Pizza Express", amount: -55.00, date: "20 Sep 2025", accountLabel: "Joint Account", category: "Eating Out" },
  { id: "14", merchantName: "Sports Direct", amount: -34.99, date: "19 Sep 2025", accountLabel: "Personal Account", category: "Shopping" },
  { id: "15", merchantName: "Transfer to Savings", amount: -500.00, date: "15 Sep 2025", accountLabel: "Joint Account", category: "Savings" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Family Dashboard</h1>
        <p className="text-muted-foreground">
          One family, one complete financial picture
        </p>
      </div>

      <BalanceSummary
        totalBalance={15300.50}
        monthlyNetFlow={750.00}
        activeGoals={2}
        pendingAlerts={4}
      />

      <TransactionFeed transactions={mockTransactions} />
    </div>
  );
}

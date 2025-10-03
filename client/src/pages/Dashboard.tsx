import { useState } from "react";
import { BalanceSummary } from "@/components/BalanceSummary";
import { TransactionGroups } from "@/components/TransactionGroups";

interface Transaction {
  id: string;
  merchantName: string;
  amount: number;
  date: string;
  accountLabel: string;
  category: string;
}

interface CategoryInsight {
  headline: string;
  body: string;
  metrics?: {
    label: string;
    value: string;
  }[];
}

interface TransactionCategory {
  id: string;
  name: string;
  transactions: Transaction[];
  totals: {
    spendToDate: number;
    monthOverMonth: number;
    transactionCount: number;
  };
  insight?: CategoryInsight;
}

// TODO: remove mock data - replace with real API data
const mockCategories: TransactionCategory[] = [
  {
    id: "groceries",
    name: "Groceries",
    transactions: [
      { id: "1", merchantName: "Tesco", amount: -55.40, date: "28 Sep 2025", accountLabel: "Joint Account", category: "Groceries" },
      { id: "8", merchantName: "Sainsbury's", amount: -67.20, date: "24 Sep 2025", accountLabel: "Joint Account", category: "Groceries" },
      { id: "12", merchantName: "Waitrose", amount: -42.80, date: "21 Sep 2025", accountLabel: "Joint Account", category: "Groceries" },
    ],
    totals: {
      spendToDate: 165.40,
      monthOverMonth: 12.5,
      transactionCount: 3,
    },
    insight: {
      headline: "Groceries on Track",
      body: "Your grocery spending is £165 this month, 12.5% higher than last month. This is within your typical range.",
      metrics: [
        { label: "This Month", value: "£165.40" },
        { label: "Last Month", value: "£147.00" },
        { label: "Avg Transaction", value: "£55.13" },
      ],
    },
  },
  {
    id: "eating-out",
    name: "Eating Out",
    transactions: [
      { id: "9", merchantName: "Costa Coffee", amount: -12.50, date: "23 Sep 2025", accountLabel: "Personal Account", category: "Eating Out" },
      { id: "10", merchantName: "The Italian Restaurant", amount: -85.00, date: "22 Sep 2025", accountLabel: "Joint Account", category: "Eating Out" },
      { id: "13", merchantName: "Pizza Express", amount: -55.00, date: "20 Sep 2025", accountLabel: "Joint Account", category: "Eating Out" },
    ],
    totals: {
      spendToDate: 152.50,
      monthOverMonth: 35.8,
      transactionCount: 3,
    },
    insight: {
      headline: "Eating Out Above Average",
      body: "Your family's eating out spending is £152 this month, 36% higher than your £112 monthly average. Consider setting a budget limit.",
      metrics: [
        { label: "This Month", value: "£152.50" },
        { label: "Monthly Average", value: "£112.30" },
        { label: "Largest", value: "£85.00 - Italian Restaurant" },
      ],
    },
  },
  {
    id: "entertainment",
    name: "Entertainment",
    transactions: [
      { id: "4", merchantName: "Netflix", amount: -11.99, date: "26 Sep 2025", accountLabel: "Joint Account", category: "Entertainment" },
      { id: "5", merchantName: "Disney+", amount: -7.99, date: "25 Sep 2025", accountLabel: "Joint Account", category: "Entertainment" },
      { id: "7", merchantName: "Prime Video", amount: -8.99, date: "24 Sep 2025", accountLabel: "Joint Account", category: "Entertainment" },
    ],
    totals: {
      spendToDate: 28.97,
      monthOverMonth: 0,
      transactionCount: 3,
    },
    insight: {
      headline: "Multiple Streaming Subscriptions",
      body: "You have 3 streaming subscriptions costing £29/month. Consider consolidating to save money.",
      metrics: [
        { label: "Monthly Cost", value: "£28.97" },
        { label: "Annual Cost", value: "£347.64" },
        { label: "Potential Savings", value: "£15-20/month" },
      ],
    },
  },
  {
    id: "transport",
    name: "Transport",
    transactions: [
      { id: "6", merchantName: "Shell Petrol", amount: -45.50, date: "25 Sep 2025", accountLabel: "Personal Account", category: "Transport" },
      { id: "11", merchantName: "Uber", amount: -18.50, date: "22 Sep 2025", accountLabel: "Personal Account", category: "Transport" },
    ],
    totals: {
      spendToDate: 64.00,
      monthOverMonth: -8.5,
      transactionCount: 2,
    },
    insight: {
      headline: "Transport Costs Lower",
      body: "Transport spending is down 8.5% this month at £64, suggesting efficient travel patterns.",
      metrics: [
        { label: "This Month", value: "£64.00" },
        { label: "Last Month", value: "£70.00" },
      ],
    },
  },
  {
    id: "shopping",
    name: "Shopping",
    transactions: [
      { id: "2", merchantName: "Amazon.co.uk", amount: -89.99, date: "27 Sep 2025", accountLabel: "Shen's Amex", category: "Shopping" },
      { id: "14", merchantName: "Sports Direct", amount: -34.99, date: "19 Sep 2025", accountLabel: "Personal Account", category: "Shopping" },
    ],
    totals: {
      spendToDate: 124.98,
      monthOverMonth: 25.0,
      transactionCount: 2,
    },
  },
  {
    id: "income",
    name: "Income",
    transactions: [
      { id: "3", merchantName: "Salary Deposit", amount: 2500.00, date: "27 Sep 2025", accountLabel: "Personal Account", category: "Income" },
    ],
    totals: {
      spendToDate: 2500.00,
      monthOverMonth: 0,
      transactionCount: 1,
    },
  },
  {
    id: "savings",
    name: "Savings",
    transactions: [
      { id: "15", merchantName: "Transfer to Savings", amount: -500.00, date: "15 Sep 2025", accountLabel: "Joint Account", category: "Savings" },
    ],
    totals: {
      spendToDate: 500.00,
      monthOverMonth: 0,
      transactionCount: 1,
    },
    insight: {
      headline: "Great Savings Progress",
      body: "You've saved £500 this month. Keep up the consistent saving habit!",
      metrics: [
        { label: "This Month", value: "£500.00" },
        { label: "Savings Rate", value: "20% of income" },
      ],
    },
  },
];

export default function Dashboard() {
  const [categories, setCategories] = useState<TransactionCategory[]>(mockCategories);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<string[]>([]);
  const [activeInsightCategoryId, setActiveInsightCategoryId] = useState<string | null>(null);

  const handleMoveTransactions = (transactionIds: string[], targetCategoryId: string) => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];
      const targetCategory = newCategories.find((c) => c.id === targetCategoryId);
      if (!targetCategory) return prevCategories;

      const transactionsToMove: Transaction[] = [];
      newCategories.forEach((category) => {
        category.transactions = category.transactions.filter((tx) => {
          if (transactionIds.includes(tx.id)) {
            transactionsToMove.push({ ...tx, category: targetCategory.name });
            return false;
          }
          return true;
        });
      });

      targetCategory.transactions.push(...transactionsToMove);
      
      newCategories.forEach((category) => {
        const total = category.transactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
        category.totals = {
          ...category.totals,
          spendToDate: total,
          transactionCount: category.transactions.length,
        };
      });

      return newCategories;
    });

    setSelectedTransactionIds([]);
  };

  const activeCategory = categories.find((c) => c.id === activeInsightCategoryId);

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

      <TransactionGroups
        categories={categories}
        selectedTransactionIds={selectedTransactionIds}
        onSelectionChange={setSelectedTransactionIds}
        onMoveTransactions={handleMoveTransactions}
        onViewInsights={setActiveInsightCategoryId}
        activeCategory={activeCategory}
        onCloseInsights={() => setActiveInsightCategoryId(null)}
      />
    </div>
  );
}

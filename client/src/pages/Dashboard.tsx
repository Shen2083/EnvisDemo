import { useState, useMemo } from "react";
import { BalanceSummary } from "@/components/BalanceSummary";
import { TransactionGroups } from "@/components/TransactionGroups";
import { useFairness } from "@/context/FairnessContext";

interface Transaction {
  id: string;
  merchantName: string;
  amount: number;
  date: string;
  accountLabel: string;
  accountOwner: string; // Name of the account owner
  ownershipType: "individual" | "joint"; // Account ownership type
  category: string;
}

export type TimelineFilter = 
  | "current-month"
  | "previous-month"
  | "current-and-previous"
  | "last-3-months"
  | "last-6-months"
  | "year-to-date"
  | "last-2-years";

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
      { id: "1", merchantName: "Tesco", amount: -62.30, date: "27 Jan 2026", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Groceries" },
      { id: "8", merchantName: "Sainsbury's", amount: -71.50, date: "22 Jan 2026", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Groceries" },
      { id: "12", merchantName: "Waitrose", amount: -48.20, date: "18 Jan 2026", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Groceries" },
      { id: "16", merchantName: "Tesco", amount: -58.40, date: "28 Dec 2025", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Groceries" },
      { id: "17", merchantName: "Aldi", amount: -45.60, date: "21 Dec 2025", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Groceries" },
      { id: "18", merchantName: "M&S Food", amount: -89.90, date: "24 Dec 2025", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Groceries" },
    ],
    totals: {
      spendToDate: 375.90,
      monthOverMonth: 8.2,
      transactionCount: 6,
    },
    insight: {
      headline: "Groceries on Track",
      body: "Your grocery spending is £376 across December and January, 8% higher than usual due to holiday shopping. Back to normal now.",
      metrics: [
        { label: "This Month", value: "£182.00" },
        { label: "Last Month", value: "£193.90" },
        { label: "Avg Transaction", value: "£62.65" },
      ],
    },
  },
  {
    id: "eating-out",
    name: "Eating Out",
    transactions: [
      { id: "9", merchantName: "Costa Coffee", amount: -14.80, date: "26 Jan 2026", accountLabel: "Personal Account", accountOwner: "Alex", ownershipType: "individual", category: "Eating Out" },
      { id: "10", merchantName: "The Italian Restaurant", amount: -95.00, date: "18 Jan 2026", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Eating Out" },
      { id: "13", merchantName: "Nando's", amount: -48.50, date: "12 Jan 2026", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Eating Out" },
      { id: "19", merchantName: "Christmas Dinner Out", amount: -145.00, date: "25 Dec 2025", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Eating Out" },
      { id: "20", merchantName: "Starbucks", amount: -9.40, date: "22 Dec 2025", accountLabel: "Personal Account", accountOwner: "Sam", ownershipType: "individual", category: "Eating Out" },
      { id: "21", merchantName: "Pizza Express", amount: -62.00, date: "15 Dec 2025", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Eating Out" },
    ],
    totals: {
      spendToDate: 374.70,
      monthOverMonth: 42.5,
      transactionCount: 6,
    },
    insight: {
      headline: "Eating Out Above Average",
      body: "Your family's eating out spending is £375 over the holidays, 43% higher than your £112 monthly average. Reducing this could accelerate your House Deposit goal by 11 months.",
      metrics: [
        { label: "This Month", value: "£158.30" },
        { label: "Last Month", value: "£216.40" },
        { label: "Largest", value: "£145 - Christmas Dinner" },
        { label: "Connected Goal", value: "House Deposit" },
      ],
    },
  },
  {
    id: "entertainment",
    name: "Entertainment",
    transactions: [
      { id: "4", merchantName: "Netflix", amount: -12.99, date: "1 Jan 2026", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Entertainment" },
      { id: "5", merchantName: "Disney+", amount: -8.99, date: "1 Jan 2026", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Entertainment" },
      { id: "7", merchantName: "Prime Video", amount: -8.99, date: "1 Jan 2026", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Entertainment" },
      { id: "22", merchantName: "Netflix", amount: -12.99, date: "1 Dec 2025", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Entertainment" },
      { id: "23", merchantName: "Disney+", amount: -8.99, date: "1 Dec 2025", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Entertainment" },
      { id: "24", merchantName: "Prime Video", amount: -8.99, date: "1 Dec 2025", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Entertainment" },
    ],
    totals: {
      spendToDate: 61.94,
      monthOverMonth: 0,
      transactionCount: 6,
    },
    insight: {
      headline: "Multiple Streaming Subscriptions",
      body: "You have 3 streaming subscriptions costing £31/month. Consolidating could save £35/month and boost your Emergency Fund.",
      metrics: [
        { label: "Monthly Cost", value: "£30.97" },
        { label: "Annual Cost", value: "£371.64" },
        { label: "Potential Savings", value: "£35/month" },
        { label: "Connected Goal", value: "Emergency Fund" },
      ],
    },
  },
  {
    id: "transport",
    name: "Transport",
    transactions: [
      { id: "6", merchantName: "Shell Petrol", amount: -52.80, date: "25 Jan 2026", accountLabel: "Personal Account", accountOwner: "Alex", ownershipType: "individual", category: "Transport" },
      { id: "11", merchantName: "Uber", amount: -22.50, date: "20 Jan 2026", accountLabel: "Personal Account", accountOwner: "Sam", ownershipType: "individual", category: "Transport" },
      { id: "25", merchantName: "BP Petrol", amount: -48.60, date: "28 Dec 2025", accountLabel: "Personal Account", accountOwner: "Alex", ownershipType: "individual", category: "Transport" },
      { id: "26", merchantName: "Train Ticket", amount: -35.00, date: "23 Dec 2025", accountLabel: "Personal Account", accountOwner: "Sam", ownershipType: "individual", category: "Transport" },
    ],
    totals: {
      spendToDate: 158.90,
      monthOverMonth: 15.2,
      transactionCount: 4,
    },
    insight: {
      headline: "Transport Costs Higher",
      body: "Transport spending is up 15% due to holiday travel. Expected to normalize in February.",
      metrics: [
        { label: "This Month", value: "£75.30" },
        { label: "Last Month", value: "£83.60" },
      ],
    },
  },
  {
    id: "shopping",
    name: "Shopping",
    transactions: [
      { id: "2", merchantName: "Amazon.co.uk", amount: -67.99, date: "24 Jan 2026", accountLabel: "Sam's Amex", accountOwner: "Sam", ownershipType: "individual", category: "Shopping" },
      { id: "14", merchantName: "John Lewis", amount: -124.99, date: "20 Dec 2025", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Shopping" },
      { id: "27", merchantName: "Next", amount: -89.00, date: "27 Dec 2025", accountLabel: "Personal Account", accountOwner: "Sam", ownershipType: "individual", category: "Shopping" },
      { id: "28", merchantName: "Amazon.co.uk", amount: -156.50, date: "18 Dec 2025", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Shopping" },
    ],
    totals: {
      spendToDate: 438.48,
      monthOverMonth: 85.0,
      transactionCount: 4,
    },
    insight: {
      headline: "Holiday Shopping Spike",
      body: "Shopping was up 85% in December due to Christmas gifts. January spending is back to normal levels.",
      metrics: [
        { label: "This Month", value: "£67.99" },
        { label: "Last Month", value: "£370.49" },
      ],
    },
  },
  {
    id: "income",
    name: "Income",
    transactions: [
      { id: "3", merchantName: "Salary Deposit", amount: 2500.00, date: "1 Jan 2026", accountLabel: "Personal Account", accountOwner: "Alex", ownershipType: "individual", category: "Income" },
      { id: "29", merchantName: "Salary Deposit", amount: 2500.00, date: "1 Dec 2025", accountLabel: "Personal Account", accountOwner: "Alex", ownershipType: "individual", category: "Income" },
      { id: "30", merchantName: "Salary Deposit", amount: 1800.00, date: "1 Jan 2026", accountLabel: "Personal Account", accountOwner: "Sam", ownershipType: "individual", category: "Income" },
      { id: "31", merchantName: "Salary Deposit", amount: 1800.00, date: "1 Dec 2025", accountLabel: "Personal Account", accountOwner: "Sam", ownershipType: "individual", category: "Income" },
    ],
    totals: {
      spendToDate: 8600.00,
      monthOverMonth: 0,
      transactionCount: 4,
    },
  },
  {
    id: "savings",
    name: "Savings",
    transactions: [
      { id: "15", merchantName: "Transfer to Savings", amount: -500.00, date: "2 Jan 2026", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Savings" },
      { id: "32", merchantName: "Transfer to Savings", amount: -500.00, date: "2 Dec 2025", accountLabel: "Joint Account", accountOwner: "Alex & Sam", ownershipType: "joint", category: "Savings" },
    ],
    totals: {
      spendToDate: 1000.00,
      monthOverMonth: 0,
      transactionCount: 2,
    },
    insight: {
      headline: "Great Savings Progress",
      body: "You've saved £1,000 over the past two months. Keep up the consistent saving habit!",
      metrics: [
        { label: "This Month", value: "£500.00" },
        { label: "Last Month", value: "£500.00" },
        { label: "Savings Rate", value: "12% of income" },
      ],
    },
  },
];

export type OwnershipFilter = "all" | "individual" | "joint";

export default function Dashboard() {
  const [categories, setCategories] = useState<TransactionCategory[]>(mockCategories);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<string[]>([]);
  const [activeInsightCategoryId, setActiveInsightCategoryId] = useState<string | null>(null);
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>("current-and-previous");
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipFilter>("all");
  const { getFairnessStatus } = useFairness();

  const parseTransactionDate = (dateStr: string): Date => {
    const months: { [key: string]: number } = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const parts = dateStr.split(" ");
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);
    return new Date(year, month, day);
  };

  const isWithinTimeline = (transactionDate: Date, timeline: TimelineFilter): boolean => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    switch (timeline) {
      case "current-month": {
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      }
      case "previous-month": {
        const prevMonth = new Date(currentYear, currentMonth - 1);
        return transactionDate.getMonth() === prevMonth.getMonth() && 
               transactionDate.getFullYear() === prevMonth.getFullYear();
      }
      case "current-and-previous": {
        const prevMonth = new Date(currentYear, currentMonth - 1);
        return (
          (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) ||
          (transactionDate.getMonth() === prevMonth.getMonth() && transactionDate.getFullYear() === prevMonth.getFullYear())
        );
      }
      case "last-3-months": {
        const threeMonthsAgo = new Date(currentYear, currentMonth - 2, 1);
        return transactionDate >= threeMonthsAgo;
      }
      case "last-6-months": {
        const sixMonthsAgo = new Date(currentYear, currentMonth - 5, 1);
        return transactionDate >= sixMonthsAgo;
      }
      case "year-to-date": {
        const yearStart = new Date(currentYear, 0, 1);
        return transactionDate >= yearStart;
      }
      case "last-2-years": {
        const twoYearsAgo = new Date(currentYear - 2, currentMonth, 1);
        return transactionDate >= twoYearsAgo;
      }
      default:
        return true;
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.map((category) => {
      const filteredTransactions = category.transactions.filter((tx) => {
        const txDate = parseTransactionDate(tx.date);
        return isWithinTimeline(txDate, timelineFilter);
      });

      const total = filteredTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      
      return {
        ...category,
        transactions: filteredTransactions,
        totals: {
          ...category.totals,
          spendToDate: total,
          transactionCount: filteredTransactions.length,
        },
      };
    });
  }, [categories, timelineFilter]);

  const handleMoveTransactions = (transactionIds: string[], targetCategoryId: string) => {
    setCategories((prevCategories) => {
      const transactionsToMove: Transaction[] = [];
      
      const newCategories = prevCategories.map((category) => {
        if (category.id === targetCategoryId) {
          return category;
        }

        const remainingTransactions = category.transactions.filter((tx) => {
          if (transactionIds.includes(tx.id)) {
            const targetCat = prevCategories.find((c) => c.id === targetCategoryId);
            transactionsToMove.push({ ...tx, category: targetCat?.name || tx.category });
            return false;
          }
          return true;
        });

        const total = remainingTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
        const lastMonthTotal = category.totals.spendToDate / (1 + category.totals.monthOverMonth / 100);
        const newMonthOverMonth = lastMonthTotal > 0 ? ((total - lastMonthTotal) / lastMonthTotal) * 100 : 0;

        return {
          ...category,
          transactions: remainingTransactions,
          totals: {
            spendToDate: total,
            monthOverMonth: Number(newMonthOverMonth.toFixed(1)),
            transactionCount: remainingTransactions.length,
          },
        };
      });

      return newCategories.map((category) => {
        if (category.id === targetCategoryId) {
          const updatedTransactions = [...category.transactions, ...transactionsToMove];
          const total = updatedTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
          const lastMonthTotal = category.totals.spendToDate / (1 + category.totals.monthOverMonth / 100);
          const newMonthOverMonth = lastMonthTotal > 0 ? ((total - lastMonthTotal) / lastMonthTotal) * 100 : 0;

          return {
            ...category,
            transactions: updatedTransactions,
            totals: {
              spendToDate: total,
              monthOverMonth: Number(newMonthOverMonth.toFixed(1)),
              transactionCount: updatedTransactions.length,
            },
          };
        }
        return category;
      });
    });

    setSelectedTransactionIds([]);
  };

  const handleAddCategory = (categoryName: string) => {
    setCategories((prevCategories) => {
      let baseId = categoryName.toLowerCase().replace(/\s+/g, "-");
      let categoryId = baseId;
      let counter = 1;

      while (prevCategories.some((cat) => cat.id === categoryId)) {
        categoryId = `${baseId}-${counter}`;
        counter++;
      }

      const newCategory: TransactionCategory = {
        id: categoryId,
        name: categoryName,
        transactions: [],
        totals: {
          spendToDate: 0,
          monthOverMonth: 0,
          transactionCount: 0,
        },
      };

      return [...prevCategories, newCategory];
    });
  };

  const activeCategory = filteredCategories.find((c) => c.id === activeInsightCategoryId);

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
        activeGoals={4}
        pendingAlerts={6}
        fairnessStatus={getFairnessStatus()}
      />

      <TransactionGroups
        categories={filteredCategories}
        selectedTransactionIds={selectedTransactionIds}
        onSelectionChange={setSelectedTransactionIds}
        onMoveTransactions={handleMoveTransactions}
        onViewInsights={setActiveInsightCategoryId}
        onAddCategory={handleAddCategory}
        activeCategory={activeCategory}
        onCloseInsights={() => setActiveInsightCategoryId(null)}
        timelineFilter={timelineFilter}
        onTimelineFilterChange={setTimelineFilter}
        ownershipFilter={ownershipFilter}
        onOwnershipFilterChange={setOwnershipFilter}
      />
    </div>
  );
}

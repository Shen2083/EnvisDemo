import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TransactionItem } from "./TransactionItem";

interface Transaction {
  id: string;
  merchantName: string;
  amount: number;
  date: string;
  accountLabel: string;
  category: string;
}

interface TransactionFeedProps {
  transactions: Transaction[];
}

export function TransactionFeed({ transactions }: TransactionFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((tx) =>
    tx.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading">All Transactions</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-transactions"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No transactions found
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <TransactionItem key={tx.id} {...tx} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, TrendingUp, TrendingDown, Lightbulb, MoveRight } from "lucide-react";
import { CategoryInsightSheet } from "./CategoryInsightSheet";

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

interface TransactionGroupsProps {
  categories: TransactionCategory[];
  selectedTransactionIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onMoveTransactions: (transactionIds: string[], targetCategoryId: string) => void;
  onViewInsights: (categoryId: string) => void;
  activeCategory?: TransactionCategory;
  onCloseInsights: () => void;
}

export function TransactionGroups({
  categories,
  selectedTransactionIds,
  onSelectionChange,
  onMoveTransactions,
  onViewInsights,
  activeCategory,
  onCloseInsights,
}: TransactionGroupsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [moveToCategory, setMoveToCategory] = useState<string>("");

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      transactions: category.transactions.filter(
        (tx) =>
          tx.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.category.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.transactions.length > 0 || searchQuery === "");

  const handleToggleTransaction = (transactionId: string) => {
    if (selectedTransactionIds.includes(transactionId)) {
      onSelectionChange(selectedTransactionIds.filter((id) => id !== transactionId));
    } else {
      onSelectionChange([...selectedTransactionIds, transactionId]);
    }
  };

  const handleToggleCategory = (categoryTransactions: Transaction[]) => {
    const categoryTxIds = categoryTransactions.map((tx) => tx.id);
    const allSelected = categoryTxIds.every((id) => selectedTransactionIds.includes(id));

    if (allSelected) {
      onSelectionChange(selectedTransactionIds.filter((id) => !categoryTxIds.includes(id)));
    } else {
      const newSelected = Array.from(new Set([...selectedTransactionIds, ...categoryTxIds]));
      onSelectionChange(newSelected);
    }
  };

  const handleMoveClick = () => {
    if (moveToCategory && selectedTransactionIds.length > 0) {
      onMoveTransactions(selectedTransactionIds, moveToCategory);
      setMoveToCategory("");
    }
  };

  const formatAmount = (amount: number) => {
    const isPositive = amount >= 0;
    return `${isPositive ? "+" : ""}£${Math.abs(amount).toFixed(2)}`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Transaction Groups</CardTitle>
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
        <CardContent>
          {selectedTransactionIds.length > 0 && (
            <div className="mb-4 p-4 bg-accent/20 rounded-lg flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedTransactionIds.length} transaction{selectedTransactionIds.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-2 flex-1">
                <Select value={moveToCategory} onValueChange={setMoveToCategory}>
                  <SelectTrigger className="w-[200px]" data-testid="select-move-category">
                    <SelectValue placeholder="Move to category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id} data-testid={`option-category-${cat.id}`}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={handleMoveClick}
                  disabled={!moveToCategory}
                  data-testid="button-move-transactions"
                >
                  <MoveRight className="h-4 w-4 mr-2" />
                  Move
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSelectionChange([])}
                  data-testid="button-clear-selection"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          <Accordion type="multiple" className="w-full">
            {filteredCategories.map((category) => {
              const allSelected = category.transactions.every((tx) =>
                selectedTransactionIds.includes(tx.id)
              );
              const someSelected =
                category.transactions.some((tx) => selectedTransactionIds.includes(tx.id)) &&
                !allSelected;

              return (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="hover:no-underline" data-testid={`accordion-category-${category.id}`}>
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {category.totals.transactionCount} transaction
                          {category.totals.transactionCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        {category.insight && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewInsights(category.id);
                            }}
                            className="gap-2"
                            data-testid={`button-view-insights-${category.id}`}
                          >
                            <Lightbulb className="h-4 w-4" />
                            View Insights
                          </Button>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {formatAmount(-category.totals.spendToDate)}
                          </span>
                          {category.totals.monthOverMonth !== 0 && (
                            <div
                              className={`flex items-center gap-1 text-sm ${
                                category.totals.monthOverMonth > 0
                                  ? "text-destructive"
                                  : "text-green-600"
                              }`}
                            >
                              {category.totals.monthOverMonth > 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              <span>{Math.abs(category.totals.monthOverMonth)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox
                                checked={allSelected}
                                onCheckedChange={() => handleToggleCategory(category.transactions)}
                                aria-label="Select all transactions in category"
                                data-testid={`checkbox-select-all-${category.id}`}
                              />
                            </TableHead>
                            <TableHead>Merchant</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {category.transactions.map((tx) => (
                            <TableRow key={tx.id} data-testid={`row-transaction-${tx.id}`}>
                              <TableCell>
                                <Checkbox
                                  checked={selectedTransactionIds.includes(tx.id)}
                                  onCheckedChange={() => handleToggleTransaction(tx.id)}
                                  aria-label={`Select ${tx.merchantName}`}
                                  data-testid={`checkbox-transaction-${tx.id}`}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{tx.merchantName}</TableCell>
                              <TableCell>{tx.date}</TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {tx.accountLabel}
                              </TableCell>
                              <TableCell
                                className={`text-right font-medium ${
                                  tx.amount >= 0 ? "text-green-600" : ""
                                }`}
                              >
                                {formatAmount(tx.amount)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>

      <CategoryInsightSheet
        category={activeCategory}
        onClose={onCloseInsights}
      />
    </>
  );
}

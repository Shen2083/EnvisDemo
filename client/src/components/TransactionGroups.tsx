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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, TrendingUp, TrendingDown, Lightbulb, MoveRight, Plus, Calendar, Users } from "lucide-react";
import { CategoryInsightSheet } from "@/components/CategoryInsightSheet";
import type { TimelineFilter } from "@/pages/Dashboard";

interface Transaction {
  id: string;
  merchantName: string;
  amount: number;
  date: string;
  accountLabel: string;
  accountOwner: string;
  ownershipType: "individual" | "joint";
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

export type OwnershipFilter = "all" | "individual" | "joint";

interface TransactionGroupsProps {
  categories: TransactionCategory[];
  selectedTransactionIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onMoveTransactions: (transactionIds: string[], targetCategoryId: string) => void;
  onViewInsights: (categoryId: string) => void;
  onAddCategory: (categoryName: string) => void;
  activeCategory?: TransactionCategory;
  onCloseInsights: () => void;
  timelineFilter: TimelineFilter;
  onTimelineFilterChange: (filter: TimelineFilter) => void;
  ownershipFilter: OwnershipFilter;
  onOwnershipFilterChange: (filter: OwnershipFilter) => void;
}

export function TransactionGroups({
  categories,
  selectedTransactionIds,
  onSelectionChange,
  onMoveTransactions,
  onViewInsights,
  onAddCategory,
  activeCategory,
  onCloseInsights,
  timelineFilter,
  onTimelineFilterChange,
  ownershipFilter,
  onOwnershipFilterChange,
}: TransactionGroupsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [moveToCategory, setMoveToCategory] = useState<string>("");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      transactions: category.transactions.filter(
        (tx) => {
          const matchesSearch = 
            tx.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.category.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesOwnership = 
            ownershipFilter === "all" || tx.ownershipType === ownershipFilter;
          
          return matchesSearch && matchesOwnership;
        }
      ),
    }))
    .filter((category) => category.transactions.length > 0 || (searchQuery === "" && ownershipFilter === "all"));

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

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName("");
      setIsAddCategoryOpen(false);
    }
  };

  const formatAmount = (amount: number) => {
    if (amount < 0) {
      return `-£${Math.abs(amount).toFixed(2)}`;
    } else if (amount > 0) {
      return `+£${amount.toFixed(2)}`;
    }
    return `£${amount.toFixed(2)}`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="font-heading">Transaction Groups</CardTitle>
            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" data-testid="button-add-category">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="dialog-add-category">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>
                    Create a new category to organize your transactions.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="Category name (e.g., Healthcare, Pets, etc.)"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddCategory();
                      }
                    }}
                    data-testid="input-category-name"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddCategoryOpen(false);
                      setNewCategoryName("");
                    }}
                    data-testid="button-cancel-category"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddCategory}
                    disabled={!newCategoryName.trim()}
                    data-testid="button-save-category"
                  >
                    Add Category
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="relative flex-1 min-w-[200px]">
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
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={timelineFilter} onValueChange={onTimelineFilterChange}>
                <SelectTrigger className="w-[200px]" data-testid="select-timeline-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month" data-testid="option-timeline-current-month">
                    Current Month
                  </SelectItem>
                  <SelectItem value="previous-month" data-testid="option-timeline-previous-month">
                    Previous Month
                  </SelectItem>
                  <SelectItem value="current-and-previous" data-testid="option-timeline-current-and-previous">
                    Current + Previous Month
                  </SelectItem>
                  <SelectItem value="last-3-months" data-testid="option-timeline-last-3-months">
                    Last 3 Months
                  </SelectItem>
                  <SelectItem value="last-6-months" data-testid="option-timeline-last-6-months">
                    Last 6 Months
                  </SelectItem>
                  <SelectItem value="year-to-date" data-testid="option-timeline-year-to-date">
                    Year to Date
                  </SelectItem>
                  <SelectItem value="last-2-years" data-testid="option-timeline-last-2-years">
                    Last 2 Years
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Select value={ownershipFilter} onValueChange={onOwnershipFilterChange}>
                <SelectTrigger className="w-[180px]" data-testid="select-ownership-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" data-testid="option-ownership-all">
                    All Accounts
                  </SelectItem>
                  <SelectItem value="individual" data-testid="option-ownership-individual">
                    Individual Only
                  </SelectItem>
                  <SelectItem value="joint" data-testid="option-ownership-joint">
                    Joint Only
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 w-full pr-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {category.totals.transactionCount} transaction
                          {category.totals.transactionCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="min-w-[140px]">
                        {category.insight ? (
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
                        ) : (
                          <div className="h-9" />
                        )}
                      </div>
                      <span className={`font-semibold min-w-[100px] text-right ${
                        category.id === "income" ? "text-green-600" : ""
                      }`}>
                        {formatAmount(category.id === "income" 
                          ? category.totals.spendToDate
                          : -category.totals.spendToDate
                        )}
                      </span>
                      <div className="min-w-[70px] text-right">
                        {category.totals.monthOverMonth !== 0 && (
                          <div
                            className={`flex items-center justify-end gap-1 text-sm ${
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
                            <TableHead>Owner</TableHead>
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
                              <TableCell className="text-sm">
                                <div className="flex items-center gap-2">
                                  <span>{tx.accountOwner}</span>
                                  {tx.ownershipType === "joint" && (
                                    <span className="text-xs text-muted-foreground">(Joint)</span>
                                  )}
                                </div>
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

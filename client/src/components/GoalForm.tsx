import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";

interface GoalFormProps {
  onSubmit: (goal: {
    name: string;
    targetAmount: number;
    targetDate: string;
    linkedAccounts: string[];
  }) => void;
  onCancel: () => void;
  availableAccounts: { id: string; name: string }[];
}

export function GoalForm({ onSubmit, onCancel, availableAccounts }: GoalFormProps) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [linkedAccounts, setLinkedAccounts] = useState<string[]>([]);
  const [monthlyContribution, setMonthlyContribution] = useState<number | null>(null);

  useEffect(() => {
    if (targetAmount && targetDate) {
      const amount = parseFloat(targetAmount);
      const target = new Date(targetDate);
      const today = new Date();
      const monthsRemaining = Math.max(
        1,
        Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30))
      );
      setMonthlyContribution(Math.ceil(amount / monthsRemaining));
    } else {
      setMonthlyContribution(null);
    }
  }, [targetAmount, targetDate]);

  const handleAccountToggle = (accountId: string) => {
    setLinkedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      targetAmount: parseFloat(targetAmount),
      targetDate,
      linkedAccounts,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Create a New Goal</CardTitle>
          <CardDescription>
            Set a savings goal for your family to work towards together
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., House Deposit, Family Holiday"
                required
                data-testid="input-goal-name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount (£)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="20000"
                  required
                  data-testid="input-target-amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  required
                  data-testid="input-target-date"
                />
              </div>
            </div>

            {monthlyContribution !== null && (
              <div className="p-4 bg-chart-2/10 border border-chart-2/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-chart-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium mb-1">Required Monthly Contribution</div>
                    <div className="text-2xl font-bold tabular-nums text-chart-2">
                      £{monthlyContribution.toLocaleString("en-GB")}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      You'll need to save this amount each month to reach your goal
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Label>Link Accounts to this Goal</Label>
              <div className="space-y-2">
                {availableAccounts.map((account) => (
                  <div key={account.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Checkbox
                      id={`account-${account.id}`}
                      checked={linkedAccounts.includes(account.id)}
                      onCheckedChange={() => handleAccountToggle(account.id)}
                      data-testid={`checkbox-link-${account.id}`}
                    />
                    <label
                      htmlFor={`account-${account.id}`}
                      className="flex-1 cursor-pointer font-medium"
                    >
                      {account.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
                data-testid="button-cancel-goal"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" data-testid="button-save-goal">
                Create Goal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

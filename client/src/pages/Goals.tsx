import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GoalCard } from "@/components/GoalCard";
import { GoalForm } from "@/components/GoalForm";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// TODO: remove mock data - replace with real API data
const mockAccounts = [
  { id: "joint", name: "Joint Savings" },
  { id: "personal", name: "Shen's ISA" },
  { id: "savings", name: "Personal Savings" },
];

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  linkedAccounts: string[];
}

export default function Goals() {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);
  // TODO: remove mock data - replace with real API data
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      name: "House Deposit",
      targetAmount: 20000,
      currentAmount: 5500,
      targetDate: "Oct 2028",
      linkedAccounts: ["joint", "personal"],
    },
    {
      id: "2",
      name: "Family Holiday",
      targetAmount: 5000,
      currentAmount: 2800,
      targetDate: "Jul 2026",
      linkedAccounts: ["joint"],
    },
  ]);

  const handleCreateGoal = (goalData: {
    name: string;
    targetAmount: number;
    targetDate: string;
    linkedAccounts: string[];
  }) => {
    if (editingGoal) {
      // Update existing goal
      setGoals(goals.map(g => 
        g.id === editingGoal.id 
          ? {
              ...g,
              ...goalData,
              targetDate: new Date(goalData.targetDate).toLocaleDateString("en-GB", {
                month: "short",
                year: "numeric",
              }),
            }
          : g
      ));
      console.log("Goal updated:", editingGoal.id);
    } else {
      // Create new goal
      const newGoal: Goal = {
        id: String(goals.length + 1),
        ...goalData,
        currentAmount: 0,
        targetDate: new Date(goalData.targetDate).toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        }),
      };
      setGoals([...goals, newGoal]);
      console.log("Goal created:", newGoal);
    }
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDeleteGoal = () => {
    if (deletingGoalId) {
      setGoals(goals.filter(g => g.id !== deletingGoalId));
      console.log("Goal deleted:", deletingGoalId);
      setDeletingGoalId(null);
    }
  };

  if (showForm) {
    return (
      <GoalForm
        onSubmit={handleCreateGoal}
        onCancel={() => {
          setShowForm(false);
          setEditingGoal(null);
        }}
        availableAccounts={mockAccounts}
        initialData={editingGoal ? {
          name: editingGoal.name,
          targetAmount: editingGoal.targetAmount.toString(),
          targetDate: editingGoal.targetDate,
          linkedAccounts: editingGoal.linkedAccounts,
        } : undefined}
      />
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Family Goals</h1>
          <p className="text-muted-foreground">
            Track your savings goals and progress together
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} data-testid="button-add-goal">
          <Plus className="h-4 w-4 mr-2" />
          Add a New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-muted-foreground mb-4">
            No goals yet. Create your first family savings goal!
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              {...goal}
              onEdit={() => handleEditGoal(goal)}
              onDelete={() => setDeletingGoalId(goal.id)}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!deletingGoalId} onOpenChange={(open) => !open && setDeletingGoalId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGoal} data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

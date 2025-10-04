import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MessageCircle,
  TrendingUp,
  Calendar,
  Target,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

interface PathwayStep {
  id: string;
  step: string;
  description: string;
  completed: boolean;
}

export default function Coaching() {
  const [pathwaySteps, setPathwaySteps] = useState<PathwayStep[]>([
    {
      id: "1",
      step: "This week: Review your eating out spending",
      description: "Look at your last few restaurant and takeaway purchases. Which ones brought the most value to your family time together?",
      completed: false,
    },
    {
      id: "2",
      step: "Next payday: Move £68 to your House Deposit",
      description: "This is the amount you spent above your usual eating out average. Even £50 would make a difference.",
      completed: false,
    },
    {
      id: "3",
      step: "By end of month: Plan one special meal at home",
      description: "Cook something you'd normally order out. Many families find this creates better memories than restaurant visits.",
      completed: false,
    },
    {
      id: "4",
      step: "Ongoing: Keep your grocery spending steady",
      description: "You've maintained £420/month consistently for three months. That's excellent budgeting - don't change what's working.",
      completed: false,
    },
  ]);

  const [goals] = useState<Goal[]>([
    {
      id: "1",
      name: "House Deposit",
      targetAmount: 20000,
      currentAmount: 5500,
      targetDate: "Oct 2028",
    },
  ]);

  const primaryGoal = goals[0];

  const toggleStep = (stepId: string) => {
    setPathwaySteps(
      pathwaySteps.map((step) =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      )
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-heading font-bold mb-2">Financial Coach</h1>
        <p className="text-muted-foreground">
          Your guide to achieving your family's financial goals
        </p>
      </div>

      <Card className="bg-primary/5" data-testid="card-coach-greeting">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-base leading-relaxed">
                Hi Alex and Sam, I've been looking at your finances over the past few months, and I wanted to share what I'm seeing.
              </p>
              <p className="text-base leading-relaxed">
                Your income has been beautifully steady at <span className="font-semibold">£2,500 per month</span> for the last three months. That consistency is your foundation - it means we can make realistic plans together.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-coach-insight">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-chart-3/10">
              <Lightbulb className="w-6 h-6 text-chart-3" />
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-base leading-relaxed">
                This month, you've spent <span className="font-semibold">£1,818</span> compared to your usual <span className="font-semibold">£1,750</span>. The difference? An extra <span className="font-semibold">£68 on eating out</span> - bringing that category to £280 instead of your typical £212.
              </p>
              <p className="text-base leading-relaxed">
                Here's what caught my attention: your grocery spending has stayed rock-solid at £420 for three straight months. You're great at maintaining that budget. The eating out variance tells me you might have had some celebrations or busy weeks - that's completely normal for families.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground italic">
                Before we talk about your House Deposit goal, I'm curious: how did those extra restaurant meals feel? Were they worth it for your family?
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-goal-connection">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Connecting This to Your {primaryGoal.name} Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-base leading-relaxed">
              You're currently putting <span className="font-semibold">£500 per month</span> toward your house deposit. You've already saved <span className="font-semibold">{formatCurrency(primaryGoal.currentAmount)}</span> of your <span className="font-semibold">{formatCurrency(primaryGoal.targetAmount)}</span> target.
            </p>
            <p className="text-base leading-relaxed">
              After your monthly bills and spending, you have about <span className="font-semibold">£682 available</span>. If you brought eating out back to your usual level, that £68 could go toward your deposit instead - making it <span className="font-semibold">£568 per month</span>.
            </p>
            
            <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/20">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-chart-3 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-semibold text-chart-3">What this could mean:</p>
                  <p className="text-sm leading-relaxed">
                    At £568/month, you'd reach your deposit goal by <span className="font-semibold">December 2027</span> instead of October 2028 - that's <span className="font-semibold">11 months earlier</span>. You'd be looking at houses nearly a year sooner.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground italic">
              Of course, this isn't about being perfect every month. Life happens. But what feels doable for you?
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50" data-testid="card-pathway">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>A Pathway to Consider</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Here's a step-by-step approach you could try. Mark each step as you complete it - this is just for your own tracking.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {pathwaySteps.map((step) => (
            <div
              key={step.id}
              className="flex items-start gap-3 p-4 rounded-lg bg-background border hover-elevate"
              data-testid={`pathway-step-${step.id}`}
            >
              <Checkbox
                id={step.id}
                checked={step.completed}
                onCheckedChange={() => toggleStep(step.id)}
                className="mt-1"
                data-testid={`checkbox-step-${step.id}`}
              />
              <div className="flex-1">
                <label
                  htmlFor={step.id}
                  className={`font-medium cursor-pointer block mb-1 ${
                    step.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {step.step}
                </label>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card data-testid="card-alternative-path">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            Not Sure About This Path?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-base leading-relaxed">
            There are always other ways to approach your goals. Here are some alternatives worth considering:
          </p>
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-muted">
              <p className="font-medium mb-1">Keep eating out steady, optimize elsewhere</p>
              <p className="text-sm text-muted-foreground">
                If those meals are important family time, look at your £275 shopping category or £95 entertainment spending instead.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="font-medium mb-1">Smaller adjustment, longer timeline</p>
              <p className="text-sm text-muted-foreground">
                Even cutting eating out by £30 (not the full £68) would get you to your goal 5 months earlier - that's still meaningful progress.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="font-medium mb-1">Income opportunity focus</p>
              <p className="text-sm text-muted-foreground">
                Your steady income is great, but have you explored freelance work, salary negotiation, or side projects that could add even £100/month?
              </p>
            </div>
          </div>
          <div className="pt-3 border-t">
            <p className="text-sm text-muted-foreground italic">
              The best financial plan is one you'll actually stick to. What resonates most with how your family wants to live?
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-base leading-relaxed">
                Remember: this isn't about cutting back on joy. It's about making sure every pound you spend or save is moving you toward the life you want.
              </p>
              <p className="text-base leading-relaxed">
                Your groceries show you can budget when it matters. Your steady income gives you options. You're in a strong position - we're just fine-tuning.
              </p>
              <Badge variant="secondary" className="mt-2">
                Next review: When you get your October payday
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Target,
  Send,
  MessageCircle,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  insight: string;
  pathwaySteps: PathwayStep[];
}

interface PathwayStep {
  id: string;
  step: string;
  description: string;
  completed: boolean;
}

interface ChatMessage {
  id: string;
  role: "coach" | "user";
  message: string;
  timestamp: Date;
}

export default function Coaching() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "house-deposit",
      name: "House Deposit",
      targetAmount: 20000,
      currentAmount: 5500,
      targetDate: "Oct 2028",
      insight: "You could reach this 11 months early by optimizing eating out spending",
      pathwaySteps: [
        {
          id: "1",
          step: "This week: Review your eating out spending",
          description: "Look at your last few restaurant purchases. Which ones brought the most value?",
          completed: false,
        },
        {
          id: "2",
          step: "Next payday: Move £68 to your deposit",
          description: "This is the amount you spent above your usual eating out average.",
          completed: false,
        },
        {
          id: "3",
          step: "By end of month: Plan one special meal at home",
          description: "Many families find this creates better memories than restaurant visits.",
          completed: false,
        },
        {
          id: "4",
          step: "Ongoing: Keep your grocery spending steady",
          description: "You've maintained £420/month for three months - that's excellent.",
          completed: false,
        },
      ],
    },
    {
      id: "family-holiday",
      name: "Family Holiday",
      targetAmount: 5000,
      currentAmount: 2800,
      targetDate: "Jul 2026",
      insight: "On track to reach this goal 3 months ahead of schedule with current savings",
      pathwaySteps: [
        {
          id: "1",
          step: "This month: Maintain £200/month contribution",
          description: "Your current savings rate is working well for this timeline.",
          completed: false,
        },
        {
          id: "2",
          step: "Consider: Early booking discounts",
          description: "Booking 6 months ahead could save 15-20% on accommodation.",
          completed: false,
        },
      ],
    },
    {
      id: "emergency-fund",
      name: "Emergency Fund",
      targetAmount: 9000,
      currentAmount: 2400,
      targetDate: "Dec 2026",
      insight: "Critical: Recent low balance alert shows why this fund is essential - you need £700 buffer",
      pathwaySteps: [
        {
          id: "1",
          step: "Urgent: Move £700 from savings to cover mortgage",
          description: "Your mortgage payment is due in 3 days and your balance is £700 short.",
          completed: false,
        },
        {
          id: "2",
          step: "This month: Set up automatic £300/month transfer",
          description: "Build your emergency fund to prevent future cashflow issues.",
          completed: false,
        },
        {
          id: "3",
          step: "Review: Check your streaming subscriptions",
          description: "The £35/month from consolidating Netflix, Disney+, and Prime could go here.",
          completed: false,
        },
        {
          id: "4",
          step: "Goal: Reach 3 months of expenses",
          description: "£9,000 covers your essential costs and prevents stress from unexpected bills.",
          completed: false,
        },
      ],
    },
    {
      id: "kids-education",
      name: "Kids Education Fund",
      targetAmount: 15000,
      currentAmount: 3200,
      targetDate: "Sep 2030",
      insight: "Starting early gives you compound growth - you're ahead by beginning now",
      pathwaySteps: [
        {
          id: "1",
          step: "This month: Continue £150/month contribution",
          description: "Your current pace puts you on track for the 2030 target.",
          completed: false,
        },
        {
          id: "2",
          step: "Consider: Junior ISA for tax-free growth",
          description: "Could boost your savings by £200-300/year through tax-free returns.",
          completed: false,
        },
        {
          id: "3",
          step: "Future: Increase by 5% annually",
          description: "As your income grows, gradually increase contributions to match inflation.",
          completed: false,
        },
      ],
    },
  ]);

  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "coach",
      message: "Hi Alex and Sam! I've reviewed your finances and have some insights about your goals. Click on a goal to see specific recommendations, or ask me anything.",
      timestamp: new Date(),
    },
  ]);
  const [userInput, setUserInput] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toggleStep = (goalId: string, stepId: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              pathwaySteps: goal.pathwaySteps.map((step) =>
                step.id === stepId ? { ...step, completed: !step.completed } : step
              ),
            }
          : goal
      )
    );
  };

  const handleSendMessage = (messageOverride?: string) => {
    const messageToSend = messageOverride || userInput;
    if (!messageToSend.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      message: messageToSend,
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, userMessage]);
    setUserInput("");

    setTimeout(() => {
      const coachResponse = getCoachResponse(messageToSend.toLowerCase(), activeGoalId);
      const coachMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "coach",
        message: coachResponse,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, coachMessage]);
    }, 500);
  };

  const getCoachResponse = (input: string, goalId: string | null): string => {
    const houseDepositResponses: Record<string, string> = {
      "eating out": "I noticed you spent £68 more than usual this month on eating out - bringing it to £280 instead of your typical £212. Your grocery spending has stayed rock-solid at £420 for three months, so that's the category with the most flexibility right now.",
      "timeline": "At your current £500/month allocation, you'll reach your house deposit goal in October 2028. But if you redirected that £68 from eating out, you'd be allocating £568/month and could reach it by December 2027 - that's 11 months earlier!",
      "why": "The eating out category stood out because it's the only one that varied this month. Your bills are fixed, groceries are consistent, and you're already doing great with those. This is just the easiest adjustment to make.",
      "how": "Start small - maybe track your restaurant spending for a week to see which meals felt most valuable. Then decide if you want to cook more at home or just be more selective about where you eat out.",
      "alternative": "Absolutely! You could also look at your £275 shopping category or find ways to increase your income. The eating out suggestion is just one option - whatever feels sustainable for your family is the right choice.",
    };

    const holidayResponses: Record<string, string> = {
      "timeline": "You're doing brilliantly with this goal! At your current £200/month savings rate, you'll reach your £5,000 target 3 months early - that's ahead of your July 2026 target date. If you wanted to get there even faster, adding £50/month would get you there 5 months sooner.",
      "booking": "Great question! Booking early can save you 15-20% on accommodation costs. If you know roughly when and where you want to go, I'd suggest starting to look about 6 months before your trip to get the best deals.",
      "save": "Great question! Booking early can save you 15-20% on accommodation costs. If you know roughly when and where you want to go, I'd suggest starting to look about 6 months before your trip to get the best deals.",
      "increase": "You're already on track to reach this £5,000 goal 3 months early! But if you wanted to accelerate even more, adding just £50/month to your current £200 would mean you could book 5 months sooner. That might give you better choices for accommodation and timing.",
      "contributions": "You're already on track to reach this £5,000 goal 3 months early! But if you wanted to accelerate even more, adding just £50/month to your current £200 would mean you could book 5 months sooner. That might give you better choices for accommodation and timing.",
    };

    const emergencyResponses: Record<string, string> = {
      "cashflow": "This connects directly to your recent low balance alert! Your mortgage payment is due in 3 days, but your balance is £700 short. An emergency fund would prevent this stress - that's exactly why this goal is critical.",
      "alert": "This connects directly to your recent low balance alert! Your mortgage payment is due in 3 days, but your balance is £700 short. An emergency fund would prevent this stress - that's exactly why this goal is critical.",
      "subscription": "Great connection! The £35/month you'd save by consolidating your streaming services (Netflix, Disney+, Prime) could go straight into building this fund. In just 6 months, that's £210 of your emergency buffer sorted.",
      "streaming": "Great connection! The £35/month you'd save by consolidating your streaming services (Netflix, Disney+, Prime) could go straight into building this fund. In just 6 months, that's £210 of your emergency buffer sorted.",
      "how": "Start with the urgent £700 transfer to cover your mortgage, then set up automatic £300/month contributions. The insights show you can find £35/month from subscriptions - every bit helps build your safety net.",
      "build": "Start with the urgent £700 transfer to cover your mortgage, then set up automatic £300/month contributions. The insights show you can find £35/month from subscriptions - every bit helps build your safety net.",
    };

    const educationResponses: Record<string, string> = {
      "timeline": "You're on track! At £150/month, you'll reach £15,000 by September 2030 when it's needed. The earlier you start, the more compound growth helps - you're already ahead by beginning now.",
      "junior": "A Junior ISA could boost your returns by £200-300/year through tax-free growth. You can contribute up to £9,000/year, and your current £150/month (£1,800/year) fits well within that limit.",
      "isa": "A Junior ISA could boost your returns by £200-300/year through tax-free growth. You can contribute up to £9,000/year, and your current £150/month (£1,800/year) fits well within that limit.",
      "increase": "Smart thinking! As your income grows, try increasing contributions by 5% annually to stay ahead of inflation. Even small increases compound significantly over 6 years.",
      "grow": "Smart thinking! As your income grows, try increasing contributions by 5% annually to stay ahead of inflation. Even small increases compound significantly over 6 years.",
    };

    if (goalId === "house-deposit") {
      for (const [keyword, response] of Object.entries(houseDepositResponses)) {
        if (input.includes(keyword)) return response;
      }
    } else if (goalId === "family-holiday") {
      for (const [keyword, response] of Object.entries(holidayResponses)) {
        if (input.includes(keyword)) return response;
      }
    } else if (goalId === "emergency-fund") {
      for (const [keyword, response] of Object.entries(emergencyResponses)) {
        if (input.includes(keyword)) return response;
      }
    } else if (goalId === "kids-education") {
      for (const [keyword, response] of Object.entries(educationResponses)) {
        if (input.includes(keyword)) return response;
      }
    }

    if (input.includes("help") || input.includes("?")) {
      return "I'm here to help! Try asking about specific topics like 'Why eating out?' or 'What about the timeline?' You can also expand a goal card to see detailed recommendations.";
    }

    return "That's a great question! Could you tell me more about what you'd like to know? You can ask about spending patterns, timelines, or specific recommendations.";
  };

  const handleQuickReply = (message: string) => {
    handleSendMessage(message);
  };

  const handleAccordionChange = (value: string) => {
    setActiveGoalId(value || null);
    
    if (value) {
      const goal = goals.find((g) => g.id === value);
      if (goal) {
        const contextMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "coach",
          message: `I see you're looking at your ${goal.name} goal. ${goal.insight}. Feel free to ask me anything about this!`,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, contextMessage]);
      }
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold mb-2">Financial Coach</h1>
        <p className="text-muted-foreground">
          Your guide to achieving your family's financial goals
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-4" data-testid="goal-cards-section">
          <Accordion
            type="single"
            collapsible
            value={activeGoalId || undefined}
            onValueChange={handleAccordionChange}
          >
            {goals.map((goal) => {
              const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
              
              return (
                <AccordionItem key={goal.id} value={goal.id} className="mb-4">
                  <Card>
                    <AccordionTrigger className="px-6 py-4 hover:no-underline" data-testid={`goal-card-${goal.id}`}>
                      <div className="flex items-start gap-4 flex-1 text-left">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <CardTitle className="text-lg mb-1">{goal.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{goal.insight}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">
                                {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                              </span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CardContent className="pt-4">
                        <div className="space-y-4">
                          <div className="flex items-start gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-chart-3 mt-0.5" />
                            <div>
                              <p className="font-semibold text-chart-3 mb-1">Recommended Pathway</p>
                              <p className="text-sm text-muted-foreground">
                                Follow these steps to reach your goal faster. Check them off as you complete each one.
                              </p>
                            </div>
                          </div>

                          {goal.pathwaySteps.map((step) => (
                            <div
                              key={step.id}
                              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover-elevate"
                              data-testid={`pathway-step-${goal.id}-${step.id}`}
                            >
                              <Checkbox
                                id={`${goal.id}-${step.id}`}
                                checked={step.completed}
                                onCheckedChange={() => toggleStep(goal.id, step.id)}
                                className="mt-1"
                                data-testid={`checkbox-${goal.id}-${step.id}`}
                              />
                              <div className="flex-1">
                                <label
                                  htmlFor={`${goal.id}-${step.id}`}
                                  className={`font-medium cursor-pointer block mb-1 ${
                                    step.completed ? "line-through text-muted-foreground" : ""
                                  }`}
                                >
                                  {step.step}
                                </label>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start" data-testid="chat-section">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Chat with Your Coach</CardTitle>
                  <p className="text-sm text-muted-foreground">Ask me anything about your goals</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`chat-message-${msg.role}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              ))}

              {activeGoalId && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {activeGoalId === "house-deposit" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply("Why eating out specifically?")}
                        data-testid="quick-reply-eating-out"
                      >
                        Why eating out?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply("What about the timeline?")}
                        data-testid="quick-reply-timeline"
                      >
                        Timeline details?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply("Any alternatives?")}
                        data-testid="quick-reply-alternatives"
                      >
                        Alternatives?
                      </Button>
                    </>
                  )}
                  {activeGoalId === "family-holiday" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply("Tell me about the timeline")}
                        data-testid="quick-reply-holiday-timeline"
                      >
                        Timeline?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply("How can I save on booking?")}
                        data-testid="quick-reply-booking"
                      >
                        Booking tips?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply("Should I increase contributions?")}
                        data-testid="quick-reply-contributions"
                      >
                        Increase savings?
                      </Button>
                    </>
                  )}
                  {activeGoalId === "emergency-fund" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply("How does this connect to the cashflow alert?")}
                        data-testid="quick-reply-cashflow"
                      >
                        Cashflow alert?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply("Can I use the subscription savings?")}
                        data-testid="quick-reply-subscriptions"
                      >
                        Use subscription savings?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply("How should I build this?")}
                        data-testid="quick-reply-build"
                      >
                        How to build?
                      </Button>
                    </>
                  )}
                  {activeGoalId === "kids-education" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply("What about the timeline?")}
                        data-testid="quick-reply-education-timeline"
                      >
                        Timeline?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply("Tell me about Junior ISA")}
                        data-testid="quick-reply-junior-isa"
                      >
                        Junior ISA?
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply("Should I increase over time?")}
                        data-testid="quick-reply-increase"
                      >
                        Increase contributions?
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask me about your goals..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="resize-none min-h-[44px] max-h-[120px]"
                  rows={1}
                  data-testid="chat-input"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  size="icon"
                  data-testid="button-send-message"
                  disabled={!userInput.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

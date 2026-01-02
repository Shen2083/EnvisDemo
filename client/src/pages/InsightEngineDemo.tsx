import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Wallet,
  Heart,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowDown,
  Sparkles,
  TrendingDown
} from "lucide-react";

interface CoachState {
  spendingStatus: string;
  detectedMood: string;
  stressLevel: "Low" | "Medium" | "High";
  overspendAmount: number;
  category: string;
}

export default function InsightEngineDemo() {
  const [isLowStress, setIsLowStress] = useState(false);

  const highStressState: CoachState = {
    spendingStatus: "Over Budget",
    detectedMood: "Anxious",
    stressLevel: "High",
    overspendAmount: 45,
    category: "Dining Out",
  };

  const lowStressState: CoachState = {
    spendingStatus: "Over Budget",
    detectedMood: "Neutral",
    stressLevel: "Low",
    overspendAmount: 45,
    category: "Dining Out",
  };

  const currentState = isLowStress ? lowStressState : highStressState;

  const supportiveMessage = "We know managing family finances is tough. You've had a spike in dining costs—shall we adjust your holiday goal slightly to keep you on track?";
  
  const directMessage = "Heads up: You've exceeded your dining budget by £45. Tap to view transactions.";

  const getMessage = () => isLowStress ? directMessage : supportiveMessage;
  const getMessageMode = () => isLowStress ? "Direct" : "Supportive";

  const getStressColor = (level: string) => {
    switch (level) {
      case "High": return "bg-amber-500 text-white";
      case "Medium": return "bg-yellow-400 text-yellow-900";
      case "Low": return "bg-emerald-500 text-white";
      default: return "bg-gray-400";
    }
  };

  const getStressBorderColor = (level: string) => {
    switch (level) {
      case "High": return "border-amber-300 bg-amber-50/50 dark:bg-amber-950/20";
      case "Medium": return "border-yellow-300 bg-yellow-50/50 dark:bg-yellow-950/20";
      case "Low": return "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20";
      default: return "border-gray-300 bg-gray-50/50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Smart Financial Coach</h1>
          </div>
          <p className="text-muted-foreground">
            AI-powered coaching that adapts to your emotional state
          </p>
        </div>

        <Card className="border-2 border-primary/20 shadow-lg" data-testid="card-analysis-layer">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              The Analysis Layer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold">
                1
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Financial Check</span>
                </div>
                <p className="text-sm text-muted-foreground">Analyzing spending patterns</p>
              </div>
              <Badge className="bg-red-500 hover:bg-red-500 text-white">
                <TrendingDown className="w-3 h-3 mr-1" />
                Overspent by £{currentState.overspendAmount}
              </Badge>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 font-bold">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Emotional Check</span>
                </div>
                <p className="text-sm text-muted-foreground">Reading emotional context</p>
              </div>
              <Badge className={isLowStress ? "bg-emerald-500 hover:bg-emerald-500 text-white" : "bg-amber-500 hover:bg-amber-500 text-white"}>
                {isLowStress ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    User seems calm
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    User seems anxious
                  </>
                )}
              </Badge>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-card border">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-bold">
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Risk Assessment</span>
                </div>
                <p className="text-sm text-muted-foreground">Calculating notification approach</p>
              </div>
            </div>

            <div className={`p-6 rounded-xl border-2 transition-all duration-500 ${getStressBorderColor(currentState.stressLevel)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentState.stressLevel === "High" ? (
                    <AlertTriangle className="w-7 h-7 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  )}
                  <div>
                    <p className="font-semibold text-lg text-foreground">Financial Stress Risk</p>
                    <p className="text-sm text-muted-foreground">Combined analysis result</p>
                  </div>
                </div>
                <Badge className={`text-lg px-4 py-2 ${getStressColor(currentState.stressLevel)}`}>
                  {currentState.stressLevel}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <ArrowDown className="w-6 h-6 text-muted-foreground animate-bounce" />
        </div>

        <Card 
          className={`border-2 shadow-lg transition-all duration-500 ${
            isLowStress 
              ? "bg-[#E6F3FF]/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" 
              : "bg-[#FFD8B1]/30 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
          }`}
          data-testid="card-notification-result"
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="w-5 h-5 text-primary" />
              The Result
              <Badge 
                className={`ml-2 ${isLowStress ? "bg-blue-500 hover:bg-blue-500" : "bg-amber-500 hover:bg-amber-500"} text-white`}
              >
                {getMessageMode()} Mode
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className={`p-6 rounded-xl transition-all duration-500 ${
                isLowStress 
                  ? "bg-[#E6F3FF] dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700" 
                  : "bg-[#FFD8B1]/70 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-700"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full shrink-0 ${isLowStress ? "bg-blue-100 dark:bg-blue-800" : "bg-orange-100 dark:bg-orange-800"}`}>
                  {isLowStress ? (
                    <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  ) : (
                    <Heart className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground mb-2">
                    {isLowStress ? "Budget Alert" : "A Gentle Nudge"}
                  </p>
                  <p className="text-foreground/90 leading-relaxed">
                    {getMessage()}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    data-testid="button-view-transactions"
                  >
                    View Transactions
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                Why This Tone?
              </p>
              <p className="text-sm text-muted-foreground">
                {isLowStress 
                  ? "Low stress detected. The user is emotionally stable, so we can deliver a direct, actionable message without causing anxiety."
                  : "High stress detected. The user may be worried about finances, so we use warm, supportive language to encourage action without adding pressure."
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            variant={isLowStress ? "default" : "outline"}
            onClick={() => setIsLowStress(!isLowStress)}
            className="gap-2"
            data-testid="button-toggle-stress"
          >
            {isLowStress ? (
              <>
                <AlertTriangle className="w-4 h-4" />
                Simulate High Stress
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Simulate Low Stress
              </>
            )}
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>Envis Smart Coach v1.0 - Emotionally Aware Financial Guidance</p>
        </div>
      </div>
    </div>
  );
}

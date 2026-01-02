import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Zap, 
  MessageSquareHeart, 
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Heart,
  Target
} from "lucide-react";

interface InsightState {
  detectedEmotion: string;
  shameRiskScore: number;
  shameRiskLevel: "Low" | "Medium" | "High";
  statedGoal: string;
  overspendAmount: number;
  category: string;
}

export default function InsightEngineDemo() {
  const [isLowDistress, setIsLowDistress] = useState(false);

  const highDistressState: InsightState = {
    detectedEmotion: "Anxiety",
    shameRiskScore: 0.82,
    shameRiskLevel: "High",
    statedGoal: "Save for Holiday",
    overspendAmount: 45,
    category: "Dining Out",
  };

  const lowDistressState: InsightState = {
    detectedEmotion: "Neutral",
    shameRiskScore: 0.12,
    shameRiskLevel: "Low",
    statedGoal: "Save for Holiday",
    overspendAmount: 45,
    category: "Dining Out",
  };

  const currentState = isLowDistress ? lowDistressState : highDistressState;

  const supportiveMessage = "Managing family finances is hard, and you're doing better than you think. We noticed a jump in dining spend—shall we adjust the holiday goal slightly to keep you on track?";
  
  const directMessage = "Heads up: You've exceeded your dining budget by £45 this week. Check your transactions here.";

  const getMessage = () => isLowDistress ? directMessage : supportiveMessage;
  const getFraming = () => isLowDistress ? "Direct" : "Supportive";

  const getShameRiskColor = (level: string) => {
    switch (level) {
      case "High": return "bg-amber-500 text-white";
      case "Medium": return "bg-yellow-400 text-yellow-900";
      case "Low": return "bg-emerald-500 text-white";
      default: return "bg-gray-400";
    }
  };

  const getShameRiskBgColor = (level: string) => {
    switch (level) {
      case "High": return "bg-amber-50 border-amber-200";
      case "Medium": return "bg-yellow-50 border-yellow-200";
      case "Low": return "bg-emerald-50 border-emerald-200";
      default: return "bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Insight Engine Demo</h1>
          </div>
          <p className="text-muted-foreground">
            Demonstrating shame-aware AI notification framing
          </p>
        </div>

        <Card className="border-2 border-primary/20 shadow-lg" data-testid="card-insight-brain">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              The Insight Engine - Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">Transaction Encoder</span>
                    <Badge variant="secondary" className="text-xs">Complete</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Spending Spike Detected: +£{currentState.overspendAmount} in {currentState.category}</p>
                  <Progress value={100} className="h-1.5 mt-2" />
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-purple-50/80 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                  <MessageSquareHeart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">Text Encoder</span>
                    <Badge variant="secondary" className="text-xs">Complete</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    User expressed <span className="font-medium">{currentState.detectedEmotion}</span> in last journal entry
                  </p>
                  <Progress value={100} className="h-1.5 mt-2" />
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900">
                <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">Cross-Modal Fusion</span>
                    <Badge variant="secondary" className="text-xs">Complete</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Discrepancy found: Goal ("{currentState.statedGoal}") vs. Action (overspend)
                  </p>
                  <Progress value={100} className="h-1.5 mt-2" />
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-xl border-2 ${getShameRiskBgColor(currentState.shameRiskLevel)} transition-all duration-500`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentState.shameRiskLevel === "High" ? (
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  )}
                  <div>
                    <p className="font-semibold text-foreground">Shame-Risk Prediction</p>
                    <p className="text-sm text-muted-foreground">Emotional sensitivity analysis</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold tabular-nums">{currentState.shameRiskScore.toFixed(2)}</div>
                  <Badge className={`${getShameRiskColor(currentState.shameRiskLevel)} mt-1`}>
                    {currentState.shameRiskLevel}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <ArrowRight className="w-6 h-6 text-muted-foreground animate-pulse" />
        </div>

        <Card 
          className={`border-2 shadow-lg transition-all duration-500 ${
            isLowDistress 
              ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" 
              : "bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
          }`}
          data-testid="card-notification-output"
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Notification Output
              <Badge 
                className={`ml-2 ${isLowDistress ? "bg-blue-500" : "bg-amber-500"} text-white`}
              >
                {getFraming()} Framing
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className={`p-6 rounded-xl transition-all duration-500 ${
                isLowDistress 
                  ? "bg-[#E6F3FF] dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700" 
                  : "bg-[#FFD8B1]/60 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${isLowDistress ? "bg-blue-100 dark:bg-blue-800" : "bg-orange-100 dark:bg-orange-800"}`}>
                  {isLowDistress ? (
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                  ) : (
                    <Heart className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground mb-1">
                    {isLowDistress ? "Budget Update" : "A Gentle Note"}
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    {getMessage()}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    data-testid="button-view-details"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                AI Decision Rationale
              </p>
              <p className="text-sm text-muted-foreground">
                {isLowDistress 
                  ? "Low shame-risk detected. User is emotionally stable. Using direct, informative framing to deliver actionable insight efficiently."
                  : "High shame-risk detected. User shows signs of anxiety. Using supportive, empathetic framing to prevent emotional distress while still encouraging positive action."
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            variant={isLowDistress ? "default" : "outline"}
            onClick={() => setIsLowDistress(!isLowDistress)}
            className="gap-2"
            data-testid="button-toggle-distress"
          >
            {isLowDistress ? (
              <>
                <AlertTriangle className="w-4 h-4" />
                Simulate High Distress
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Simulate Low Distress
              </>
            )}
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>Envis Insight Engine v1.0 - Shame-Aware Notification System</p>
        </div>
      </div>
    </div>
  );
}

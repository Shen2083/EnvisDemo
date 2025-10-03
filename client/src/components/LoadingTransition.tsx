import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LoadingTransitionProps {
  onComplete: () => void;
}

const STEPS = [
  { id: 1, message: "Syncing your accounts...", duration: 1500 },
  { id: 2, message: "Analyzing transactions...", duration: 1500 },
  { id: 3, message: "Building your dashboard...", duration: 1200 },
];

export function LoadingTransition({ onComplete }: LoadingTransitionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    if (currentStep >= STEPS.length) {
      setTimeout(onComplete, 800);
      return;
    }

    const step = STEPS[currentStep];
    const progressIncrement = 100 / STEPS.length;
    const startProgress = currentStep * progressIncrement;
    const endProgress = (currentStep + 1) * progressIncrement;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (progressIncrement / (step.duration / 50));
        return Math.min(newProgress, endProgress);
      });
    }, 50);

    const timeout = setTimeout(() => {
      setCompletedSteps((prev) => [...prev, step.id]);
      setProgress(endProgress);
      setCurrentStep((prev) => prev + 1);
    }, step.duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [currentStep, onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-chart-3/5">
      <Card className="w-full max-w-md">
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
            </motion.div>

            <div className="w-full space-y-4">
              <Progress value={progress} className="h-2" data-testid="progress-loading" />
              
              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  {STEPS.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isCurrent = index === currentStep;
                    const isPending = index > currentStep;

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: isCompleted || isCurrent ? 1 : 0.4,
                          x: 0 
                        }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                              <CheckCircle2 className="h-5 w-5 text-chart-3" data-testid={`icon-complete-${step.id}`} />
                            </motion.div>
                          ) : isCurrent ? (
                            <Loader2 className="h-5 w-5 text-primary animate-spin" data-testid={`icon-loading-${step.id}`} />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted" data-testid={`icon-pending-${step.id}`} />
                          )}
                        </div>
                        <p className={`text-sm font-medium ${
                          isCompleted ? "text-muted-foreground" : 
                          isCurrent ? "text-foreground" : 
                          "text-muted-foreground"
                        }`} data-testid={`text-step-${step.id}`}>
                          {step.message}
                        </p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-muted-foreground"
              data-testid="text-loading-message"
            >
              Setting up your personalized financial view
            </motion.p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

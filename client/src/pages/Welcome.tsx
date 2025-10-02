import { useState } from "react";
import { WelcomeHero } from "@/components/WelcomeHero";
import { AuthForm } from "@/components/AuthForm";
import { AccountLinkingFlow } from "@/components/AccountLinkingFlow";

interface WelcomeProps {
  onComplete: () => void;
}

export default function Welcome({ onComplete }: WelcomeProps) {
  const [stage, setStage] = useState<"hero" | "auth" | "linking">("hero");
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");

  const handleAuthSubmit = (data: any) => {
    console.log("Auth submitted:", data);
    setStage("linking");
  };

  const handleLinkingComplete = (accounts: string[]) => {
    console.log("Accounts linked:", accounts);
    onComplete();
  };

  if (stage === "hero") {
    return (
      <WelcomeHero
        onSignUp={() => {
          setAuthMode("signup");
          setStage("auth");
        }}
        onLogin={() => {
          setAuthMode("login");
          setStage("auth");
        }}
      />
    );
  }

  if (stage === "auth") {
    return (
      <AuthForm
        mode={authMode}
        onSubmit={handleAuthSubmit}
        onSwitchMode={() => setAuthMode(authMode === "signup" ? "login" : "signup")}
      />
    );
  }

  return <AccountLinkingFlow onComplete={handleLinkingComplete} />;
}

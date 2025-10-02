import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthFormProps {
  mode: "signup" | "login";
  onSubmit: (data: { name?: string; email: string; password: string }) => void;
  onSwitchMode: () => void;
}

export function AuthForm({ mode, onSubmit, onSwitchMode }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(mode === "signup" ? { name, email, password } : { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {mode === "signup"
              ? "Start managing your family finances together"
              : "Log in to access your family dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  data-testid="input-name"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                data-testid="input-email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                data-testid="input-password"
              />
            </div>

            <Button type="submit" className="w-full" data-testid="button-submit">
              {mode === "signup" ? "Create Account" : "Log In"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              {mode === "signup" ? "Already have an account?" : "Don't have an account?"}
            </span>{" "}
            <button
              type="button"
              onClick={onSwitchMode}
              className="text-primary hover:underline"
              data-testid="button-switch-mode"
            >
              {mode === "signup" ? "Log in" : "Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

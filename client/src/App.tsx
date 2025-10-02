import { useState } from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotFound from "@/pages/not-found";
import Welcome from "@/pages/Welcome";
import Dashboard from "@/pages/Dashboard";
import Goals from "@/pages/Goals";
import Insights from "@/pages/Insights";
import { LayoutDashboard, Target, Lightbulb } from "lucide-react";

function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/goals", label: "Goals", icon: Target },
    { path: "/insights", label: "Insights", icon: Lightbulb },
  ];

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-heading font-bold">Envis</h1>
            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <a
                      className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover-elevate active-elevate-2"
                      }`}
                      data-testid={`link-${item.label.toLowerCase()}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

function Router() {
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return <Welcome onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <>
      <Navigation />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/goals" component={Goals} />
        <Route path="/insights" component={Insights} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

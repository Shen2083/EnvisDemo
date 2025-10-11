import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, RefreshCw, Trash2, CheckCircle, AlertCircle, TrendingUp, Landmark, FileText } from "lucide-react";
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
import { AccountLinkingFlow } from "@/components/AccountLinkingFlow";
import { StatementUpload } from "@/components/StatementUpload";

interface ConnectedAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountType: string;
  lastFourDigits: string;
  balance: number;
  status: "active" | "needs_refresh" | "error";
  lastSync: string;
}

interface UploadedAccount {
  id: string;
  accountName: string;
  accountType: "investment" | "premium_bonds";
  provider: string;
  balance: number;
  fileName: string;
  uploadDate: string;
}

export default function Accounts() {
  const [showLinkingFlow, setShowLinkingFlow] = useState(false);
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);
  const [refreshingAccountId, setRefreshingAccountId] = useState<string | null>(null);
  const [deletingUploadedAccountId, setDeletingUploadedAccountId] = useState<string | null>(null);
  const [uploadedAccounts, setUploadedAccounts] = useState<UploadedAccount[]>([]);
  
  // TODO: remove mock data - replace with real API data
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    {
      id: "1",
      bankName: "Barclays",
      accountName: "Joint Current Account",
      accountType: "Current Account",
      lastFourDigits: "4521",
      balance: 2450.75,
      status: "active",
      lastSync: "2 hours ago",
    },
    {
      id: "2",
      bankName: "Nationwide",
      accountName: "Shen's ISA",
      accountType: "Savings Account",
      lastFourDigits: "8834",
      balance: 8500.00,
      status: "active",
      lastSync: "1 hour ago",
    },
    {
      id: "3",
      bankName: "Santander",
      accountName: "Personal Savings",
      accountType: "Savings Account",
      lastFourDigits: "2019",
      balance: 12500.00,
      status: "needs_refresh",
      lastSync: "5 days ago",
    },
  ]);

  const handleDeleteAccount = () => {
    if (deletingAccountId) {
      setAccounts(accounts.filter(acc => acc.id !== deletingAccountId));
      console.log("Account removed:", deletingAccountId);
      setDeletingAccountId(null);
    }
  };

  const handleRefreshAccount = async (accountId: string) => {
    setRefreshingAccountId(accountId);
    // Simulate refresh
    setTimeout(() => {
      setAccounts(accounts.map(acc => 
        acc.id === accountId 
          ? { ...acc, status: "active" as const, lastSync: "Just now" }
          : acc
      ));
      setRefreshingAccountId(null);
      console.log("Account refreshed:", accountId);
    }, 1500);
  };

  const handleAddAccount = (linkedAccounts: string[]) => {
    // In a real app, this would add the account after successful linking
    console.log("Adding new accounts after linking flow:", linkedAccounts);
    setShowLinkingFlow(false);
  };

  const handleAccountUploaded = (account: UploadedAccount) => {
    setUploadedAccounts([...uploadedAccounts, account]);
    console.log("Account added via statement upload:", account);
  };

  const handleDeleteUploadedAccount = () => {
    if (deletingUploadedAccountId) {
      setUploadedAccounts(uploadedAccounts.filter(acc => acc.id !== deletingUploadedAccountId));
      console.log("Uploaded account removed:", deletingUploadedAccountId);
      setDeletingUploadedAccountId(null);
    }
  };

  if (showLinkingFlow) {
    return (
      <div>
        <div className="p-6">
          <Button
            variant="ghost"
            onClick={() => setShowLinkingFlow(false)}
            data-testid="button-cancel-linking"
          >
            ← Back to Accounts
          </Button>
        </div>
        <AccountLinkingFlow onComplete={handleAddAccount} />
      </div>
    );
  }

  const getStatusIcon = (status: ConnectedAccount['status']) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-chart-3" />;
      case "needs_refresh":
        return <AlertCircle className="h-4 w-4 text-chart-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusText = (status: ConnectedAccount['status']) => {
    switch (status) {
      case "active":
        return "Connected";
      case "needs_refresh":
        return "Needs Refresh";
      case "error":
        return "Connection Error";
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Connected Accounts</h1>
          <p className="text-muted-foreground">
            Manage your linked bank accounts and connections
          </p>
        </div>
        <Button onClick={() => setShowLinkingFlow(true)} data-testid="button-add-account">
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      {accounts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">No Connected Accounts</h3>
              <p className="text-muted-foreground mb-4">
                Link your first bank account to get started
              </p>
              <Button onClick={() => setShowLinkingFlow(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Connect Your First Account
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.id} className="hover-elevate">
              <CardHeader className="space-y-0 pb-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(account.status)}
                  </div>
                </div>
                <CardTitle className="text-lg font-heading">
                  {account.bankName}
                </CardTitle>
                <CardDescription className="text-sm">
                  {account.accountName} •••• {account.lastFourDigits}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-2xl font-bold tabular-nums mb-1">
                    £{account.balance.toLocaleString("en-GB", { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {account.accountType}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <span className="text-muted-foreground">Last synced:</span>
                  <span className="font-medium">{account.lastSync}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge 
                    variant={account.status === "active" ? "default" : "secondary"}
                    className="flex-1 justify-center"
                  >
                    {getStatusText(account.status)}
                  </Badge>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleRefreshAccount(account.id)}
                    disabled={refreshingAccountId === account.id}
                    data-testid={`button-refresh-${account.id}`}
                  >
                    <RefreshCw 
                      className={`h-4 w-4 mr-2 ${
                        refreshingAccountId === account.id ? "animate-spin" : ""
                      }`} 
                    />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingAccountId(account.id)}
                    data-testid={`button-remove-${account.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-6 pt-6 border-t">
        <div>
          <h2 className="text-2xl font-heading font-bold mb-2">Investment & Premium Bonds</h2>
          <p className="text-muted-foreground mb-6">
            Add investment accounts and premium bonds by uploading statements. Open Banking doesn't support these yet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StatementUpload onAccountAdded={handleAccountUploaded} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            {uploadedAccounts.length === 0 ? (
              <Card className="p-8 text-center bg-muted/30">
                <div className="flex flex-col items-center gap-3">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold mb-1">No Uploaded Accounts</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a statement to add your first investment or premium bond account
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {uploadedAccounts.map((account) => {
                  const Icon = account.accountType === "investment" ? TrendingUp : Landmark;
                  return (
                    <Card key={account.id} className="hover-elevate">
                      <CardHeader className="space-y-0 pb-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="h-12 w-12 rounded-lg bg-chart-1/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-chart-1" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Statement Upload
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-heading">
                          {account.provider}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {account.accountName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="text-2xl font-bold tabular-nums mb-1">
                            £{account.balance.toLocaleString("en-GB", { 
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2 
                            })}
                          </div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {account.accountType === "premium_bonds" ? "Premium Bonds" : "Investment Account"}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm pt-2 border-t">
                          <span className="text-muted-foreground">Uploaded:</span>
                          <span className="font-medium">{account.uploadDate}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm pb-2 border-b">
                          <span className="text-muted-foreground">Statement:</span>
                          <span className="font-medium text-xs truncate max-w-[200px]">{account.fileName}</span>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setDeletingUploadedAccountId(account.id)}
                          data-testid={`button-remove-uploaded-${account.id}`}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Account
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base font-semibold">About Account Connections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-chart-3 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground">Secure & Read-Only:</strong> We use Open Banking technology to securely connect to your accounts. We can only read your data, never make payments or transfers.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-chart-3 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground">Automatic Refresh:</strong> Your account balances and transactions sync automatically. If a connection needs refreshing, you'll see a notification.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-chart-3 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground">Remove Anytime:</strong> You can disconnect any account at any time. This immediately revokes Envis's access to that account.
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deletingAccountId} onOpenChange={(open) => !open && setDeletingAccountId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Connected Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect this account from Envis and remove all associated transaction data. 
              This action cannot be undone. You can always reconnect the account later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-remove">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} data-testid="button-confirm-remove">
              Remove Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deletingUploadedAccountId} onOpenChange={(open) => !open && setDeletingUploadedAccountId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Uploaded Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this account and its uploaded statement from Envis. 
              This action cannot be undone. You can always re-upload the statement later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-remove-uploaded">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUploadedAccount} data-testid="button-confirm-remove-uploaded">
              Remove Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

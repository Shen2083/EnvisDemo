import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, CheckCircle2, Lock, TrendingUp, Landmark, X } from "lucide-react";
import { StatementUpload, UploadedAccount } from "./StatementUpload";

interface AccountLinkingFlowProps {
  onComplete: (accounts: string[]) => void;
}

const UK_BANKS = [
  { id: "monzo", name: "Monzo" },
  { id: "starling", name: "Starling Bank" },
  { id: "barclays", name: "Barclays" },
  { id: "natwest", name: "NatWest" },
  { id: "hsbc", name: "HSBC" },
  { id: "lloyds", name: "Lloyds" },
];

const DEMO_ACCOUNTS = [
  { id: "joint", name: "Joint Account", type: "Current Account", balance: 800.50 },
  { id: "personal", name: "Personal Account", type: "Current Account", balance: 2450.00 },
  { id: "savings", name: "Personal Savings", type: "Savings Account", balance: 12500.00 },
  { id: "credit", name: "Credit Card", type: "Credit Card", balance: -450.00 },
];

export function AccountLinkingFlow({ onComplete }: AccountLinkingFlowProps) {
  const [step, setStep] = useState<"intro" | "selectBank" | "selectAccounts" | "success" | "uploadStatements">("intro");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [currentBankAccounts, setCurrentBankAccounts] = useState<string[]>([]);
  const [allConnectedAccounts, setAllConnectedAccounts] = useState<string[]>([]);
  const [connectedBanks, setConnectedBanks] = useState<string[]>([]);
  const [uploadedAccounts, setUploadedAccounts] = useState<UploadedAccount[]>([]);

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
    setTimeout(() => setStep("selectAccounts"), 500);
  };

  const handleAccountToggle = (accountId: string) => {
    setCurrentBankAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleConfirm = () => {
    // Add current bank's accounts to all connected accounts
    setAllConnectedAccounts((prev) => [...prev, ...currentBankAccounts]);
    if (selectedBank) {
      setConnectedBanks((prev) => [...prev, selectedBank]);
    }
    setStep("success");
  };

  const handleAddAnotherBank = () => {
    // Reset current bank selection but keep all connected accounts
    setSelectedBank(null);
    setCurrentBankAccounts([]);
    setStep("selectBank");
  };

  if (step === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-heading mb-2">
              Connect all your family accounts
            </CardTitle>
            <CardDescription className="text-base">
              Using secure Open Banking technology, link your accounts in seconds with bank-level security. 
              We never see your bank login details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <Lock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Read-only access</h3>
                <p className="text-sm text-muted-foreground">
                  We can only view your transactions and balances. We cannot move money or make changes to your accounts.
                </p>
              </div>
            </div>
            
            <Button
              size="lg"
              className="w-full"
              onClick={() => setStep("selectBank")}
              data-testid="button-connect-account"
            >
              Connect My First Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "selectBank") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Select your bank</CardTitle>
            <CardDescription>Choose which bank you'd like to connect</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {UK_BANKS.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleBankSelect(bank.id)}
                  className="flex items-center gap-3 p-4 border rounded-lg hover-elevate active-elevate-2 text-left"
                  data-testid={`button-bank-${bank.id}`}
                >
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <span className="font-medium">{bank.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "selectAccounts") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Select accounts to share</CardTitle>
            <CardDescription>
              Choose which accounts you'd like to connect to Envis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {DEMO_ACCOUNTS.map((account) => (
              <div
                key={account.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <Checkbox
                  id={account.id}
                  checked={currentBankAccounts.includes(account.id)}
                  onCheckedChange={() => handleAccountToggle(account.id)}
                  data-testid={`checkbox-account-${account.id}`}
                />
                <label
                  htmlFor={account.id}
                  className="flex-1 cursor-pointer"
                >
                  <div className="font-medium">{account.name}</div>
                  <div className="text-sm text-muted-foreground">{account.type}</div>
                </label>
                <div className="text-right tabular-nums">
                  <div className="font-medium">
                    £{Math.abs(account.balance).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            ))}

            <Button
              size="lg"
              className="w-full mt-6"
              onClick={handleConfirm}
              disabled={currentBankAccounts.length === 0}
              data-testid="button-confirm-accounts"
            >
              Connect {currentBankAccounts.length} {currentBankAccounts.length === 1 ? "Account" : "Accounts"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-chart-3/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-chart-3" />
              </div>
            </div>
            <CardTitle className="text-3xl font-heading mb-2">
              {connectedBanks.length === 1 ? "Great start!" : "You're all connected!"}
            </CardTitle>
            <CardDescription className="text-base">
              Successfully connected {allConnectedAccounts.length} {allConnectedAccounts.length === 1 ? "account" : "accounts"} from {connectedBanks.length} {connectedBanks.length === 1 ? "bank" : "banks"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {DEMO_ACCOUNTS.filter((acc) => allConnectedAccounts.includes(acc.id)).map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">{account.name}</div>
                  <div className="text-sm text-muted-foreground">{account.type}</div>
                </div>
                <div className="font-medium tabular-nums">
                  £{Math.abs(account.balance).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-3 pt-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleAddAnotherBank}
                data-testid="button-add-another-bank"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Add Another Bank
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setStep("uploadStatements")}
                data-testid="button-upload-investment-accounts"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Add Investment Accounts
              </Button>
              <Button
                size="lg"
                className="w-full"
                onClick={() => onComplete(allConnectedAccounts)}
                data-testid="button-view-dashboard"
              >
                See My Family Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Upload Statements step
  const handleStatementAdded = (account: UploadedAccount) => {
    setUploadedAccounts((prev) => [...prev, account]);
  };

  const handleRemoveUploadedAccount = (accountId: string) => {
    setUploadedAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Add Investment Accounts</CardTitle>
          <CardDescription>
            Upload statements for investment accounts and premium bonds not covered by Open Banking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StatementUpload onAccountAdded={handleStatementAdded} />

          {uploadedAccounts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Uploaded Accounts</h3>
              {uploadedAccounts.map((account) => {
                const Icon = account.accountType === "investment" ? TrendingUp : Landmark;
                return (
                  <div key={account.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-chart-1/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-chart-1" />
                      </div>
                      <div>
                        <div className="font-medium">{account.accountName}</div>
                        <div className="text-sm text-muted-foreground">{account.provider}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right tabular-nums">
                        <div className="font-medium">
                          £{account.balance.toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveUploadedAccount(account.id)}
                        data-testid={`button-remove-uploaded-${account.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <Button
              size="lg"
              className="w-full"
              onClick={() => onComplete(allConnectedAccounts)}
              data-testid="button-continue-to-dashboard"
            >
              {uploadedAccounts.length > 0 ? "Continue to Dashboard" : "Skip for Now"}
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={() => setStep("success")}
              data-testid="button-back-to-summary"
            >
              Back to Summary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

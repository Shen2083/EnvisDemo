import { useState } from "react";
import { Upload, FileText, X, TrendingUp, Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface UploadedAccount {
  id: string;
  accountName: string;
  accountType: "investment" | "premium_bonds";
  provider: string;
  balance: number;
  fileName: string;
  uploadDate: string;
}

interface StatementUploadProps {
  onAccountAdded: (account: UploadedAccount) => void;
}

export function StatementUpload({ onAccountAdded }: StatementUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [accountType, setAccountType] = useState<"investment" | "premium_bonds">("investment");
  const [accountName, setAccountName] = useState("");
  const [provider, setProvider] = useState("");
  const [balance, setBalance] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.type === "text/csv")) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !accountName || !provider || !balance) return;

    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newAccount: UploadedAccount = {
        id: Date.now().toString(),
        accountName,
        accountType,
        provider,
        balance: parseFloat(balance),
        fileName: selectedFile.name,
        uploadDate: new Date().toLocaleDateString("en-GB"),
      };

      onAccountAdded(newAccount);
      
      // Reset form
      setSelectedFile(null);
      setAccountName("");
      setProvider("");
      setBalance("");
      setIsUploading(false);
    }, 1000);
  };

  const getAccountTypeIcon = () => {
    return accountType === "investment" ? TrendingUp : Landmark;
  };

  const Icon = getAccountTypeIcon();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Statement
        </CardTitle>
        <CardDescription>
          Add investment accounts or premium bonds by uploading your latest statement (PDF or CSV)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="account-type">Account Type</Label>
          <Select
            value={accountType}
            onValueChange={(value) => setAccountType(value as "investment" | "premium_bonds")}
          >
            <SelectTrigger id="account-type" data-testid="select-account-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="investment">Investment Account</SelectItem>
              <SelectItem value="premium_bonds">Premium Bonds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider">Provider / Institution</Label>
          <Input
            id="provider"
            placeholder="e.g., Vanguard, NS&I"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            data-testid="input-provider"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-name">Account Name</Label>
          <Input
            id="account-name"
            placeholder="e.g., Stocks & Shares ISA"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            data-testid="input-account-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="balance">Current Balance (£)</Label>
          <Input
            id="balance"
            type="number"
            placeholder="0.00"
            step="0.01"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            data-testid="input-balance"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="statement-file">Upload Statement</Label>
          <div className="flex items-center gap-2">
            <Input
              id="statement-file"
              type="file"
              accept=".pdf,.csv"
              onChange={handleFileSelect}
              className="flex-1"
              data-testid="input-statement-file"
            />
          </div>
          {selectedFile && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm flex-1">{selectedFile.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setSelectedFile(null)}
                data-testid="button-remove-file"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !accountName || !provider || !balance || isUploading}
          className="w-full"
          data-testid="button-upload-statement"
        >
          {isUploading ? "Uploading..." : "Add Account"}
        </Button>
      </CardContent>
    </Card>
  );
}

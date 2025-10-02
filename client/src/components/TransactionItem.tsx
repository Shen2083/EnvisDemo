import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

interface TransactionItemProps {
  merchantName: string;
  amount: number;
  date: string;
  accountLabel: string;
  category: string;
}

export function TransactionItem({
  merchantName,
  amount,
  date,
  accountLabel,
  category,
}: TransactionItemProps) {
  const isDebit = amount < 0;

  return (
    <div className="flex items-center gap-4 p-4 border-b last:border-b-0 hover-elevate">
      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <Building2 className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{merchantName}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-muted-foreground">{date}</span>
          <Badge variant="secondary" className="text-xs">
            {accountLabel}
          </Badge>
        </div>
      </div>

      <div className="text-right">
        <div className={`font-medium tabular-nums ${isDebit ? "text-foreground" : "text-chart-3"}`}>
          {isDebit ? "-" : "+"}£{Math.abs(amount).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
        </div>
        <div className="text-sm text-muted-foreground">{category}</div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Scale, Heart, TrendingUp, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PartnerData {
  name: string;
  grossIncome: number;
  unpaidHours: number;
  hourlyValue: number;
}

interface FairnessData {
  partner1: PartnerData;
  partner2: PartnerData;
  beforeRatio: [number, number];
  afterRatio: [number, number];
  ratioShift: number;
}

interface FairnessCalculatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: FairnessData) => void;
  initialData?: FairnessData | null;
}

export function FairnessCalculatorModal({
  open,
  onOpenChange,
  onSave,
  initialData,
}: FairnessCalculatorModalProps) {
  const { toast } = useToast();
  
  const [partner1, setPartner1] = useState<PartnerData>({
    name: "Alex",
    grossIncome: 45000,
    unpaidHours: 10,
    hourlyValue: 15,
  });
  
  const [partner2, setPartner2] = useState<PartnerData>({
    name: "Sam",
    grossIncome: 35000,
    unpaidHours: 30,
    hourlyValue: 15,
  });

  useEffect(() => {
    if (initialData) {
      setPartner1(initialData.partner1);
      setPartner2(initialData.partner2);
    }
  }, [initialData]);

  const calculateVirtualIncome = (hours: number, hourlyValue: number) => {
    return hours * hourlyValue * 52;
  };

  const calculateTotalContribution = (partner: PartnerData) => {
    return partner.grossIncome + calculateVirtualIncome(partner.unpaidHours, partner.hourlyValue);
  };

  const partner1VirtualIncome = calculateVirtualIncome(partner1.unpaidHours, partner1.hourlyValue);
  const partner2VirtualIncome = calculateVirtualIncome(partner2.unpaidHours, partner2.hourlyValue);

  const partner1TotalContribution = calculateTotalContribution(partner1);
  const partner2TotalContribution = calculateTotalContribution(partner2);
  const totalContribution = partner1TotalContribution + partner2TotalContribution;

  const totalIncomeOnly = partner1.grossIncome + partner2.grossIncome;
  const beforeRatio1 = totalIncomeOnly > 0 ? Math.round((partner1.grossIncome / totalIncomeOnly) * 100) : 50;
  const beforeRatio2 = 100 - beforeRatio1;

  const afterRatio1 = totalContribution > 0 ? Math.round((partner1TotalContribution / totalContribution) * 100) : 50;
  const afterRatio2 = 100 - afterRatio1;

  const ratioShift = Math.abs(afterRatio1 - beforeRatio1);

  const higherUnpaidPartner = partner1.unpaidHours >= partner2.unpaidHours ? partner1 : partner2;
  const unpaidHoursForSummary = Math.max(partner1.unpaidHours, partner2.unpaidHours);

  const handleSave = () => {
    const data: FairnessData = {
      partner1,
      partner2,
      beforeRatio: [beforeRatio1, beforeRatio2],
      afterRatio: [afterRatio1, afterRatio2],
      ratioShift,
    };
    onSave(data);
    onOpenChange(false);
    toast({
      title: "Fairness Agreement Saved",
      description: `Your agreed split is now ${afterRatio1}/${afterRatio2}`,
    });
  };

  const formatCurrency = (value: number) => {
    return `£${value.toLocaleString("en-GB")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="dialog-fairness-calculator">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Fairness Engine Calculator
          </DialogTitle>
          <DialogDescription>
            Calculate fair financial contribution ratios by valuing unpaid labor alongside monetary income.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { data: partner1, setData: setPartner1, label: "Partner 1" },
              { data: partner2, setData: setPartner2, label: "Partner 2" },
            ].map(({ data, setData, label }, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-4 w-4 text-chart-1" />
                    {data.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`}>Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                      data-testid={`input-name-${index}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`income-${index}`}>Gross Annual Income</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                      <Input
                        id={`income-${index}`}
                        type="number"
                        className="pl-7"
                        value={data.grossIncome}
                        onChange={(e) => setData({ ...data, grossIncome: Number(e.target.value) || 0 })}
                        data-testid={`input-income-${index}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`hours-${index}`}>Unpaid Labour Hours/Week</Label>
                    <Input
                      id={`hours-${index}`}
                      type="number"
                      value={data.unpaidHours}
                      onChange={(e) => setData({ ...data, unpaidHours: Number(e.target.value) || 0 })}
                      data-testid={`input-hours-${index}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`hourly-${index}`}>Hourly Value (£)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                      <Input
                        id={`hourly-${index}`}
                        type="number"
                        className="pl-7"
                        value={data.hourlyValue}
                        onChange={(e) => setData({ ...data, hourlyValue: Number(e.target.value) || 0 })}
                        data-testid={`input-hourly-${index}`}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Virtual Income (Unpaid Labour)</span>
                      <span className="font-medium">
                        {formatCurrency(calculateVirtualIncome(data.unpaidHours, data.hourlyValue))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Economic Contribution</span>
                      <span className="font-bold text-primary">
                        {formatCurrency(calculateTotalContribution(data))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-chart-2" />
                Contribution Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Before (Income Only)</span>
                  <span className="text-muted-foreground">{beforeRatio1}/{beforeRatio2}</span>
                </div>
                <div className="flex gap-1 h-8 rounded-md overflow-hidden">
                  <div
                    className="bg-chart-1 flex items-center justify-center text-white text-xs font-medium transition-all"
                    style={{ width: `${beforeRatio1}%` }}
                    data-testid="bar-before-partner1"
                  >
                    {partner1.name} {beforeRatio1}%
                  </div>
                  <div
                    className="bg-chart-2 flex items-center justify-center text-white text-xs font-medium transition-all"
                    style={{ width: `${beforeRatio2}%` }}
                    data-testid="bar-before-partner2"
                  >
                    {partner2.name} {beforeRatio2}%
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">After (Fairness Split)</span>
                  <span className="text-primary font-bold">{afterRatio1}/{afterRatio2}</span>
                </div>
                <div className="flex gap-1 h-8 rounded-md overflow-hidden">
                  <div
                    className="bg-chart-1 flex items-center justify-center text-white text-xs font-medium transition-all"
                    style={{ width: `${afterRatio1}%` }}
                    data-testid="bar-after-partner1"
                  >
                    {partner1.name} {afterRatio1}%
                  </div>
                  <div
                    className="bg-chart-2 flex items-center justify-center text-white text-xs font-medium transition-all"
                    style={{ width: `${afterRatio2}%` }}
                    data-testid="bar-after-partner2"
                  >
                    {partner2.name} {afterRatio2}%
                  </div>
                </div>
              </div>

              {ratioShift > 0 && (
                <div className="p-4 bg-accent/30 rounded-lg">
                  <p className="text-sm">
                    By recognizing <strong>{higherUnpaidPartner.name}'s</strong> {unpaidHoursForSummary} hours of unpaid 
                    labor per week, the fair contribution shifts by <strong>{ratioShift}%</strong>.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-fairness">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-fairness">
            <Save className="h-4 w-4 mr-2" />
            Save Fairness Agreement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { FairnessData, PartnerData };

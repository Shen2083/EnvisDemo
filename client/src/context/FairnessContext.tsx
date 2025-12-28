import { createContext, useContext, useState, type ReactNode } from "react";

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

interface FairnessStatus {
  agreedRatio: [number, number];
  actualRatio: [number, number];
  isOnTrack: boolean;
}

interface FairnessContextType {
  fairnessData: FairnessData | null;
  setFairnessData: (data: FairnessData | null) => void;
  getFairnessStatus: () => FairnessStatus | null;
}

const defaultFairnessData: FairnessData = {
  partner1: {
    name: "Alex",
    grossIncome: 45000,
    unpaidHours: 10,
    hourlyValue: 15,
  },
  partner2: {
    name: "Sam",
    grossIncome: 35000,
    unpaidHours: 30,
    hourlyValue: 15,
  },
  beforeRatio: [56, 44],
  afterRatio: [48, 52],
  ratioShift: 8,
};

const FairnessContext = createContext<FairnessContextType | null>(null);

export function FairnessProvider({ children }: { children: ReactNode }) {
  const [fairnessData, setFairnessData] = useState<FairnessData | null>(defaultFairnessData);

  const getFairnessStatus = (): FairnessStatus | null => {
    if (!fairnessData) return null;
    
    return {
      agreedRatio: fairnessData.afterRatio,
      actualRatio: [fairnessData.afterRatio[0] - 1, fairnessData.afterRatio[1] + 1] as [number, number],
      isOnTrack: true,
    };
  };

  return (
    <FairnessContext.Provider value={{ fairnessData, setFairnessData, getFairnessStatus }}>
      {children}
    </FairnessContext.Provider>
  );
}

export function useFairness() {
  const context = useContext(FairnessContext);
  if (!context) {
    throw new Error("useFairness must be used within a FairnessProvider");
  }
  return context;
}

export type { FairnessData, PartnerData, FairnessStatus };

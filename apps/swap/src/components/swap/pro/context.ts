import { createContext } from "react";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { ChartButton } from "@icpswap/ui";

export interface SwapProContextProps {
  inputTokenPrice: number | undefined;
  outputTokenPrice: number | undefined;
  token: Token | undefined;
  setChartView: (view: ChartButton) => void;
  chartView: ChartButton | Null;
  activeTab: "SWAP" | "LIMIT";
  setActiveTab: (tab: "SWAP" | "LIMIT") => void;
}

export const SwapProContext = createContext({} as SwapProContextProps);

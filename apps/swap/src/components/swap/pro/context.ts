import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import type { ChartButton } from "@icpswap/ui";
import type { Tab } from "constants/index";
import { createContext, useContext } from "react";

export interface SwapProContextProps {
  inputTokenPrice: number | undefined;
  outputTokenPrice: number | undefined;
  token: Token | undefined;
  setChartView: (view: ChartButton) => void;
  chartView: ChartButton | Null;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const SwapProContext = createContext({} as SwapProContextProps);

export const useSwapProContext = () => {
  return useContext(SwapProContext);
};

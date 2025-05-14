import { createContext, useContext } from "react";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { ChartButton } from "@icpswap/ui";
import { Tab } from "constants/index";

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

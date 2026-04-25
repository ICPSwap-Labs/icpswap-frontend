import type { Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import type { ChartButton } from "@icpswap/ui";
import { Tab } from "constants/index";
import { create } from "zustand";

export interface SwapProContextProps {
  token: Token | undefined;
  setToken: (token: Token) => void;
  setChartView: (view: ChartButton) => void;
  chartView: ChartButton | Null;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const useSwapProStore = create<SwapProContextProps>((set) => ({
  token: undefined,
  setToken: (token: Token) => set(() => ({ token })),
  chartView: undefined,
  setChartView: (view: ChartButton) => set(() => ({ chartView: view })),
  activeTab: Tab.Swap,
  setActiveTab: (tab: Tab) => set(() => ({ activeTab: tab })),
}));

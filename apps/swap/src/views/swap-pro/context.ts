import { createContext } from "react";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { ChartButton } from "@icpswap/ui";

export interface SwapProContextProps {
  tradePoolId: string | undefined;
  setTradePoolId: (tradePoolId: string | undefined) => void;
  inputToken: Token | Null;
  setInputToken: (token: Token | Null) => void;
  outputToken: Token | Null;
  setOutputToken: (token: Token | Null) => void;
  inputTokenPrice: number | undefined;
  outputTokenPrice: number | undefined;
  token: Token | undefined;
  setChartView: (view: ChartButton) => void;
  chartView: ChartButton | Null;
}

export const SwapProContext = createContext({} as SwapProContextProps);

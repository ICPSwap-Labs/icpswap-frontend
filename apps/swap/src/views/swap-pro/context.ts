import { createContext } from "react";
import { Token } from "@icpswap/swap-sdk";

export interface SwapProContextProps {
  tradePoolId: string | undefined;
  setTradePoolId: (tradePoolId: string | undefined) => void;
  inputToken: Token | undefined;
  setInputToken: (token: Token | undefined) => void;
  outputToken: Token | undefined;
  setOutputToken: (token: Token | undefined) => void;
  inputTokenPrice: number | undefined;
  outputTokenPrice: number | undefined;
  token: Token | undefined;
}

export const SwapProContext = createContext({} as SwapProContextProps);

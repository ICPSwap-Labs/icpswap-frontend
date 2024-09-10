import { createContext } from "react";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";

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
}

export const SwapProContext = createContext({} as SwapProContextProps);

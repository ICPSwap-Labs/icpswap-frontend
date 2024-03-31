import { createContext } from "react";

export interface SwapProContextProps {
  tokenId: string | undefined;
  setTokenId: (tokenId: string | undefined) => void;
  tradePoolId: string | undefined;
  setTradePoolId: (tradePoolId: string | undefined) => void;
}

export const SwapProContext = createContext({} as SwapProContextProps);

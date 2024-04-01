import { createContext } from "react";
import type { PublicTokenOverview } from "@icpswap/types";

export interface SwapProContextProps {
  tokenId: string | undefined;
  setTokenId: (tokenId: string | undefined) => void;
  tradePoolId: string | undefined;
  setTradePoolId: (tradePoolId: string | undefined) => void;
  infoAllTokens: PublicTokenOverview[] | undefined;
}

export const SwapProContext = createContext({} as SwapProContextProps);

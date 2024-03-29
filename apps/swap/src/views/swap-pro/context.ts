import { createContext } from "react";
import { Trade, Token, TradeType } from "@icpswap/swap-sdk";

export interface SwapProContextProps {
  tokenId: string;
  setTokenId: (tokenId: string) => void;
  trade: Trade<Token, Token, TradeType.EXACT_INPUT> | undefined;
  setTrade: (tarde: Trade<Token, Token, TradeType.EXACT_INPUT>) => void;
}

export const SwapProContext = createContext({} as SwapProContextProps);

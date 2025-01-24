import { createContext } from "react";
import { Pool, Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";

export interface SwapContextProps {
  poolId: string | Null;
  setPoolId: (poolId: string) => void;
  selectedPool: Pool | Null;
  setSelectedPool: (pool: Pool) => void;
  cachedPool: Pool | Null;
  setCachedPool: (pool: Pool) => void;
  inputToken: Token | Null;
  setInputToken: (token: Token | Null) => void;
  outputToken: Token | Null;
  setOutputToken: (token: Token | Null) => void;
  noLiquidity: boolean | Null;
  setNoLiquidity: (noLiquidity: boolean | Null) => void;
  unavailableBalanceKeys: string[];
  setUnavailableBalanceKey: (key: string) => void;
  removeUnavailableBalanceKey: (key: string) => void;
  usdValueChange: string | null;
  setUSDValueChange: (change: string | null) => void;
}

export const SwapContext = createContext<SwapContextProps>({} as SwapContextProps);

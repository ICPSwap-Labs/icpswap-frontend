import { createContext } from "react";
import { Pool } from "@icpswap/swap-sdk";

export interface SwapContextProps {
  selectedPool: Pool | undefined | null;
  setSelectedPool: (pool: Pool) => void;
  unavailableBalanceKeys: string[];
  setUnavailableBalanceKey: (key: string) => void;
  removeUnavailableBalanceKey: (key: string) => void;
  refreshTrigger: number;
  setRefreshTrigger: () => void;
}

export const SwapContext = createContext<SwapContextProps>({} as SwapContextProps);

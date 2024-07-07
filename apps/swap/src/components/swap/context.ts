import { createContext } from "react";
import { Pool } from "@icpswap/swap-sdk";

export interface SwapContextProps {
  selectedPool: Pool | undefined | null;
  setSelectedPool: (pool: Pool) => void;
}

export const swapContext = createContext<SwapContextProps>({} as SwapContextProps);

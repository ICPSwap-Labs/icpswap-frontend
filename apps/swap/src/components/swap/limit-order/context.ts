import { createContext } from "react";
import { Pool, Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";

export interface LimitContextProps {
  selectedPool: Pool | Null;
  setSelectedPool: (pool: Pool | Null) => void;
  inputToken: Token | Null;
  setInputToken: (token: Token | Null) => void;
  outputToken: Token | Null;
  setOutputToken: (token: Token | Null) => void;
  noLiquidity: boolean | Null;
  setNoLiquidity: (noLiquidity: boolean | Null) => void;
  unavailableBalanceKeys: string[];
  setUnavailableBalanceKey: (key: string) => void;
  removeUnavailableBalanceKey: (key: string) => void;
  inverted: boolean;
  setInverted: (inverted: boolean) => void;
}

export const LimitContext = createContext<LimitContextProps>({} as LimitContextProps);

import { Null } from "@icpswap/types";
import { createContext } from "react";

interface ICPSwapContext {
  swapTVL: string | number | Null;
  farmTVL: string | number | Null;
  stakeTVL: string | number | Null;
  setSwapTVL: (tvl: string | number | Null) => void;
  setFarmTVL: (tvl: string | number | Null) => void;
  setStakeTVL: (tvl: string | number | Null) => void;
}

export const IcpswapContext = createContext({} as ICPSwapContext);

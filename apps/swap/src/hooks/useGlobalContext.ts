import { createContext, useContext } from "react";
import type { SwapPoolData } from "@icpswap/types";

export type GlobalContextProps = {
  AllPools: SwapPoolData[] | undefined;
};

export const GlobalContext = createContext({} as GlobalContextProps);

export function useGlobalContext() {
  return useContext(GlobalContext);
}

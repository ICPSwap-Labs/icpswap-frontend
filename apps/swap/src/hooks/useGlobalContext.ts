import { createContext, useContext, useMemo } from "react";
import type { SwapPoolData } from "@icpswap/types";

export type GlobalContextProps = {
  AllPools: SwapPoolData[] | undefined;
  refreshTriggers: { [key: string]: number };
  setRefreshTriggers: (key: string) => void;
};

export const GlobalContext = createContext({} as GlobalContextProps);

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export function useRefreshTrigger(key: string | undefined) {
  const { refreshTriggers } = useGlobalContext();

  return useMemo(() => {
    if (!key) return undefined;
    return refreshTriggers[key];
  }, [refreshTriggers, key]);
}

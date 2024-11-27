import { createContext, useContext, useMemo } from "react";
import type { SwapPoolData, PublicTokenOverview, Null } from "@icpswap/types";

export type GlobalContextProps = {
  AllPools: SwapPoolData[] | undefined;
  refreshTriggers: { [key: string]: number };
  setRefreshTriggers: (key: string) => void;
  infoAllTokens: PublicTokenOverview[] | Null;
  setInfoAllTokens: (args: PublicTokenOverview[]) => void;
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

export function useRefreshTriggerManager(key: string | undefined): [undefined | number, () => void] {
  const { refreshTriggers, setRefreshTriggers } = useGlobalContext();

  return useMemo(() => {
    if (!key) return [undefined, () => setRefreshTriggers("Global_key")];

    return [refreshTriggers[key], () => setRefreshTriggers(key)];
  }, [refreshTriggers, key, setRefreshTriggers]);
}

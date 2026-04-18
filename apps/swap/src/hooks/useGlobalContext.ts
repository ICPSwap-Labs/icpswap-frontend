import type { SwapPoolData } from "@icpswap/types";
import { createContext, useCallback, useContext, useMemo } from "react";

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

export function useRefreshTriggerManager(key: string | undefined): [number, () => void] {
  const { refreshTriggers, setRefreshTriggers } = useGlobalContext();

  const refresh = useCallback(() => {
    if (!key) return setRefreshTriggers("Global_key");
    setRefreshTriggers(key);
  }, [key, setRefreshTriggers]);

  return useMemo(() => {
    if (!key) return [0, refresh];

    return [refreshTriggers[key], refresh];
  }, [refreshTriggers, key, refresh]);
}

import { Route, Currency } from "@icpswap/swap-sdk";
import { useMemo } from "react";
import { useSwapPools } from "./useSwapPools";
import { useIsSingleHop } from "store/swapv2/cache/hooks";
import { computeAllRoutes } from "../useAllRoutes";

export function useAllRoutes(
  currencyIn: Currency | undefined,
  currencyOut: Currency | undefined,
): {
  loading: boolean;
  routes: Route<Currency, Currency>[];
} {
  const { pools, loading: poolsLoading } = useSwapPools(currencyIn, currencyOut);

  const singleHopOnly = useIsSingleHop();

  return useMemo(() => {
    if (poolsLoading || !pools || !currencyIn || !currencyOut) return { loading: true, routes: [] };

    const routes = computeAllRoutes(currencyIn, currencyOut, pools, [], [], currencyIn, singleHopOnly ? 1 : 2);

    return { loading: false, routes };
  }, [currencyIn, currencyOut, pools, poolsLoading, singleHopOnly]);
}

import { Route, Token } from "@icpswap/swap-sdk";
import { useMemo } from "react";
import { useIsSingleHop } from "store/swapv2/cache/hooks";
import { useSwapPools } from "./useSwapPools";
import { computeAllRoutes } from "../useAllRoutes";

export function useAllRoutes(
  currencyIn: Token | undefined,
  currencyOut: Token | undefined,
): {
  loading: boolean;
  routes: Route<Token, Token>[];
} {
  const { pools, loading: poolsLoading } = useSwapPools(currencyIn, currencyOut);

  const singleHopOnly = useIsSingleHop();

  return useMemo(() => {
    if (poolsLoading || !pools || !currencyIn || !currencyOut) return { loading: true, routes: [] };

    const routes = computeAllRoutes(currencyIn, currencyOut, pools, [], [], currencyIn, singleHopOnly ? 1 : 2);

    return { loading: false, routes };
  }, [currencyIn, currencyOut, pools, poolsLoading, singleHopOnly]);
}

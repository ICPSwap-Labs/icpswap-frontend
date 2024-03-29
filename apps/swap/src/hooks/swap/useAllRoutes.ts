import { Route, Pool, Token } from "@icpswap/swap-sdk";
import { useMemo } from "react";
import { useIsSingleHop } from "store/swap/cache/hooks";
import { useSwapPools } from "./useSwapPools";

function poolEquals(poolA: Pool, poolB: Pool) {
  return (
    poolA === poolB ||
    (poolA.token0.equals(poolB.token0) && poolA.token1.equals(poolB.token1) && poolA.fee === poolB.fee)
  );
}

export function computeAllRoutes(
  currencyIn: Token,
  currencyOut: Token,
  pools: (Pool | null)[],
  currentPath: Pool[],
  allPaths: Route<Token, Token>[],
  startCurrencyIn: Token = currencyIn,
  maxHops = 2,
) {
  const tokenIn = currencyIn?.wrapped;
  const tokenOut = currencyOut?.wrapped;

  if (!tokenIn || !tokenOut) throw new Error("Missing tokenIn/tokenOut");

  for (const pool of pools) {
    if (!pool || !pool.involvesToken(tokenIn) || currentPath.find((pathPool) => poolEquals(pool, pathPool))) continue;

    const outputToken = pool.token0.equals(tokenIn) ? pool.token1 : pool.token0;
    if (outputToken.equals(tokenOut)) {
      allPaths.push(new Route([...currentPath, pool], startCurrencyIn, currencyOut));
    } else if (maxHops > 1) {
      computeAllRoutes(outputToken, currencyOut, pools, [...currentPath, pool], allPaths, startCurrencyIn, maxHops - 1);
    }
  }

  return allPaths;
}

export function useAllRoutes(currencyIn: Token | undefined, currencyOut: Token | undefined) {
  const { pools, loading: poolsLoading, checked } = useSwapPools(currencyIn, currencyOut);

  const singleHopOnly = useIsSingleHop();

  return useMemo(() => {
    if (poolsLoading || !pools || !currencyIn || !currencyOut) return { loading: true, routes: [], checked: false };
    const routes = computeAllRoutes(currencyIn, currencyOut, pools, [], [], currencyIn, singleHopOnly ? 1 : 2);
    return { loading: false, routes, checked };
  }, [currencyIn, currencyOut, pools, poolsLoading, singleHopOnly, checked]);
}

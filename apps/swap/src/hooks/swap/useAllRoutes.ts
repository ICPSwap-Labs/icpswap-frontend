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
  tokenIn: Token,
  tokenOut: Token,
  pools: (Pool | null)[],
  currentPath: Pool[],
  allPaths: Route<Token, Token>[],
  startCurrencyIn: Token = tokenIn,
  maxHops = 2,
) {
  for (const pool of pools) {
    if (!pool || !pool.involvesToken(tokenIn) || currentPath.find((pathPool) => poolEquals(pool, pathPool))) continue;

    const outputToken = pool.token0.equals(tokenIn) ? pool.token1 : pool.token0;
    if (outputToken.equals(tokenOut)) {
      allPaths.push(new Route([...currentPath, pool], startCurrencyIn, tokenOut));
    } else if (maxHops > 1) {
      computeAllRoutes(outputToken, tokenOut, pools, [...currentPath, pool], allPaths, startCurrencyIn, maxHops - 1);
    }
  }

  return allPaths;
}

export function useAllRoutes(inputToken: Token | undefined, outputToken: Token | undefined) {
  const { pools, loading: poolsLoading, checked, noLiquidity } = useSwapPools(inputToken, outputToken);

  const singleHopOnly = useIsSingleHop();

  return useMemo(() => {
    if (poolsLoading || !pools || !inputToken || !outputToken) return { loading: true, routes: [], checked: false };
    const routes = computeAllRoutes(inputToken, outputToken, pools, [], [], inputToken, singleHopOnly ? 1 : 2);
    return { loading: false, routes, checked, noLiquidity };
  }, [inputToken, outputToken, pools, poolsLoading, singleHopOnly, checked, noLiquidity]);
}

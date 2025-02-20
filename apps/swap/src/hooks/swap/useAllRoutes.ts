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
  inputToken: Token,
  outputToken: Token,
  pools: (Pool | null)[],
  currentPath: Pool[],
  allPaths: Route<Token, Token>[],
  startCurrencyIn: Token = inputToken,
  maxHops = 2,
) {
  const tokenIn = inputToken?.wrapped;
  const tokenOut = outputToken?.wrapped;

  if (!tokenIn || !tokenOut) throw new Error("Missing tokenIn/tokenOut");

  for (const pool of pools) {
    if (!pool || !pool.involvesToken(tokenIn) || currentPath.find((pathPool) => poolEquals(pool, pathPool))) continue;

    const outputToken = pool.token0.equals(tokenIn) ? pool.token1 : pool.token0;
    if (outputToken.equals(tokenOut)) {
      allPaths.push(new Route([...currentPath, pool], startCurrencyIn, outputToken));
    } else if (maxHops > 1) {
      computeAllRoutes(outputToken, outputToken, pools, [...currentPath, pool], allPaths, startCurrencyIn, maxHops - 1);
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

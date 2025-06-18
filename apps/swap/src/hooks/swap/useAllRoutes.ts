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
  __inputToken: Token,
  __outputToken: Token,
  pools: (Pool | null)[],
  currentPath: Pool[],
  allPaths: Route<Token, Token>[],
  startCurrencyIn: Token = __inputToken,
  maxHops = 2,
) {
  if (!__inputToken || !__outputToken) throw new Error("Missing tokenIn/tokenOut");

  for (const pool of pools) {
    if (!pool || !pool.involvesToken(__inputToken) || currentPath.find((pathPool) => poolEquals(pool, pathPool)))
      continue;

    const outputToken = pool.alignToken(__outputToken);

    const alignedStartTokenIn = pool.alignToken(startCurrencyIn);

    if (outputToken.equals(__outputToken)) {
      allPaths.push(new Route([...currentPath, pool], alignedStartTokenIn, outputToken));
    } else if (maxHops > 1) {
      computeAllRoutes(
        outputToken,
        outputToken,
        pools,
        [...currentPath, pool],
        allPaths,
        alignedStartTokenIn,
        maxHops - 1,
      );
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

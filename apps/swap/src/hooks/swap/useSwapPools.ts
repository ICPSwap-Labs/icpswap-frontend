import { FeeAmount, Pool, Token } from "@icpswap/swap-sdk";
import { useMemo } from "react";
import { nonNullArgs } from "@icpswap/utils";

import { useAllCurrencyCombinations } from "./useAllCurrencyCombinations";
import { PoolState, usePools } from "./usePools";

export function useSwapPools(currencyIn: Token | undefined, currencyOut: Token | undefined) {
  const allCurrencyCombinations = useAllCurrencyCombinations(currencyIn, currencyOut);

  const allCurrencyCombinationsWithAllFees: [Token, Token, FeeAmount][] = useMemo(() => {
    return allCurrencyCombinations.reduce(
      (list, [tokenA, tokenB]) => {
        return list.concat([
          [tokenA, tokenB, FeeAmount.LOW],
          [tokenA, tokenB, FeeAmount.MEDIUM],
          // [tokenA, tokenB, FeeAmount.HIGH],
        ]);
      },
      [] as [Token, Token, FeeAmount][],
    );
  }, [allCurrencyCombinations]);

  const pools = usePools(allCurrencyCombinationsWithAllFees);

  const availablePools = pools
    .filter(([poolState, pool]) => {
      return (poolState === PoolState.EXISTS || poolState === PoolState.NOT_CHECK) && nonNullArgs(pool);
    })
    .map(([, pool]) => pool) as Pool[];

  return useMemo(() => {
    return {
      pools: availablePools,
      loading: pools.some(([state]) => state === PoolState.LOADING),
      checked: !pools.some(([state]) => state === PoolState.NOT_CHECK),
      noLiquidity: availablePools.length === 0,
    };
  }, [pools]);
}

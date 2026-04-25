import { FeeAmount, type Token } from "@icpswap/swap-sdk";
import { useAllCurrencyCombinations } from "hooks/swap/useAllCurrencyCombinations";
import { PoolState, usePools } from "hooks/swap/usePools";
import { useMemo } from "react";

export function useSwapPools(tokenIn: Token | undefined, tokenOut: Token | undefined) {
  const allCurrencyCombinations = useAllCurrencyCombinations(tokenIn, tokenOut);

  const allCurrencyCombinationsWithAllFees: [Token, Token, FeeAmount][] = useMemo(() => {
    return allCurrencyCombinations.reduce(
      (list, [tokenA, tokenB]) => {
        return list.concat([
          // [tokenA, tokenB, FeeAmount.LOW],
          [tokenA, tokenB, FeeAmount.MEDIUM],
          // [tokenA, tokenB, FeeAmount.HIGH],
        ]);
      },
      [] as [Token, Token, FeeAmount][],
    );
  }, [allCurrencyCombinations]);

  const pools = usePools(allCurrencyCombinationsWithAllFees);

  return useMemo(() => {
    return {
      pools: pools
        .filter((tuple) => {
          return (tuple[0] === PoolState.EXISTS || tuple[0] === PoolState.NOT_CHECK) && tuple[1] !== null;
        })
        .map(([, pool]) => pool),
      loading: pools.some(([state]) => state === PoolState.LOADING),
      checked: !pools.some(([state]) => state === PoolState.NOT_CHECK),
      noLiquidity: !!pools.find((tuple) => tuple[0] === PoolState.NOT_EXISTS),
    };
  }, [pools]);
}

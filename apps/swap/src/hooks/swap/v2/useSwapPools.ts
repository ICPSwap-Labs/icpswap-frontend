import { Currency, Token , FeeAmount } from "@icpswap/swap-sdk";
import { useMemo } from "react";
import { useAllCurrencyCombinations } from "../useAllCurrencyCombinations";
import { PoolState, usePools } from "./usePools";

export function useSwapPools(currencyIn: Currency | undefined, currencyOut: Currency | undefined) {
  const allCurrencyCombinations = useAllCurrencyCombinations(currencyIn, currencyOut);

  const allCurrencyCombinationsWithAllFees: [Token, Token, FeeAmount][] = useMemo(() => {
    return allCurrencyCombinations.reduce(
      (list, [tokenA, tokenB]) => {
        return list.concat([[tokenA, tokenB, FeeAmount.MEDIUM]]);
      },
      [] as [Token, Token, FeeAmount][],
    );
  }, [allCurrencyCombinations]);

  const pools = usePools(allCurrencyCombinationsWithAllFees);

  return useMemo(() => {
    return {
      pools: pools
        .filter((tuple) => {
          return tuple[0] === PoolState.EXISTS && tuple[1] !== null;
        })
        .map(([, pool]) => pool),
      loading: pools.some(([state]) => state === PoolState.LOADING),
    };
  }, [pools]);
}

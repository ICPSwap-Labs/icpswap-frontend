import { isNullArgs } from "@icpswap/utils";
import { Token, FeeAmount } from "@icpswap/swap-sdk";
import { useMemo, useEffect, useState } from "react";
import { getSwapPool, getSwapPoolMetadata } from "@icpswap/hooks";
import type { Null, PoolMetadata } from "@icpswap/types";

export interface PoolResult {
  poolId: string;
  metadata: PoolMetadata;
}

export async function getMultiPoolsMetadata(poolKeys: [Token | Null, Token | Null, FeeAmount | Null][]) {
  const transformedPoolKeys: ([Token, Token, FeeAmount] | null)[] = poolKeys.map(
    ([currencyA, currencyB, feeAmount]) => {
      if (!currencyA || !currencyB || !feeAmount) return null;

      const tokenA = currencyA?.wrapped;
      const tokenB = currencyB?.wrapped;
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return null;

      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

      return [token0, token1, feeAmount];
    },
  );

  return await Promise.all(
    transformedPoolKeys.map(async (ele) => {
      if (isNullArgs(ele)) return null;

      const [token0, token1, fee] = ele;

      // Args for get pool base ifo
      const args = {
        token0: { address: token0.wrapped.address, standard: token0.standard },
        token1: { address: token1.wrapped.address, standard: token1.standard },
        fee: BigInt(fee),
        sqrtPriceX96: "0",
      };

      const poolBaseInfo = await getSwapPool(args);

      if (poolBaseInfo) {
        const poolId = poolBaseInfo.canisterId.toString();
        const poolMetadata = await getSwapPoolMetadata(poolId);

        return {
          poolId,
          metadata: poolMetadata,
        };
      }

      return null;
    }),
  );
}

export function useMultiPoolsMetadata(poolKeys: [Token | undefined, Token | undefined, FeeAmount | undefined][]) {
  const [pools, setPools] = useState<(PoolResult | Null)[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function call() {
      if (poolKeys && poolKeys.length) {
        setLoading(true);

        const result = await getMultiPoolsMetadata(poolKeys);

        setPools(result);
        setLoading(false);
      }
    }

    call();
  }, [JSON.stringify(poolKeys)]);

  return useMemo(
    () => ({
      result: pools,
      loading,
    }),
    [pools, loading],
  );
}

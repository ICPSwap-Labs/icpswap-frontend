import { getSwapPool, getSwapPoolMetadata } from "@icpswap/hooks";
import type { FeeAmount, Token } from "@icpswap/swap-sdk";
import type { Null, PoolMetadata } from "@icpswap/types";
import { isUndefinedOrNull } from "@icpswap/utils";
import { useEffect, useMemo, useState } from "react";

export interface PoolResult {
  poolId: string;
  metadata: PoolMetadata;
}

export async function getPoolMetadataByPoolKey(poolKey: [Token | Null, Token | Null, FeeAmount | Null]) {
  const [tokenA, tokenB, feeAmount] = poolKey;

  if (!tokenA || !tokenB || !feeAmount || tokenA.equals(tokenB)) return null;

  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];

  // Args for get pool base ifo
  const args = {
    token0: { address: token0.wrapped.address, standard: token0.standard },
    token1: { address: token1.wrapped.address, standard: token1.standard },
    fee: BigInt(feeAmount),
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
}

export async function getMultiPoolsMetadata(poolKeys: [Token | Null, Token | Null, FeeAmount | Null][]) {
  return await Promise.all(
    poolKeys.map(async (key) => {
      if (isUndefinedOrNull(key)) return null;
      return await getPoolMetadataByPoolKey(key);
    }),
  );
}

export function useMultiPoolsMetadata(poolKeys: [Token | undefined, Token | undefined, FeeAmount | undefined][]) {
  const [pools, setPools] = useState<(PoolResult | Null)[]>([]);
  const [loading, setLoading] = useState(false);

  // biome-ignore lint: stringify array dependency to stop hook loop
  useEffect(() => {
    async function call() {
      if (poolKeys?.length) {
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

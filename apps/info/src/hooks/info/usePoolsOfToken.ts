import { getInfoPool, getInfoPoolStorageIds, usePoolsForToken, getPromisesAwait } from "@icpswap/hooks";
import { useState, useMemo, useEffect } from "react";
import { Override } from "@icpswap/types";
import type { PublicPoolOverView } from "types/analytic";

export type PoolData = Override<
  PublicPoolOverView,
  { tvlUSD: number; feeTier: bigint; volumeUSD: number; totalVolumeUSD: number; volume7D: number }
>;

export function usePoolsOfToken(canisterId: string | undefined) {
  const [loading, setLoading] = useState<boolean>(true);
  const [pools, setPools] = useState<PoolData[]>([]);

  const { result: poolsOfToken, loading: poolsOfTokenLoading } = usePoolsForToken(canisterId);

  const fetch_info_of_pool = async (pool: PublicPoolOverView) => {
    const storageIds = await getInfoPoolStorageIds(pool.pool);

    if (storageIds && storageIds.length > 0) {
      return await getInfoPool(storageIds[0], pool.pool);
    }

    return undefined;
  };

  useEffect(() => {
    async function call() {
      if (poolsOfTokenLoading || !poolsOfToken) return;

      if (!poolsOfTokenLoading && poolsOfToken?.length === 0) {
        setLoading(false);
        return;
      }

      const poolsInfo = await getPromisesAwait(
        poolsOfToken.map(async (pool) => await fetch_info_of_pool(pool)),
        20,
      );

      const pools = poolsOfToken
        ?.map((pool, index) => {
          const poolInfo = poolsInfo[index];
          if (!poolInfo) return undefined;

          return {
            ...pool,
            feeTier: poolInfo.feeTier,
            volumeUSD: poolInfo.volumeUSD,
            totalVolumeUSD: poolInfo.totalVolumeUSD,
            tvlUSD: 0,
            volume7D: poolInfo.volumeUSD7d,
          };
        })
        .filter((pool) => !!pool) as PoolData[];

      setPools(pools);

      setLoading(false);
    }

    call();
  }, [poolsOfToken, poolsOfTokenLoading]);

  return useMemo(() => ({ loading, pools }), [pools, loading]);
}

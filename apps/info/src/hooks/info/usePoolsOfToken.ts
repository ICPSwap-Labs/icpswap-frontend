import { getInfoPool, getInfoPoolStorageIds, usePoolsForToken, getPromisesAwait } from "@icpswap/hooks";
import { useState, useMemo, useEffect } from "react";
import type { PublicPoolOverView, InfoPublicPoolWithTvl } from "@icpswap/types";

export function usePoolsOfToken(canisterId: string | undefined) {
  const [loading, setLoading] = useState<boolean>(true);
  const [pools, setPools] = useState<InfoPublicPoolWithTvl[]>([]);

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

      const poolsInfo = await getPromisesAwait(poolsOfToken.map(async (pool) => await fetch_info_of_pool(pool)));

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
        .filter((pool) => !!pool) as InfoPublicPoolWithTvl[];

      setPools(pools);

      setLoading(false);
    }

    call();
  }, [poolsOfToken, poolsOfTokenLoading]);

  return useMemo(() => ({ loading, pools }), [pools, loading]);
}

export function usePoolsDataOfTokenByPools(poolsOfToken: PublicPoolOverView[] | undefined) {
  const [loading, setLoading] = useState<boolean>(false);
  const [pools, setPools] = useState<InfoPublicPoolWithTvl[]>([]);

  const fetch_info_of_pool = async (pool: PublicPoolOverView) => {
    const storageIds = await getInfoPoolStorageIds(pool.pool);
    if (storageIds && storageIds.length > 0) {
      return await getInfoPool(storageIds[0], pool.pool);
    }
    return undefined;
  };

  useEffect(() => {
    async function call() {
      setPools([]);

      if (!poolsOfToken || poolsOfToken.length === 0) {
        return;
      }

      setLoading(true);

      const poolsInfo = await Promise.all(poolsOfToken.map(async (pool) => await fetch_info_of_pool(pool)));

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
        .filter((pool) => !!pool) as InfoPublicPoolWithTvl[];

      setPools(pools);

      setLoading(false);
    }

    call();
  }, [poolsOfToken]);

  return useMemo(() => ({ loading, result: pools }), [pools, loading]);
}

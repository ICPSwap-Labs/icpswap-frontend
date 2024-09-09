import { useState, useMemo, useEffect } from "react";
import type { PublicPoolChartDayData } from "@icpswap/types";

import { useInfoPoolStorageIds } from "./node";
import { getInfoPoolChartData } from "./poolStorage";
import { getLimitedInfinityCall } from "../useLimitedInfinityCall";

export function usePoolAllChartData(poolId: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<undefined | PublicPoolChartDayData[]>(undefined);

  const { result: poolStorageIds, loading: storageLoading } = useInfoPoolStorageIds(poolId);

  useEffect(() => {
    async function call() {
      if (poolId && poolStorageIds && poolStorageIds.length > 0) {
        setLoading(true);

        const result = (
          await Promise.all(
            poolStorageIds.map(async (poolStorageId) => {
              const callback = async (offset: number, limit: number) => {
                return await getInfoPoolChartData(poolStorageId, poolId, offset, limit);
              };

              return await getLimitedInfinityCall<PublicPoolChartDayData>(callback, 1000, 5);
            }),
          )
        )
          .flat()
          .sort((a, b) => {
            if (a.timestamp < b.timestamp) return -1;
            if (a.timestamp > b.timestamp) return 1;
            return 0;
          });

        setLoading(false);
        setData(result);
      }
    }

    call();
  }, [poolStorageIds, poolId]);

  return useMemo(
    () => ({
      loading: loading || storageLoading,
      result: data,
    }),
    [loading, storageLoading, data],
  );
}

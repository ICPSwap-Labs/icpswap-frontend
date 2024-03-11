import { useState, useMemo, useEffect } from "react";
import { useInfoPoolStorageIds, getInfoPoolChartData } from "@icpswap/hooks";
import { getNoLengthPaginationAllData } from "hooks/useNoLengthPaginationData";
import { PublicPoolChartDayData } from "types/info";

export interface usePoolAllChartDataArgs {
  poolId: string | undefined;
}

export function usePoolAllChartData({ poolId }: usePoolAllChartDataArgs) {
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

              return await getNoLengthPaginationAllData<PublicPoolChartDayData>(callback, 1000, 5);
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

import { useState, useEffect, useMemo } from "react";
import type { TvlChartDayData } from "@icpswap/types";

import { useTvlStorageCanister } from "./global";
import { getPoolChartTvl } from "./globalTVL";
import { getLimitedInfinityCall } from "../useLimitedInfinityCall";

export function usePoolTvlChartData(canisterId: string | undefined) {
  const [loading, setLoading] = useState(false);

  const { result: tvlStorageIds, loading: storageLoading } = useTvlStorageCanister();

  const [chartData, setChartData] = useState<TvlChartDayData[] | undefined>(undefined);

  useEffect(() => {
    async function call() {
      if (tvlStorageIds && tvlStorageIds.length > 0 && canisterId) {
        setLoading(true);

        const chartData = (
          await Promise.all(
            tvlStorageIds.map(async (storageId) => {
              const callback = async (offset: number, limit: number) => {
                return await getPoolChartTvl(storageId, canisterId, offset, limit);
              };

              return await getLimitedInfinityCall<TvlChartDayData>(callback, 1000, 5);
            }),
          )
        )
          .flat()
          .sort((a, b) => {
            if (a.timestamp < b.timestamp) return -1;
            if (a.timestamp > b.timestamp) return 1;
            return 0;
          });

        // if (chartData) {
        //   if (chartData.length > 1000) {
        //     setChartData(chartData.slice(chartData.length - 1 - 1000, chartData.length - 1));
        //   } else {
        //     setChartData(chartData);
        //   }
        // }

        setChartData(chartData);
        setLoading(false);
      }
    }

    call();
  }, [canisterId, tvlStorageIds]);

  return useMemo(
    () => ({
      result: chartData,
      loading: loading || storageLoading,
    }),
    [chartData, loading, storageLoading],
  );
}

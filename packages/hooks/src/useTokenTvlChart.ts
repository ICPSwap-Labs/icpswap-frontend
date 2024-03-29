import { useState, useEffect, useMemo } from "react";
import { TvlChartDayData } from "@icpswap/types";
import { useTvlStorageCanister, getTokenChartTvl } from "./info";
import { getLimitedInfinityCall } from "./useLimitedInfinityCall";

export function useTokenTvlChart(canisterId: string | undefined) {
  const [loading, setLoading] = useState<boolean>(false);
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
                return await getTokenChartTvl(storageId, canisterId, offset, limit);
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

        setChartData(chartData);
        setLoading(false);
      }
    }

    call();
  }, [canisterId, tvlStorageIds]);

  return useMemo(
    () => ({
      loading: loading || storageLoading,
      result: chartData,
    }),
    [chartData, loading, storageLoading],
  );
}

import { useTvlStorageCanister, getTokenChartTvl } from "@icpswap/hooks";
import { useState, useEffect, useMemo } from "react";
import { TvlChartDayData } from "types/info";
import { getNoLengthPaginationAllData } from "hooks/useNoLengthPaginationData";

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

              return await getNoLengthPaginationAllData<TvlChartDayData>(callback, 1000, 5);
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
      loading: loading || storageLoading,
      result: chartData,
    }),
    [chartData, loading, storageLoading],
  );
}

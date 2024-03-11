import { getInfoTokenChartData, useInfoTokenStorageIds } from "@icpswap/hooks";
import { useState, useEffect, useMemo } from "react";
import { PublicTokenChartDayData } from "types/info";
import { getNoLengthPaginationAllData } from "hooks/useNoLengthPaginationData";

export function useTokenVolChart(canisterId: string | undefined) {
  const [loading, setLoading] = useState<boolean>(false);

  const { result: storageIds, loading: storageLoading } = useInfoTokenStorageIds(canisterId);

  const [chartData, setChartData] = useState<PublicTokenChartDayData[] | undefined>(undefined);

  useEffect(() => {
    async function call() {
      if (storageIds && storageIds.length > 0 && canisterId) {
        setLoading(true);

        const chartData = (
          await Promise.all(
            storageIds.map(async (storageId) => {
              const callback = async (offset: number, limit: number) => {
                return await getInfoTokenChartData(storageId, canisterId, offset, limit);
              };

              return await getNoLengthPaginationAllData<PublicTokenChartDayData>(callback, 1400, 4);
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
        //     setChartData(chartData.slice(0, 1000));
        //   } else {
        //     setChartData(chartData);
        //   }
        // }

        setChartData(chartData);
        setLoading(false);
      }
    }

    call();
  }, [canisterId, storageIds]);

  return useMemo(
    () => ({
      result: chartData,
      loading: loading || storageLoading,
    }),
    [chartData, loading, storageLoading],
  );
}

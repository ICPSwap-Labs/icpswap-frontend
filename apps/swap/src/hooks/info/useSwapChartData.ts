import { useGlobalStorageCanister, getSwapChartData } from "@icpswap/hooks";
import { useEffect, useMemo, useState } from "react";
import { PublicSwapChartDayData } from "@icpswap/types";

export function useChartData() {
  const { result: globalStorageIds } = useGlobalStorageCanister();

  const [chartData, setChartData] = useState<PublicSwapChartDayData[] | undefined>(undefined);

  useEffect(() => {
    async function call() {
      if (globalStorageIds && globalStorageIds.length > 0) {
        const data = await Promise.all(
          globalStorageIds.map(async (storageId) => {
            return await getSwapChartData(storageId);
          }),
        );

        const chartData = data.reduce((prev, curr) => {
          if (curr && prev) {
            return [...curr, ...prev];
          }

          return prev;
        }, [] as PublicSwapChartDayData[]);

        setChartData(chartData);
      }
    }

    call();
  }, [globalStorageIds]);

  return useMemo(() => chartData, [chartData]);
}

import { useMemo } from "react";
import { type InfoPriceChartData } from "@icpswap/types";

import { useInfoTokenPriceChart, useInfoTokenStorageIds } from "./info";

export function useTokenPriceChart(canisterId: string | undefined) {
  const { result: storageIds } = useInfoTokenStorageIds(canisterId);

  const { result: priceChartData, loading } = useInfoTokenPriceChart(
    storageIds ? storageIds[0] : undefined,
    canisterId,
    0,
    24 * 60 * 60,
    1000,
  );

  const priceChart: InfoPriceChartData[] = useMemo(() => {
    return priceChartData
      ?.map((data) => ({
        ...data,
        time: Number(data.timestamp),
        id: canisterId,
      }))
      .filter((ele) => ele.time !== 0)
      .sort((a, b) => {
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
        return 0;
      });
  }, [priceChartData, canisterId]);

  return useMemo(() => ({ loading, priceChartData: priceChart }), [priceChart, loading]);
}

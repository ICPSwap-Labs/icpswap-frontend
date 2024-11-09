import { useMemo } from "react";
import { type InfoPriceChartData } from "@icpswap/types";

import { useInfoTokenPriceChart, useInfoTokenStorageIds, getInfoTokenPriceChart, getInfoTokenStorageIds } from "./info";

export async function getTokenPriceChart(
  canisterId: string | undefined,
  interval: number = 24 * 60 * 60,
  limit = 1000,
) {
  const storageIds = await getInfoTokenStorageIds(canisterId);

  if (!storageIds || !storageIds[0]) return [];

  const chartData = await getInfoTokenPriceChart(storageIds[0], canisterId, 0, interval, limit);

  if (!chartData) return [];

  return chartData
    .map((data) => ({
      open: data.open,
      high: data.high,
      low: data.low,
      close: data.close,
      time: Number(data.timestamp) * 1000,
    }))
    .filter((ele) => ele.time !== 0)
    .sort((a, b) => {
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      return 0;
    });
}

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

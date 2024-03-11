import { useInfoTokenPriceChart, useInfoTokenStorageIds } from "@icpswap/hooks";
import { useMemo } from "react";

export function useTokenPriceChart(canisterId: string | undefined) {
  const { result: storageIds } = useInfoTokenStorageIds(canisterId);

  const { result: priceChartData, loading } = useInfoTokenPriceChart(
    storageIds ? storageIds[0] : undefined,
    canisterId,
    0,
    24 * 60 * 60,
    1000,
  );

  const priceChart = useMemo(() => {
    return priceChartData
      ?.map((data) => ({
        ...data,
        time: Number(data.timestamp),
        id: undefined,
      }))
      .filter((ele) => ele.time !== 0)
      .sort((a, b) => {
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
        return 0;
      })
      .map((d, index) => {
        return {
          ...d,
          open: d.timestamp.toString() === "1686787200" ? priceChartData[index - 1].close : d.open,
          close:
            d.timestamp.toString() === "1686787200" || d.timestamp.toString() === "1686873600"
              ? priceChartData[index + 1]?.open ?? d.close
              : d.close,
          low:
            d.timestamp.toString() === "1686787200"
              ? priceChartData[index - 1].close > (priceChartData[index + 1]?.open ?? 0)
                ? priceChartData[index + 1]?.open ?? priceChartData[index - 1]?.close ?? 0
                : priceChartData[index - 1].close
              : d.timestamp.toString() === "1686873600"
              ? priceChartData[index - 2].close > (priceChartData[index + 1]?.open ?? 0)
                ? priceChartData[index + 1]?.open ?? 0
                : priceChartData[index - 2]?.close ?? 0
              : d.low,
          timestamp: undefined,
        };
      });
  }, [priceChartData]);

  return useMemo(() => ({ loading, priceChartData: priceChart }), [priceChart, loading]);
}

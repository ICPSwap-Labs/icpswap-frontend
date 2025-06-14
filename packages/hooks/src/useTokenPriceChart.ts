import { getInfoTokenPriceChart, getInfoTokenStorageIds } from "./info";

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
      id: canisterId,
    }))
    .filter((ele) => ele.time !== 0)
    .sort((a, b) => {
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      return 0;
    });
}

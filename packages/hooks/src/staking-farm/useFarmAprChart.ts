import { farm } from "@icpswap/actor";
import { resultFormat } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

export async function getFarmAvgApr(farmId: string) {
  let result = null;

  try {
    result = await (await farm(farmId)).getAvgAPR();
  } catch (err) {
    console.warn(err);
  }

  return resultFormat<number>(result).data;
}

export function useFarmAvgApr(farmId: string | undefined, refresh?: number): UseQueryResult<number | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmAvgApr", farmId, refresh],
    queryFn: async () => {
      if (!farmId) return undefined;
      return await getFarmAvgApr(farmId);
    },
    enabled: !!farmId,
  });
}

export async function getFarmAprCharts(farmId: string) {
  let result = null;

  try {
    result = await (await farm(farmId)).getAPRRecord();
  } catch (err) {
    console.warn(err);
  }

  return resultFormat<Array<[bigint, number]>>(result).data;
}

export function useFarmAprCharts(
  farmId: string | undefined,
  refresh?: number,
): UseQueryResult<Array<[bigint, number]> | undefined, Error> {
  return useQuery({
    queryKey: ["useFarmAprCharts", farmId, refresh],
    queryFn: async () => {
      if (!farmId) return undefined;
      return await getFarmAprCharts(farmId);
    },
    enabled: !!farmId,
  });
}

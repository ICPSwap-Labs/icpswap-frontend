import { useCallback } from "react";
import { resultFormat } from "@icpswap/utils";
import { farm } from "@icpswap/actor";

import { useCallsData } from "../useCallData";

export async function getFarmAvgApr(farmId: string) {
  let result = null;

  try {
    result = await (await farm(farmId)).getAvgAPR();
  } catch (err) {
    console.warn(err);
  }

  return resultFormat<number>(result).data;
}

export function useFarmAvgApr(farmId: string | undefined, refresh?: number) {
  return useCallsData(
    useCallback(async () => {
      if (!farmId) return undefined;
      return await getFarmAvgApr(farmId);
    }, [farmId]),
    refresh,
  );
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

export function useFarmAprCharts(farmId: string | undefined, refresh?: number) {
  return useCallsData(
    useCallback(async () => {
      if (!farmId) return undefined;
      return await getFarmAprCharts(farmId);
    }, [farmId]),
    refresh,
  );
}

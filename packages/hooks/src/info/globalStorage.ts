import { useCallback } from "react";
import { resultFormat } from "@icpswap/utils";
import { useCallsData } from "../useCallData";
import { globalStorage } from "@icpswap/actor";
import { PublicSwapChartDayData } from "@icpswap/types";

/**
 * get swap public chart data
 * @param {string} id storage canister id
 */
export async function getSwapChartData(id: string) {
  return resultFormat<PublicSwapChartDayData[]>(
    await (await globalStorage(id)).getChartData()
  ).data;
}

/**
 * use swap public chart data
 * @param {(string | undefined)} id storage canister id
 */
export function useSwapChartData(id: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!id) return undefined;
      return await getSwapChartData(id!);
    }, [id])
  );
}

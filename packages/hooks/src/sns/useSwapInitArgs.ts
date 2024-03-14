import { resultFormat } from "@icpswap/utils";
import { useCallsData } from "../useCallData";
import { sns_swap } from "@icpswap/actor";
import type { GetInitResponse } from "@icpswap/types";
import { useCallback } from "react";

export async function getSNSSwapInitArgs(swap_id: string) {
  const result = resultFormat<GetInitResponse>(
    await (await sns_swap(swap_id)).get_init({})
  ).data;

  return result ? result.init[0] : undefined;
}

export function useSNSSwapInitArgs(swap_id: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!swap_id) return undefined;
      return await getSNSSwapInitArgs(swap_id);
    }, [swap_id])
  );
}

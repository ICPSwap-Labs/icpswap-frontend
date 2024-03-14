import { resultFormat } from "@icpswap/utils";
import { useCallsData } from "../useCallData";
import { sns_swap } from "@icpswap/actor";
import type { GetLifecycleResponse } from "@icpswap/types";
import { useCallback } from "react";

export async function getSwapLifeCycle(swap_id: string) {
  return resultFormat<GetLifecycleResponse>(
    await (await sns_swap(swap_id)).get_lifecycle({})
  ).data;
}

export function useSwapLifeCycle(swap_id: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!swap_id) return undefined;
      return await getSwapLifeCycle(swap_id);
    }, [swap_id])
  );
}

import { resultFormat } from "@icpswap/utils";
import { useCallsData } from "../useCallData";
import { sns_swap } from "@icpswap/actor";
import type { GetDerivedStateResponse } from "@icpswap/types";
import { useCallback } from "react";

export async function getSNSSwapDerivedState(swap_id: string) {
  return resultFormat<GetDerivedStateResponse>(
    await (await sns_swap(swap_id)).get_derived_state({})
  ).data;
}

export function useSNSSwapDerivedState(swap_id: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!swap_id) return undefined;
      return await getSNSSwapDerivedState(swap_id);
    }, [swap_id])
  );
}

import { resultFormat } from "@icpswap/utils";
import { useCallback } from "react";
import { swapPool } from "@icpswap/actor";
import { type SwapFailedTransaction } from "@icpswap/types";

import { useCallsData } from "../useCallData";

export async function getSwapFailedTransactions(canisterId: string) {
  return resultFormat<Array<[bigint, SwapFailedTransaction]>>(
    await (await swapPool(canisterId)).getFailedTransactions(),
  ).data;
}

export function useSwapFailedTransactions(canisterId: string | null | undefined, refreshTrigger?: boolean | number) {
  return useCallsData(
    useCallback(async () => {
      if (!canisterId) return undefined;
      return await getSwapFailedTransactions(canisterId);
    }, [canisterId]),
    refreshTrigger,
  );
}

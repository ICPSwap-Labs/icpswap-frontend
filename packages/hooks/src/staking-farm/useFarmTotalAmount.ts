import { useCallback } from "react";
import { resultFormat } from "@icpswap/utils";
import { farmIndex } from "@icpswap/actor";

import { useCallsData } from "../useCallData";

export async function getFarmTotalAmount() {
  const farmResult = await (await farmIndex()).getTotalAmount();
  return resultFormat<{ farmAmount: bigint; principalAmount: bigint }>(farmResult).data;
}

export function useFarmTotalAmount(reload?: boolean) {
  return useCallsData(
    useCallback(async () => {
      return await getFarmTotalAmount();
    }, []),
    reload,
  );
}

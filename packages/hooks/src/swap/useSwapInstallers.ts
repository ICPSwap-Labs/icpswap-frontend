import { useCallback } from "react";
import { swapFactory } from "@icpswap/actor";
import type { PoolInstaller } from "@icpswap/types";
import { resultFormat } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

export async function getSwapInstallers() {
  return resultFormat<PoolInstaller[]>(await (await swapFactory()).getPoolInstallers()).data;
}

export function useSwapInstallers() {
  return useCallsData(
    useCallback(async () => {
      return await getSwapInstallers();
    }, []),
  );
}

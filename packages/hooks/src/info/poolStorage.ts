import { useCallback } from "react";
import { icpswap_info_fetch_get } from "@icpswap/utils";
import { InfoPoolRealTimeDataResponse } from "@icpswap/types";

import { useCallsData } from "../useCallData";

export async function getInfoPool(poolId: string) {
  const result = await icpswap_info_fetch_get<InfoPoolRealTimeDataResponse>(`/pool/${poolId}`);
  return result?.data;
}

export function useInfoPool(poolId: string | undefined) {
  return useCallsData(
    useCallback(async () => {
      if (!poolId) return undefined;
      return await getInfoPool(poolId);
    }, [poolId]),
  );
}

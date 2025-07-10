import { useCallback } from "react";
import { Null } from "@icpswap/types";
import { icpswap_fetch_get } from "@icpswap/utils";

import { useCallsData } from "../useCallData";

export function useLiquidityChartPriceRange(poolId: string | Null) {
  return useCallsData(
    useCallback(async () => {
      if (!poolId) return undefined;
      return (await icpswap_fetch_get<{ minPrice: string; maxPrice: string }>(`/pool/price/recommend/${poolId}`))?.data;
    }, [poolId]),
  );
}

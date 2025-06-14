import { useCallback } from "react";
import { icpswap_info_fetch_get } from "@icpswap/utils";
import { PageResponse, InfoPoolDataResponse } from "@icpswap/types";

import { useCallsData } from "../useCallData";

interface GetPoolChartsProps {
  poolId: string;
  level: "m15" | "h1" | "d1";
  page: number;
  limit: number;
}

export async function getPoolCharts({ poolId, level, page, limit }: GetPoolChartsProps) {
  const result = await icpswap_info_fetch_get<PageResponse<InfoPoolDataResponse>>(`/pool/${poolId}/chart/${level}`, {
    page,
    limit,
  });
  return result?.data;
}

interface UsePoolChartsProps {
  poolId: string | undefined;
  level: "m15" | "h1" | "d1";
  page: number;
  limit: number;
}

export function usePoolCharts({ poolId, level, page, limit }: UsePoolChartsProps) {
  return useCallsData(
    useCallback(async () => {
      if (!poolId) return undefined;
      return await getPoolCharts({ page, poolId, level, limit });
    }, [poolId, level, page, limit]),
  );
}

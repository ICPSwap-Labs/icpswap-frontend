import { useCallback } from "react";
import { icpswap_fetch_get } from "@icpswap/utils";
import { PageResponse, InfoPoolDataResponse, Null, InfoPoolRealTimeDataResponse } from "@icpswap/types";

import { useCallsData } from "../useCallData";

interface GetPoolChartsProps {
  poolId: string;
  level: "m15" | "h1" | "d1";
  page: number;
  limit: number;
}

export async function getPoolCharts({ poolId, level, page, limit }: GetPoolChartsProps) {
  const result = await icpswap_fetch_get<PageResponse<InfoPoolDataResponse>>(`/info/pool/${poolId}/chart/${level}`, {
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

export async function getInfoPoolDetails({ poolId }: { poolId: string }) {
  const result = await icpswap_fetch_get<InfoPoolRealTimeDataResponse>(`/info/pool/${poolId}`);

  return result?.data;
}

export function useInfoPoolDetails({ poolId }: { poolId: string | Null }) {
  return useCallsData(
    useCallback(async () => {
      if (!poolId) return undefined;
      return await getInfoPoolDetails({ poolId });
    }, [poolId]),
  );
}

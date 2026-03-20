import type { InfoPoolDataResponse, InfoPoolRealTimeDataResponse, Null, PageResponse } from "@icpswap/types";
import { icpswap_fetch_get } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

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

export function usePoolCharts({
  poolId,
  level,
  page,
  limit,
}: UsePoolChartsProps): UseQueryResult<PageResponse<InfoPoolDataResponse> | undefined, Error> {
  return useQuery({
    queryKey: ["usePoolCharts", poolId, level, page, limit],
    queryFn: async () => {
      if (!poolId) return undefined;
      return await getPoolCharts({ page, poolId, level, limit });
    },
    enabled: !!poolId,
  });
}

export async function getInfoPoolDetails({ poolId }: { poolId: string }) {
  const result = await icpswap_fetch_get<InfoPoolRealTimeDataResponse>(`/info/pool/${poolId}`);

  return result?.data;
}

export function useInfoPoolDetails({
  poolId,
}: {
  poolId: string | Null;
}): UseQueryResult<InfoPoolRealTimeDataResponse | undefined, Error> {
  return useQuery({
    queryKey: ["useInfoPoolDetails", poolId],
    queryFn: async () => {
      if (!poolId) return undefined;
      return await getInfoPoolDetails({ poolId });
    },
    enabled: !!poolId,
  });
}

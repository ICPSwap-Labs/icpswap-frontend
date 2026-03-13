import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { icpswap_info_fetch_get } from "@icpswap/utils";
import type { InfoGlobalDataResponse, PageResponse } from "@icpswap/types";

export interface UseGlobalChartsProps {
  level: "m15" | "d1" | "h1";
  page: number;
  limit: number;
}

export function useGlobalCharts({
  level,
  page,
  limit,
}: UseGlobalChartsProps): UseQueryResult<PageResponse<InfoGlobalDataResponse> | undefined, Error> {
  return useQuery({
    queryKey: ["useGlobalCharts", level, page, limit],
    queryFn: async () => {
      return (
        await icpswap_info_fetch_get<PageResponse<InfoGlobalDataResponse>>(`/global/protocol/${level}`, {
          page,
          limit,
        })
      ).data;
    },
  });
}

import type { InfoTokenDataResponse, Null, PageResponse } from "@icpswap/types";
import { icpswap_info_fetch_get, isUndefinedOrNull } from "@icpswap/utils";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

type ChartLevel = "m15" | "h1" | "d1";

interface GetTokenChartsProps {
  tokenId: string;
  level: ChartLevel;
  page: number;
  limit: number;
}

export async function getTokenCharts({ tokenId, level, page, limit }: GetTokenChartsProps) {
  return (
    await icpswap_info_fetch_get<PageResponse<InfoTokenDataResponse>>(`/token/${tokenId}/chart/${level}`, {
      page,
      limit,
    })
  ).data;
}

interface UetTokenChartsProps {
  tokenId: string | Null;
  level: ChartLevel;
  page: number;
  limit: number;
}

export function useTokenCharts({
  tokenId,
  level,
  page,
  limit,
}: UetTokenChartsProps): UseQueryResult<PageResponse<InfoTokenDataResponse> | undefined, Error> {
  return useQuery({
    queryKey: ["useTokenCharts", tokenId, level, page, limit],
    queryFn: async () => {
      if (isUndefinedOrNull(tokenId)) return undefined;

      return await getTokenCharts({ tokenId, level, page, limit });
    },
    enabled: !isUndefinedOrNull(tokenId),
  });
}

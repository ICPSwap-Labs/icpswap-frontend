import { useCallback } from "react";
import { icpswap_info_fetch_get, isUndefinedOrNull } from "@icpswap/utils";
import type { PageResponse, Null, InfoTokenDataResponse } from "@icpswap/types";

import { useCallsData } from "../useCallData";

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

export function useTokenCharts({ tokenId, level, page, limit }: UetTokenChartsProps) {
  return useCallsData(
    useCallback(async () => {
      if (isUndefinedOrNull(tokenId)) return undefined;

      return await getTokenCharts({ tokenId, level, page, limit });
    }, [tokenId, level, page, limit]),
  );
}

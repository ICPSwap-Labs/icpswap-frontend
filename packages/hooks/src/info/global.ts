import { useCallback } from "react";
import { icpswap_info_fetch_get } from "@icpswap/utils";
import { InfoGlobalDataResponse, PageResponse } from "@icpswap/types";
import { useCallsData } from "../useCallData";

export interface UseGlobalChartsProps {
  level: "m15" | "d1" | "h1";
  page: number;
  limit: number;
}

export function useGlobalCharts({ level, page, limit }: UseGlobalChartsProps) {
  return useCallsData(
    useCallback(async () => {
      return (
        await icpswap_info_fetch_get<PageResponse<InfoGlobalDataResponse>>(`/global/protocol/${level}`, { page, limit })
      ).data;
    }, [level, page, limit]),
  );
}

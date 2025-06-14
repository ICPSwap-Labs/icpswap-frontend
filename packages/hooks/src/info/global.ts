import { useCallback } from "react";
import { icpswap_info_fetch_get, resultFormat } from "@icpswap/utils";
import { globalIndex } from "@icpswap/actor";
import { AllPoolsTVL, InfoGlobalDataResponse, PageResponse } from "@icpswap/types";
import { useCallsData } from "../useCallData";

export async function getAllPoolsTVL() {
  return resultFormat<AllPoolsTVL>(await (await globalIndex()).getAllPoolTvl()).data;
}

export function useAllPoolsTVL() {
  return useCallsData(
    useCallback(async () => {
      return await getAllPoolsTVL();
    }, []),
  );
}

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
